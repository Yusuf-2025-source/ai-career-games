import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";
import Confetti from "./components/Confetti.jsx";
import { IntroModal, VictoryModal, TimeoutModal } from "./components/Modals.jsx";
import { useSound, useAnimatedNumber, useLater } from "./hooks.js";
import {
  EMPTY_MISSIONS,
  TIMER_SECONDS,
  TEXT,
  calcBounce,
  conversionLabel,
  isAllGood,
  isComplete,
  previewStatus,
} from "./gameData.js";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [soundOn, setSoundOn] = useState(true);
  const [missions, setMissions] = useState(EMPTY_MISSIONS);
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [started, setStarted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [hasWon, setHasWonState] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, text, icon?, autoHide? }
  const [loading, setLoading] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  const hasWonRef = useRef(false);
  const sound = useSound(soundOn);
  const { later, cancelAll } = useLater();

  const setHasWon = (v) => {
    hasWonRef.current = v;
    setHasWonState(v);
  };

  const allGood = isAllGood(missions);
  const bounce = useAnimatedNumber(calcBounce(missions));

  /* الثيم */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* التايمر: بيشتغل بعد البداية وبيقف عند الفوز أو انتهاء الوقت */
  useEffect(() => {
    if (!started || hasWon || timedOut) return undefined;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [started, hasWon, timedOut]);

  /* انتهى الوقت ومفيش فوز: تظهر شاشة الخسارة */
  useEffect(() => {
    if (started && !hasWon && !timedOut && seconds <= 0) {
      setTimedOut(true);
      sound.timeout();
    }
  }, [started, hasWon, timedOut, seconds, sound]);

  /* إخفاء الرسائل تلقائيًا */
  useEffect(() => {
    if (!feedback?.autoHide) return undefined;
    const id = setTimeout(() => setFeedback(null), feedback.autoHide);
    return () => clearTimeout(id);
  }, [feedback]);

  const triggerVictory = useCallback(() => {
    if (hasWonRef.current) return;
    hasWonRef.current = true;
    setHasWonState(true);
    setConfettiKey((k) => k + 1);
    later(() => setShowReveal(true), 300);
  }, [later]);

  /* ----------------------------- الأحداث ----------------------------- */
  const handleStart = () => {
    sound.init();
    sound.click();
    setStarted(true);
  };

  const handleSelect = (mission, option) => {
    // صح: تصفيق جمهور واضح. غير كده: صوت هادئ مع تلميح (من غير ما نقول إنه غلط)
    if (option === "good") sound.clap();
    else sound.hint();
    setHasWon(false);
    setFeedback(null);
    setMissions((m) => ({ ...m, [mission]: option }));
    setPopKey((k) => k + 1);
  };

  const handleDeploy = () => {
    sound.init();

    if (!isComplete(missions)) {
      sound.error();
      alert(TEXT.incompleteAlert);
      return;
    }

    if (isAllGood(missions)) {
      sound.success();
      setFeedback({ type: "success", text: TEXT.successToast });
      triggerVictory();
    } else {
      setHasWon(false);
      sound.error();
      setFeedback({ type: "error", text: TEXT.deployErrorToast, autoHide: 4000 });
      alert(TEXT.notOptimalAlert);
    }
  };

  const handleCheckout = () => {
    sound.init();
    sound.click();
    setFeedback(null);

    if (!isComplete(missions)) {
      sound.error();
      setFeedback({ type: "error", icon: "alert", text: TEXT.liveIncomplete, autoHide: 3500 });
      return;
    }

    if (isAllGood(missions)) {
      setLoading(true);
      later(() => {
        setLoading(false);
        setFeedback({ type: "success", text: TEXT.successToast, autoHide: 3000 });
        sound.success();
        if (!hasWonRef.current) later(triggerVictory, 500);
      }, 450);
    } else {
      setHasWon(false);
      sound.error();
      setFeedback({ type: "error", icon: "x", text: TEXT.liveFailed, autoHide: 4000 });
    }
  };

  const resetGame = () => {
    cancelAll();
    setMissions(EMPTY_MISSIONS);
    setHasWon(false);
    setSeconds(TIMER_SECONDS);
    setTimedOut(false);
    setShowReveal(false);
    setFeedback(null);
    setLoading(false);
    setPopKey(0);
  };

  const handleTimeoutRetry = () => {
    sound.init();
    sound.click();
    resetGame();
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    // الـ ref بيتحدّث في الريندر الجاي، فنشغل النقرة بعده لو الصوت اتفتح
    if (next) setTimeout(sound.click, 0);
  };

  return (
    <>
      <Confetti runKey={confettiKey} />

      <Header
        seconds={seconds}
        bounce={bounce}
        popKey={popKey}
        allGood={allGood}
        conversionText={conversionLabel(missions)}
        theme={theme}
        soundOn={soundOn}
        onToggleTheme={() => {
          sound.click();
          setTheme((t) => (t === "dark" ? "light" : "dark"));
        }}
        onToggleSound={handleToggleSound}
        onRestart={resetGame}
      />

      <main className="game-container">
        <ControlPanel
          missions={missions}
          hint={allGood ? TEXT.hintOptimal : TEXT.hintDefault}
          onSelect={handleSelect}
          onDeploy={handleDeploy}
        />
        <PreviewPanel
          missions={missions}
          allGood={allGood}
          statusText={previewStatus(missions)}
          feedback={feedback}
          loading={loading}
          onCheckout={handleCheckout}
        />
      </main>

      <IntroModal active={!started} onStart={handleStart} />
      <VictoryModal
        active={showReveal}
        onReplay={resetGame}
        onFinish={() => setShowReveal(false)}
      />
      <TimeoutModal active={timedOut} onRetry={handleTimeoutRetry} />
    </>
  );
}
