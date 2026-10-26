import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ---------------------------- الصوت (Web Audio) ---------------------------- */
export function useSound(enabled) {
  const ctxRef = useRef(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const init = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") ctxRef.current.resume();
  }, []);

  const tone = useCallback(
    (freq, duration, type = "sine", gainVal = 0.1) => {
      if (!enabledRef.current) return;
      try {
        init();
        const ctx = ctxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* الصوت بيفشل بهدوء */
      }
    },
    [init]
  );

  /* نغمة ناعمة بدخول تدريجي (من غير طقطقة) — بتستخدم للتلميح */
  const soft = useCallback(
    (freq, startOffset, duration, gainVal) => {
      try {
        const ctx = ctxRef.current;
        if (!ctx) return;
        const t0 = ctx.currentTime + startOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(gainVal, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + duration + 0.02);
      } catch {
        /* الصوت بيفشل بهدوء */
      }
    },
    []
  );

  /* تصفيق قريب وواضح: 10 تصفيقات متتالية بصدى خفيف */
  const clap = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      init();
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (!ctx._noise) {
        const len = ctx.sampleRate;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        ctx._noise = buf;
      }
      const noise = ctx._noise;

      const T = 1.7;
      const now = ctx.currentTime + 0.02;

      // مسار الصوت: ضاغط + صدى قاعة
      const comp = ctx.createDynamicsCompressor();
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.9, now);
      out.gain.setValueAtTime(0.9, now + T - 0.5);
      out.gain.exponentialRampToValueAtTime(0.001, now + T + 0.24);
      comp.connect(out);
      out.connect(ctx.destination);
      const input = ctx.createGain();
      input.connect(comp);
      const len = Math.floor(ctx.sampleRate * 0.4);
      const imp = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = imp.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      const conv = ctx.createConvolver();
      conv.buffer = imp;
      const wet = ctx.createGain();
      wet.gain.value = 0.15;
      input.connect(conv);
      conv.connect(wet);
      wet.connect(comp);

      // تصفيقة واحدة: طقة عالية + جسم منخفض (كف على كف)
      const hit = (when, amp) => {
        const s = ctx.createBufferSource();
        s.buffer = noise;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 700;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1200 + Math.random() * 1600;
        bp.Q.value = 1.1;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(amp, when + 0.001);
        g.gain.exponentialRampToValueAtTime(0.001, when + 0.045 + Math.random() * 0.03);
        s.connect(hp);
        hp.connect(bp);
        bp.connect(g);
        g.connect(input);
        s.start(when, Math.random() * 0.8);
        s.stop(when + 0.12);

        const b = ctx.createBufferSource();
        b.buffer = noise;
        const lp = ctx.createBiquadFilter();
        lp.type = "bandpass";
        lp.frequency.value = 450 + Math.random() * 250;
        lp.Q.value = 0.9;
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0.0001, when);
        bg.gain.linearRampToValueAtTime(amp * 0.7, when + 0.001);
        bg.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
        b.connect(lp);
        lp.connect(bg);
        bg.connect(input);
        b.start(when, Math.random() * 0.8);
        b.stop(when + 0.08);
      };

      let t = now + 0.03;
      for (let i = 0; i < 10; i++) {
        hit(t, 0.75 + Math.random() * 0.2);
        t += 0.12 + Math.random() * 0.06;
      }
    } catch {
      /* الصوت بيفشل بهدوء */
    }
  }, [init]);

  return useMemo(
    () => ({
      init,
      click: () => tone(540, 0.05, "triangle", 0.08),
      // صوت هادئ ومشجع (مش محبط): نغمتين ناعمتين صاعدتين للتلميح
      hint: () => {
        if (!enabledRef.current) return;
        init();
        soft(440, 0, 0.28, 0.07);
        soft(587, 0.13, 0.36, 0.07);
      },
      clap,
      error: () => {
        if (!enabledRef.current) return;
        init();
        soft(392, 0, 0.22, 0.07);
        soft(330, 0.12, 0.3, 0.06);
      },
      success: () => {
        tone(523, 0.1, "sine", 0.1);
        setTimeout(() => tone(659, 0.1, "sine", 0.1), 80);
        setTimeout(() => tone(784, 0.2, "sine", 0.1), 160);
      },
      timeout: () => {
        tone(360, 0.16, "sawtooth", 0.1);
        setTimeout(() => tone(300, 0.18, "sawtooth", 0.1), 140);
        setTimeout(() => tone(220, 0.32, "sawtooth", 0.12), 320);
      },
    }),
    [init, tone, soft, clap]
  );
}

/* ------------------- عدّاد أرقام انسيابي (معدل الخروج) ------------------- */
export function useAnimatedNumber(target, duration = 380) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const start = fromRef.current;
    if (start === target) return undefined;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * ease);
      fromRef.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ------------- setTimeout آمن: بيتلغي مع الـ reset أو الـ unmount ------------- */
export function useLater() {
  const ids = useRef(new Set());

  const later = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
    return id;
  }, []);

  const cancelAll = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current.clear();
  }, []);

  useEffect(() => cancelAll, [cancelAll]);

  return { later, cancelAll };
}
