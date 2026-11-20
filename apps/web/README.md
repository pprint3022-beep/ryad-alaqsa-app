# Web app — Ryad Al Aqsa

واجهة الإنتاج المبنية بـ **React 18 + Vite + TypeScript + Tailwind CSS**.

## التشغيل
```bash
cd apps/web
npm install        # من جذر المونوريبو: npm install
npm run dev        # http://localhost:5173
```
- `VITE_API_URL` افتراضيًا `http://localhost:3001`.
- أثناء التطوير، Vite يمرّر `/api` إلى `http://localhost:3001` (انظر `vite.config.ts`).

## البناء
```bash
npm run build      # tsc + vite build -> dist/
npm run preview
npm run typecheck
```

## البنية
```text
src/
├── components/    Layout, Logo, LanguageSwitcher, ProtectedRoute
├── i18n/          ar · fr · en · amz + تبديل RTL/LTR
├── lib/           عميل axios + تدوير الرموز
├── pages/         Login, Dashboard, NotFound + admin/ teacher/ family/ student/ (49 صفحة محمّلة ديناميكيًا)
├── store/         zustand + persist للجلسة
├── types.ts
├── App.tsx
└── main.tsx
```

## الهوية
- الشعار الرسمي: `public/logo.svg` (الشمس، الطفلان، حروف I·R·A).
- الألوان: أخضر `#5AA83A`، ذهبي `#F5B800`، حبر `#1A1A1A`.
- لا علاقة للمشروع بأي علامة تعلم أجنبية؛ الهوية للمؤسسة وحدها.

## المسارات حسب الدور
- **الإدارة** (`admin_portal`): `/admin/reports` · `/admin/report-cards` · `/admin/timetable` · `/admin/cards-center` · `/admin/experiments` · `/admin/intervention-plans` · `/admin/lesson-review` · `/admin/grade-results` · `/admin/engagement` · `/admin/curriculum` · `/admin/approvals` · `/admin/communications` · `/admin/people` · `/admin/community` · `/admin/knowledge` · `/admin/governance`.
  - **مركز مراجعة البطاقات** (`/admin/cards-center`): تصفية ومراجعة بشرية للبطاقات مع سجل تدقيق.
  - **مختبر التحليلات والتجارب** (`/admin/experiments`): مقارنة المتغيرات، تخصيص مؤقت في الذاكرة، إنذار مبكر وتنبؤ بالفجوات — كلها موسومة «استرشادي».
- **المعلم**: `/teacher/classes` · `/teacher/attendance` · `/teacher/timetable` · `/teacher/engagement` · `/teacher/curriculum` · `/teacher/question-bank` · `/teacher/grades` · `/teacher/feedback-cards` · `/teacher/cases` · `/teacher/wellbeing` · `/teacher/intervention-plans` · `/teacher/threads` · `/teacher/lesson-editor` · `/teacher/grades-entry` · `/teacher/communications` · `/teacher/alerts`.
  - **بنك الأسئلة والتقويمات** (`/teacher/question-bank`): إنشاء/أرشفة الأسئلة، إنشاء تقويمات قصيرة ونشرها، وتحليل مفرداتها — النتائج استرشادية.
- **ولي الأمر**: `/parent/children` · `/parent/report-card` · `/parent/timetable` · `/parent/privacy-center` · `/parent/weekly-summary` · `/parent/insights` · `/parent/talents` · `/parent/activities` · `/parent/messages` · `/parent/portfolio`.
  - **الرسائل ثنائية الاتجاه** (`/parent/messages`): إنشاء محادثة مرتبطة بحالة/بطاقة التلميذ والرد عليها وإغلاقها، مع حكامة الموافقة والخصوصية؛ صندوق الإشعارات للقراءة فقط محفوظ.
- **التلميذ**: `/student/path` · `/student/timetable` · `/student/assessments` · `/student/report-card` · `/student/insights` · `/student/portfolio` · `/student/profile`.
  - **التقييمات التكوينية** (`/student/assessments`): اختبارات قصيرة بتغذية راجعة فورية ومحاولات متعددة، موسومة «تدريبي · لا يُحتسب في بطاقة التقدير».
- التوجيه محمي بـ `ProtectedRoute` (رمز + دور + بوابة)، والقائمة الجانبية تتكيّف مع الدور، والصفحات محمّلة ديناميكيًا (code splitting).

## الحالة
- ✅ جميع صفحات الأدوار تعرض بيانات حيّة من API مع حالات تحميل/خطأ/فراغ وإعادة محاولة.
- ✅ الواجهة الرئيسية تعرض مؤشرات حيّة حسب الدور، قسم «ما يهم اليوم»، وروابط سريعة إلى الشاشات الفعلية.
- ✅ مركز مراجعة البطاقات ومختبر التحليلات يعرضان بيانات حيّة مع إجراءات مُختبَرة (اعتماد بتدقيق، تخصيص تجربة) ووسم «استرشادي» صريح.
- ✅ الجدول الأسبوعي (`TimetableBoard`) يعرض شبكة الحصص لكل دور، مع تفاصيل الحضور والواجبات وإدارة حصص الإدارة؛ حضور القسم منفصل صراحةً عن زمن المنصة.
- ✅ مركز الموافقات والخصوصية للأسرة يسجّل قرارات الولي بتدقيق كامل، ويعرض سياسة الاحتفاظ ومصادر البيانات. الملخّص الأسبوعي يفصل حضور القسم عن زمن المنصة ويوسم التدريب استرشاديًا.
- ✅ خطط التدخل القابلة للقياس (`/teacher/intervention-plans`) يصيغها المعلم بأهداف ومؤشرات قابلة للقياس، مع مراجعات أسبوعية موثّقة وسجل تغييرات؛ إشارات الإنذار المبكر استرشادية فقط. لوحة الإشراف (`/admin/intervention-plans`) للقراءة فقط.
- ✅ قناة الرسائل ثنائية الاتجاه تربط ولي الأمر والمعلم بحالة/بطاقة التلميذ، مع حكامة موافقة وخصوصية وتدقيق كامل؛ ردود المعلم محكومة بموافقة الولي وتفضيل المراسلات.
- ✅ تحقّق في المتصفح لكل الأدوار ولتبديل اللغات RTL/LTR دون أخطاء console.
- ✅ كتالوج i18n للأربع لغات يغطي صفحات الأدوار (1696 مفتاحًا/لغة، 0 مفقود) مع RTL/LTR؛ قيم amz بالفرنسية بانتظار مراجعة أصلية.
- ✅ محرر الدروس (`/teacher/lesson-editor`) يصوغ أهدافًا وأنشطة وتمييزًا وموارد ضمن نطاق المعلم، ويرسل للمراجعة؛ لوحة المراجعة (`/admin/lesson-review`) تنشر أو تعيد بأمر بشري موثّق وتصدّر الحزمة CSV/JSON.
- ✅ نظام التنقيط المغربي (`/teacher/grades-entry`) يحسب المعدلات المرجّحة من نقط الفروض والمعاملات والمشاركة، ويعرض لوحة النتائج (`/admin/grade-results`) نتيجة الدورة الأولى والثانية بنسخة قابلة للطباعة/PDF مطابقة للنموذج الرسمي، مع قرار النجاح/الرسوب والترتيب.

## حسابات تجريبية
كلمة المرور `1234`: `director@ryad.ma` · `teacher@ryad.ma` · `parent@ryad.ma` · `student@ryad.ma`.
