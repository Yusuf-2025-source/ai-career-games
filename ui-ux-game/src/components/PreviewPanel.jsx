import { AlertCircle, XCircle, CheckCircle, Headphones, Lock, Shield, CardIcon, Phone, Cash } from "./Icons.jsx";

function EmptyNote({ children }) {
  return (
    <span className="empty-note">
      <AlertCircle className="empty-note-icon" size={14} />
      <span>{children}</span>
    </span>
  );
}

function PaymentSection({ state }) {
  return (
    <div className="checkout-payment-section" id="mockup-payment-section">
      {state === null && (
        <div className="payment-state-empty">
          <EmptyNote>لم يتم تحديد طريقة عرض وسائل الدفع بعد</EmptyNote>
        </div>
      )}

      {state === "bad" && (
        <div className="payment-state-bad">
          <div className="bad-payment-banner">
            <span>طريقة الدفع: غير محددة (الدفع الإلكتروني العام)</span>
          </div>
        </div>
      )}

      {state === "good" && (
        <div className="payment-state-good">
          <span className="section-mini-title">اختر طريقة الدفع المفضلة:</span>
          <div className="payment-tabs-grid">
            <div className="payment-tab active">
              <span>
                <CardIcon /> بطاقة بنكية
              </span>
            </div>
            <div className="payment-tab">
              <span>
                <Phone /> محفظة ذكية
              </span>
            </div>
            <div className="payment-tab">
              <span>
                <Cash /> عند الاستلام
              </span>
            </div>
          </div>
          <div className="trust-badge-row">
            <span>
              <Shield /> ضمان استرجاع 14 يوم
            </span>
            <span>
              <Lock /> تشفير بنكي 256-bit
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSection({ state }) {
  return (
    <div className="checkout-form-container">
      <h5 className="form-title">بيانات الشحن:</h5>

      {state === null && (
        <div className="form-state-empty">
          <EmptyNote>لم يتم اختيار نموذج البيانات بعد</EmptyNote>
        </div>
      )}

      {state === "bad" && (
        <div className="form-state-bad">
          <div className="form-row">
            <div className="form-group">
              <label>الاسم الرباعي *</label>
              <input type="text" placeholder="الاسم كما في البطاقة" disabled />
            </div>
            <div className="form-group">
              <label>الرقم القومي (14 رقم) *</label>
              <input type="text" placeholder="الرقم القومي" disabled />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>كود المنطقة البريدي *</label>
              <input type="text" placeholder="11511" disabled />
            </div>
            <div className="form-group">
              <label>رقم الفاكس</label>
              <input type="text" placeholder="اختياري" disabled />
            </div>
          </div>
          <div className="form-group">
            <label>ملاحظات التوصيل بالتفصيل *</label>
            <textarea rows="2" placeholder="اكتب بالتفصيل أوقات التواجد بالمنزل..." disabled />
          </div>
        </div>
      )}

      {state === "good" && (
        <div className="form-state-good">
          <div className="form-group">
            <label>البريد الإلكتروني للتأكيد الفوري</label>
            <input type="email" defaultValue="customer@example.com" disabled />
          </div>
          <div className="form-group">
            <label>بيانات بطاقة الدفع (Visa / Mastercard / Meeza)</label>
            <input type="text" defaultValue="•••• •••• •••• 4291" className="mono-input" disabled />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreviewPanel({ missions, allGood, statusText, feedback, loading, onCheckout }) {
  const btn = missions[1];

  return (
    <section className="live-preview-panel">
      <div className="preview-header">
        <div className="preview-badge">
          <span className={`status-dot${allGood ? " good" : ""}`}></span>
          <span>صفحة الدفع الحقيقية (المعاينة)</span>
        </div>
        <div className="preview-status-text">{statusText}</div>
      </div>

      <div className="browser-mockup">
        <div className="mockup-top-bar">
          <div className="window-controls">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="url-bar">
            <Lock className="url-lock-icon" size={12} strokeWidth={2.5} />
            <span>next-audio.store/checkout</span>
          </div>
        </div>

        <div className="mockup-content">
          <div className="checkout-product-summary">
            <div className="product-thumb">
              <Headphones size={24} strokeWidth={1.8} />
            </div>
            <div className="product-info">
              <h4>سماعة Pulse Pro اللاسلكية</h4>
              <span className="product-price">1,250 ج.م</span>
            </div>
            <span className="shipping-tag">شحن مجاني</span>
          </div>

          <hr className="mockup-hr" />

          <PaymentSection state={missions[3]} />
          <FormSection state={missions[2]} />

          <div className="checkout-cta-area">
            {btn === null ? (
              <div className="btn-state-empty">
                <EmptyNote>لم يتم تحديد تصميم زر الشراء بعد</EmptyNote>
              </div>
            ) : (
              <button
                key={btn}
                type="button"
                className={`live-btn ${btn === "bad" ? "btn-bad-style" : "btn-good-style"}`}
                onClick={onCheckout}
              >
                {loading && <span className="btn-loader"></span>}
                <span className="btn-text">
                  {loading ? "جاري إتمام الطلب..." : btn === "bad" ? "إرسال البيانات" : "إتمام الطلب بأمان"}
                </span>
              </button>
            )}

            {feedback?.type === "success" && (
              <div className="feedback-toast">
                <CheckCircle size={16} strokeWidth={2.5} />
                <span>{feedback.text}</span>
              </div>
            )}

            {feedback?.type === "error" && (
              <div className="feedback-error">
                {feedback.icon === "alert" ? <AlertCircle size={16} strokeWidth={2.2} /> : <XCircle size={16} strokeWidth={2.2} />}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
