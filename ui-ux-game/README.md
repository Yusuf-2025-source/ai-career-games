# ui-ux-game — تحدي مصمم UI/UX (React + Vite)

لعبة تفاعلية ضمن منصة CareerPath: معدل الخروج من صفحة الدفع وصل 70%، ولازم اللاعب يختار 3 قرارات UI/UX صح خلال دقيقتين.
لو الوقت خلص قبل ما يطبّق الاختيارات الصح، تظهر شاشة **انتهى الوقت المتاح!**.

## التشغيل

```bash
npm install
npm run dev      # تشغيل محلي
npm run build    # بناء للإنتاج (فولدر dist)
npm test         # اختبارات منطق اللعبة
```

## هيكل المشروع

```
ui-ux-game/
├─ public/favicon.svg
├─ src/
│  ├─ main.jsx            نقطة البداية
│  ├─ App.jsx             الحالة والتايمر وكل الأحداث
│  ├─ gameData.js         المهام + الحسابات (دوال نقية)
│  ├─ hooks.js            الصوت، العدّاد الانسيابي، setTimeout آمن
│  ├─ style.css           التصميم الأصلي (فاتح/داكن)
│  └─ components/
│     ├─ Header.jsx       التايمر ومؤشرات الأداء وأزرار التحكم
│     ├─ ControlPanel.jsx بطاقات القرارات الثلاثة
│     ├─ PreviewPanel.jsx معاينة صفحة الدفع
│     ├─ Modals.jsx       البداية / الفوز / انتهاء الوقت
│     ├─ Confetti.jsx     احتفال الفوز
│     └─ Icons.jsx        أيقونات SVG
├─ test/game.test.js
├─ index.html
└─ package.json
```

## تعديل المحتوى

- الأسئلة والاختيارات: `src/gameData.js` (مصفوفة `MISSIONS`)
- مدة التحدي (120 ثانية): `TIMER_SECONDS` في نفس الملف
- نسبة تأثير كل قرار على معدل الخروج: `REDUCTIONS`
