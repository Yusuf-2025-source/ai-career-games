import { Warning, ArrowLeft, Trophy, Reset, BadgeCheck, SadFace } from "./Icons.jsx";
import { BASE_BOUNCE, TARGET_BOUNCE } from "../gameData.js";

function Overlay({ active, children }) {
  return (
    <div className={`modal-overlay${active ? " active" : ""}`} aria-hidden={!active}>
      {children}
    </div>
  );
}

/* ----------------------------- نافذة البداية ----------------------------- */
export function IntroModal({ active, onStart }) {
  return (
    <Overlay active={active}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-alert-icon">
          <Warning size={38} />
        </div>
        <div className="modal-badge-danger">إنذار عاجل لمصمم الـ UI/UX</div>

        <h2 className="modal-title">"معدل خروج المستخدمين من صفحة الدفع وصل لـ {BASE_BOUNCE}%!"</h2>

        <p className="modal-desc">
          الناس بتدخل المتجر وتختار المنتجات، لكن أول ما توصل لصفحة الدفع بتهرب في ثانية واحدة! عندك دقيقتين لتطبيق
          قرارات وتعديلات الـ UI/UX المناسبة قبل أن نخسر مبيعات اليوم.
        </p>

        <div className="emergency-numbers">
          <div className="em-item">
            <span className="em-val red">{BASE_BOUNCE}%</span>
            <span className="em-lbl">معدل الخروج الحالي</span>
          </div>
          <div className="em-arrow">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </div>
          <div className="em-item">
            <span className="em-val green">{TARGET_BOUNCE}%</span>
            <span className="em-lbl">المستهدف بعد تعديلاتك</span>
          </div>
        </div>

        <div className="modal-tasks-box">
          <h4 className="tasks-box-title">مهامك في هذا التحدي:</h4>
          <ol className="tasks-list">
            <li>
              <strong>تحديد لون وحجم زر الشراء:</strong> زر رمادي صغير أم زر أخضر بارز؟
            </li>
            <li>
              <strong>تحديد بنية النموذج:</strong> 5 خانات معقدة أم خانتان فقط تختصر الوقت؟
            </li>
            <li>
              <strong>عرض خيارات الدفع والأمان:</strong> بدون وسائل واضحة أم خيارات تفاعلية مع شارة ضمان؟
            </li>
          </ol>
        </div>

        <div className="modal-footer-action">
          <button type="button" className="btn-primary full-width" onClick={onStart}>
            <span>ابدأ مهمة الإنقاذ الآن</span>
            <ArrowLeft size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ----------------------------- نافذة الفوز ----------------------------- */
export function VictoryModal({ active, onReplay, onFinish }) {
  return (
    <Overlay active={active}>
      <div className="modal-card modal-victory" role="dialog" aria-modal="true">
        <div className="victory-icon">
          <Trophy size={44} strokeWidth={1.8} />
        </div>
        <div className="modal-badge-success">تم حل المشكلة بنجاح</div>

        <h2 className="modal-title">
          مبروك! إنت للتو قمت بـ <span className="highlight-text">UI/UX Optimization</span>
        </h2>

        <div className="reveal-message">
          "التصميم مش مجرد شكل جمالي، إنت بتفكر في الـ <strong>UI/UX Design</strong> وتخلي تجربة وسلوك المستخدم سلسة،
          مقنعة ومريحة لقرار الشراء."
        </div>

        <div className="results-table">
          <div className="res-col">
            <span className="res-title">قبل التحسين:</span>
            <span>
              معدل الخروج: <strong className="red">{BASE_BOUNCE}%</strong>
            </span>
            <span>
              معدل الشراء: <strong>2%</strong>
            </span>
          </div>
          <div className="res-col highlight">
            <span className="res-title">بعد قراراتك:</span>
            <span>
              معدل الخروج: <strong className="green">{TARGET_BOUNCE}%</strong>
            </span>
            <span>
              معدل الشراء: <strong className="green">24%</strong>
            </span>
          </div>
        </div>

        <div className="modal-footer-action-grid">
          <button type="button" className="btn-outline" onClick={onReplay}>
            <Reset size={16} strokeWidth={2.2} />
            <span>تجربة خيارات أخرى</span>
          </button>
          <button type="button" className="btn-primary" onClick={onFinish}>
            <BadgeCheck size={16} strokeWidth={2.2} />
            <span>تم، فهمت دور الـ UI/UX!</span>
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ------------------------ نافذة انتهاء الوقت (الخسارة) ------------------------ */
export function TimeoutModal({ active, onRetry }) {
  return (
    <Overlay active={active}>
      <div className="modal-card modal-defeat" role="dialog" aria-modal="true">
        <div className="defeat-icon">
          <SadFace size={56} strokeWidth={1.8} />
        </div>
        <div className="modal-badge-danger">انتهى الوقت المتاح!</div>

        <h2 className="modal-title">للأسف، خسرنا زوار المتجر اليوم!</h2>

        <div className="defeat-message">
          الوقت نفد قبل أن تتمكن من إصلاح تجربة المستخدم، ومعدل خروج العملاء استمر عند <strong>{BASE_BOUNCE}%</strong>!
          في عالم الـ UI/UX كل ثانية تفرق في قرار الشراء.
        </div>

        <div className="defeat-stats">
          <div className="df-stat-item">
            <span className="df-label">الوقت المتبقي</span>
            <span className="df-val red">00:00</span>
          </div>
          <div className="df-stat-item">
            <span className="df-label">معدل الخروج</span>
            <span className="df-val red">{BASE_BOUNCE}%</span>
          </div>
          <div className="df-stat-item">
            <span className="df-label">النتيجة</span>
            <span className="df-val danger-text">لم تكتمل المهمة</span>
          </div>
        </div>

        <div className="modal-footer-action">
          <button type="button" className="btn-primary full-width" onClick={onRetry}>
            <Reset size={18} strokeWidth={2.2} />
            <span>حاول مرة أخرى وأنقذ المبيعات</span>
          </button>
        </div>
      </div>
    </Overlay>
  );
}
