import { MISSIONS } from "../gameData.js";
import { Play } from "./Icons.jsx";

export default function ControlPanel({ missions, hint, onSelect, onDeploy }) {
  return (
    <section className="dev-control-panel">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <span className="panel-tag">تحديات تجربة وواجهة المستخدم</span>
          <h2>ما هي قراراتك في الـ UI/UX لحل المشكلة؟</h2>
        </div>
      </div>

      <div className="tab-view active" id="view-controls">
        <p className="panel-intro">
          ادرس كل عنصر في واجهة الدفع، واختر التصميم وتجربة المستخدم (UI/UX) التي تراها تقلل من تشتت الزائر وترفع من
          نسبة إتمام الطلب:
        </p>

        {MISSIONS.map((m) => (
          <div className="mission-card" key={m.id} id={`card-mission-${m.id}`}>
            <div className="mission-num">{m.id}</div>
            <div className="mission-header">
              <h3>{m.title}</h3>
              <p>{m.question}</p>
            </div>

            <div className="options-grid">
              {["bad", "good"].map((key) => {
                const opt = m.options[key];
                const active = missions[m.id] === key;
                return (
                  <button
                    key={key}
                    type="button"
                    id={`opt-${m.id}-${key}`}
                    className={`option-card${active ? " active" : ""}`}
                    aria-pressed={active}
                    onClick={() => onSelect(m.id, key)}
                  >
                    <div className="option-top">
                      <span className="option-radio"></span>
                      <span className="option-label">{opt.label}</span>
                    </div>
                    <div className="option-details">
                      <strong>{opt.title}</strong>
                      <p>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {missions[m.id] === "bad" && (
              <div className="mission-hint" role="note" key={`hint-${m.id}`}>
                {m.hint}
              </div>
            )}
          </div>
        ))}

        <div className="action-bar">
          <button type="button" className="btn-primary" onClick={onDeploy}>
            <Play className="btn-svg" size={18} strokeWidth={2.2} />
            <span>تطبيق التعديلات واختبار النتيجة</span>
          </button>
          <div className="deploy-hint">{hint}</div>
        </div>
      </div>
    </section>
  );
}
