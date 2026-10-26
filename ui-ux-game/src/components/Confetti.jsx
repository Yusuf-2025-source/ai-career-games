import { useEffect, useRef } from "react";

const COLORS = ["#2172CD", "#1FBF8A", "#FACC15", "#8B5CF6", "#14C2B2"];

// بيشتغل كل ما runKey يزيد (يعني كل فوز جديد)
export default function Confetti({ runKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!runKey) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 70 }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      alpha: 1,
    }));

    let frames = 0;
    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.alpha -= 0.015;
        if (p.alpha > 0) {
          alive = true;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.w, p.h);
        }
      });
      frames++;
      if (alive && frames < 120) {
        raf = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [runKey]);

  return <canvas id="confetti-canvas" ref={canvasRef} />;
}
