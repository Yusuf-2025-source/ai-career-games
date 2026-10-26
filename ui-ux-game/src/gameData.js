/* ===========================================================================
   بيانات اللعبة + منطق الحسابات (دوال نقية بدون React علشان تتختبر بسهولة)
   ========================================================================= */

export const TIMER_SECONDS = 120;
export const DANGER_SECONDS = 15;
export const BASE_BOUNCE = 70;
export const TARGET_BOUNCE = 14;

// كل اختيار "good" بيقلل معدل الخروج بالقيمة دي
export const REDUCTIONS = { 1: 20, 2: 24, 3: 12 };

export const MISSION_IDS = [1, 2, 3];
export const EMPTY_MISSIONS = { 1: null, 2: null, 3: null };

export const TEXT = {
  waiting: "في انتظار قراراتك...",
  hintDefault: "حدد خياراتك في الصناديق الثلاثة ثم اضغط لاختبار التعديلات على المتجر!",
  hintOptimal: 'ممتاز! اضغط زر "تطبيق التعديلات" أو زر الشراء لتأكيد الإنجاز.',
  allSelected: "تم تحديد كافة العناصر، يمكنك تجربة الدفع الآن",
  incompleteAlert: "يرجى تحديد اختيار في كل صندوق من الصناديق الثلاثة أولاً قبل تطبيق التعديلات!",
  notOptimalAlert:
    "انتبه! التعديلات الحالية لم تحل المشكلة بالكامل. هناك عناصر ما زالت معقدة وتدفع الزوار للخروج. راجع قراراتك واعد المحاولة!",
  successToast: "تم إتمام الطلب بنجاح وسرعة فائقة!",
  deployErrorToast: "الواجهة الحالية غير مكتملة أو معقدة! لم يكتمل الطلب وخرج الزائر.",
  liveIncomplete: "لم تكتمل واجهة الدفع بعد! أكمل تحديد خياراتك في لوحة التحكم.",
  liveFailed: "فشلت التجربة: أحد العناصر المحددة يربك المشتري أو يفتقر للوضوح! غيّر خياراتك للوصول للواجهة المثالية.",
};

export const MISSIONS = [
  {
    id: 1,
    hint: "💡 تلميح: الزر العريض الأخضر بنص «إتمام الطلب بأمان» يلفت العين فورًا ويطمئن الزائر، فيرتفع احتمال الضغط عليه. جرّب التصميم (ب) وقارن.",
    title: "تصميم زر إتمام الشراء (CTA Button)",
    question: "كيف يجب أن يظهر الزر الرئيسي للدفع في نهاية الصفحة؟",
    options: {
      bad: {
        label: "التصميم (أ)",
        title: "زر مدمج 12px رمادي هادئ",
        desc: 'نص الزر: "إرسال البيانات" مع أبعاد صغيرة ليشغل أقل مساحة ممكنة.',
      },
      good: {
        label: "التصميم (ب)",
        title: "زر بارز بعرض الصفحة باللون الأخضر",
        desc: 'نص الزر: "إتمام الطلب بأمان" بمقاس واضح يجذب عين المستخدم مباشرة.',
      },
    },
  },
  {
    id: 2,
    hint: "💡 تلميح: كل حقل إضافي يزيد احتمال ترك الصفحة. النموذج المختصر بحقلين مع الملء التلقائي أسرع وأسهل، جرّب الأسلوب (ب) وشاهد الفرق.",
    title: "هيكل حقول البيانات (Form Architecture)",
    question: "ما هي كمية البيانات المطلوبة من العميل في هذه اللحظة؟",
    options: {
      bad: {
        label: "الأسلوب (أ)",
        title: "نموذج كامل ومفصل (5 خانات)",
        desc: "الاسم الرباعي، الرقم القومي 14 رقم، كود المنطقة، الفاكس، وملاحظات التوصيل.",
      },
      good: {
        label: "الأسلوب (ب)",
        title: "نموذج سريع ومختصر (حقلين أساسيين)",
        desc: "البريد الإلكتروني للإشعار وبيانات بطاقة الدفع مع ملء تلقائي آمن.",
      },
    },
  },
  {
    id: 3,
    hint: "💡 تلميح: الزائر يثق أكثر عندما يرى وسائل الدفع بوضوح مع شارة ضمان. الأسلوب (ب) يزيل التردد قبل الدفع، جرّبه.",
    title: "خيارات الدفع وشارات الثقة (Payment & Trust Badges)",
    question: "كيف نعرض وسائل الدفع ونطمئن المشتري قبل الدفع؟",
    options: {
      bad: {
        label: "الأسلوب (أ)",
        title: "بدون تحديد وسائل دفع أو شارات ضمان",
        desc: "لا توجد خيارات واضحة أو شارات حماية، مما يثير تردد العميل ومخاوفه.",
      },
      good: {
        label: "الأسلوب (ب)",
        title: "أزرار تفاعلية لطرق الدفع + شارة ضمان 14 يوم",
        desc: "اختيار سريع (بطاقة بنكية / محفظة إلكترونية / دفع عند الاستلام) مع شارة أمان بنكي.",
      },
    },
  },
];

/* ------------------------------ الحسابات ------------------------------ */

export function selectedCount(missions) {
  return MISSION_IDS.filter((id) => missions[id] !== null).length;
}

export function isComplete(missions) {
  return selectedCount(missions) === MISSION_IDS.length;
}

export function isAllGood(missions) {
  return MISSION_IDS.every((id) => missions[id] === "good");
}

export function calcBounce(missions) {
  return MISSION_IDS.reduce(
    (bounce, id) => (missions[id] === "good" ? bounce - REDUCTIONS[id] : bounce),
    BASE_BOUNCE
  );
}

export function conversionLabel(missions) {
  if (selectedCount(missions) === 0) return TEXT.waiting;
  if (isAllGood(missions)) return "مرتفع جداً (24%)";
  return calcBounce(missions) < 40 ? "متوسط (9%)" : "منخفض (4%)";
}

export function previewStatus(missions) {
  const n = selectedCount(missions);
  return n === MISSION_IDS.length ? TEXT.allSelected : `تم تحديد ${n} من 3 عناصر`;
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function isTimerDanger(totalSeconds) {
  return totalSeconds <= DANGER_SECONDS;
}
