import { Clock, TrendDown, Cart, Layers, Sun, Moon, VolumeOn, VolumeOff, Reset } from "./Icons.jsx";
import { formatTime, isTimerDanger } from "../gameData.js";

export default function Header({
  seconds,
  bounce,
  popKey,
  allGood,
  conversionText,
  theme,
  soundOn,
  onToggleTheme,
  onToggleSound,
  onRestart,
}) {
  const pop = popKey > 0 ? " pill-pop" : "";

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* العلامة التجارية والمسار */}
        <div className="header-brand">
          <div className="career-logo">
            <div className="brand-symbol">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <span className="logo-text-career">Career</span>
              <span className="logo-text-path">Path</span>
              <span className="logo-dot">.</span>
            </div>
          </div>
          <div className="track-tag">
            <span className="track-tag-dot" aria-hidden="true"></span>
            <span>مسار تصميم الواجهات وتجربة المستخدم • UI/UX</span>
          </div>
        </div>

        {/* مؤشرات الأداء المباشرة */}
        <div className="header-stats" role="region" aria-label="مؤشرات الأداء المباشرة">
          <div className={`stat-pill timer-pill${isTimerDanger(seconds) ? " timer-danger" : ""}`}>
            <div className="pill-icon-box">
              <Clock className="nav-svg-icon" />
            </div>
            <div className="pill-data">
              <span className="pill-label">الوقت المتبقي</span>
              <span className="pill-val mono-digit">{formatTime(seconds)}</span>
            </div>
          </div>

          <div className={`stat-pill bounce-pill${allGood ? " optimal" : ""}`}>
            <div className="pill-icon-box icon-bounce">
              <TrendDown className="nav-svg-icon" strokeWidth={2.2} />
            </div>
            <div className="pill-data">
              <span className="pill-label">معدل الخروج (Bounce)</span>
              <span key={popKey} className={`pill-val ${allGood ? "success-text" : "danger-text"}${pop}`}>
                {bounce}%
              </span>
            </div>
          </div>

          <div className="stat-pill sales-pill">
            <div className="pill-icon-box icon-sales">
              <Cart className="nav-svg-icon" />
            </div>
            <div className="pill-data">
              <span className="pill-label">حالة التحويل</span>
              <span key={`c-${popKey}`} className={`pill-val${allGood ? pop : ""}`}>
                {conversionText}
              </span>
            </div>
          </div>
        </div>

        {/* التحكم: الثيم والصوت وإعادة التشغيل */}
        <div className="header-actions-group">
          <div className="header-divider" aria-hidden="true"></div>
          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={onToggleTheme}
              title="تبديل المظهر (فاتح / داكن)"
              aria-label="تبديل الثيم"
            >
              <span className="icon-wrapper">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</span>
            </button>
            <button className="btn-icon" onClick={onToggleSound} title="كتم / تشغيل الصوت" aria-label="تبديل الصوت">
              <span className="icon-wrapper">{soundOn ? <VolumeOn size={17} /> : <VolumeOff size={17} />}</span>
            </button>
            <button className="btn-icon" onClick={onRestart} title="إعادة تشغيل التحدي" aria-label="إعادة تشغيل التحدي">
              <span className="icon-wrapper">
                <Reset size={17} strokeWidth={2.2} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
