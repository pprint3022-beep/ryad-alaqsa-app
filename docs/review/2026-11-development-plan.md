# خارطة تطوير معهد رياض الأقصى — نوفمبر 2026 (المراحل ١–٥)

> التاريخ: 2026-11-20 · النطاق: النموذج الأولي (`backend/`)، الواجهة (`apps/web/`)، الـ API الإنتاجي (`apps/api/`)، خدمة ML (`services/ml/`)، والاختبارات.
> دليل الحالة: ✅ منجز ومُختبَر · 🟡 جزئي/موجود لكنه غير مكتمل · ⛔ معوّق محليًا · 🔲 مخطط لم يبدأ.
> هذه الوثيقة خطة عمل فقط؛ لا تُغيّر الكود ولا تُشغّل بناءً أو اختبارات.

---

## ما الذي أُنجز فعليًا في هذه الدورة (What was actually done this sprint)

- ✅ **خريطة المغرب الرسمية مُصحَّحة:** `apps/web/public/illustrations/diagrams/diagram-morocco-map.svg` يعتمد حدودًا ترابية متصلة واحدة (المغرب + الأقاليم الجنوبية)، ومواضع حقيقية للرباط والدار البيضاء ومراكش، وعلمًا بنجمة خماسية خضراء أصيلة (pentagram) بدل أي رسم اعتباطي. النسخة المبنية في `apps/web/dist/illustrations/diagrams/diagram-morocco-map.svg` تطابقها.
- ✅ **144 فحصًا موسّعًا:** `node tests/prototype-extended.js` يشغّل خادمه الخاص على المنفذ `3198` (`EXTENDED_TEST_PORT` قابل للتغيير) ويُبلغ PASS / FAIL / SKIP؛ يُجري 144 فحصًا موثّقًا في `docs/review/2026-11-complete-review.md`. فحوص الدخان: `npm run test:smoke` (41 فحصًا).
- ✅ محتوى المنهاج v6 (تغطية كاملة): 96 وحدة / 380 درسًا (380/380 خانة) / 2203 قسمًا / 1312 سؤالًا / 90 ثلاثي اللغة / 299 مصوّرًا / 124 ناتج تعلّم، بمُحرّس البذرة `demoLessonContentSeed: "v6"` في `backend/data.json`؛ المصادر في `scripts/curriculum-content/v6-content-A.js`…`v6-content-H.js` مع `v6-coverage.js`، والبذرة في `scripts/seed-lesson-content-demo.js`، والفاحص `node scripts/validate-v6-content.js` → 0 مشكلة.
- ✅ تجربة v7: مجموعة `apps/web/src/components/ux/` مُدمجة في لوحات المدير والمعلم والأسرة والتقارير، مع ملخّصات «القراءة السريعة»، ورسوم بيانية من أرقام حقيقية، وإنجازات غير تنافسية، ومساعد صوتي بأربع لغات وأزرار استماع كبيرة تعمل بلوحة المفاتيح.
- ✅ أدوات المعلم: استوديو التأليف `/teacher/lesson-studio` وبرنامج التدريب `/teacher/training`، مع مفاتيح ترجمة مُدمجة رسميًا عبر `extract-missing-i18n.js` + `merge-i18n-keys.js` (2059 لكل لغة، 0 مفقود، `PARITY OK`).
- ✅ الصوت متعدد اللغات: 30 مقطعًا أمازيغيًا أصليًا في `apps/web/public/audio/amz/` مع قواعد أمان الصوت في `apps/web/src/lib/speech.ts` (لا نطق للعربية/اليفيناغ بصوت أجنبي افتراضي).
- ✅ تكافؤ الترجمات: `scripts/extract-missing-i18n.js` و`scripts/merge-i18n-keys.js`، مع ملفَي `docs/review/i18n-missing-keys.json` و`docs/review/i18n-translations.json`.
- ✅ مسار CI جديد (هذه المرحلة): `.github/workflows/ci.yml` و`scripts/check-runtime-env.js` و`docs/review/production-readiness.md`.

---

## المرحلة ١ — البنية التحتية للإنتاج (قاعدة البيانات والأدوات المحلية)

**الحالة الإجمالية: 🟡 الكود جاهز جزئيًا، والتشغيل المحلي ⛔ معوّق.**

| البند | المسار / الأمر | الحالة | الملاحظة والخطوة التالية |
|---|---|---|---|
| قاعدة بيانات PostgreSQL عبر Prisma | `apps/api/prisma/schema.prisma`، `apps/api/prisma/seed.ts`، `npm run db:migrate`، `npm run db:seed` | 🟡 / ⛔ محليًا | المخطط مكتمل (User, AuditLog, Draft, CompetencyReference…)، لكن **لا يوجد psql محلي** ولا خادم PostgreSQL مُهيّأ. الخطوة: تثبيت PostgreSQL + العميل، ضبط `DATABASE_URL`، ثم تشغيل الأمرين أعلاه. |
| Git | `.github/workflows/ci.yml`، `scripts/check-runtime-env.js` | 🟡 | **Git 2.56 متاح** محليًا (`%LOCALAPPDATA%\github-copilot-git-*\cmd\git.exe`) ويُكتشف تلقائيًا في فحص البيئة، لكنه غير مضاف إلى PATH ولا يوجد مستودع في `ryad-alaqsa-app`. الخطوة: تهيئة المستودع وإضافة remote ثم الدفع (أو إضافة `cmd` إلى PATH لاستخدام `git` مباشرة). |
| Python | `services/ml/app/main.py`، `services/ml/tests/test_api.py`، `services/ml/pytest.ini` | ⛔ | **Python غير متاح (stub من Microsoft Store)**. الخطوة: تثبيت Python 3.10+ من python.org وتعطيل "App execution aliases" لـ python/python3، ثم `pytest -c services/ml/pytest.ini services/ml/tests`. |
| PDF حقيقي | `apps/web/src/pages/admin/ReportCards.tsx`، `apps/web/src/pages/family/ReportCard.tsx`، `apps/web/src/pages/admin/GradeResults.tsx`، `apps/web/src/pages/teacher/LessonEditor.tsx` | 🟡 | الطباعة الحالية عبر `window.print()` فقط. الخطوة: مولّد PDF خادمي/عميلي حقيقي مع خطوط عربية، ترقيم صفحات، وتوقيع مستندات مُعتمدة. |
| مراجعة أمازيغية أصلية لـ `amz.ts` | `apps/web/src/i18n/locales/amz.ts`، `apps/web/src/lib/speech.ts`، `apps/web/public/audio/amz/` | 🟡 | المقاطع الصوتية الأصلية موجودة ومحفوظة بالحارس في speech، لكن المراجعة اللغوية البشرية لترجمات Tifinagh في `amz.ts` لم تُنجز بعد. الخطوة: مراجعة من مختص أمازيغي + اختبار parity. |

**معايير القبول:** `node scripts/check-runtime-env.js` يُظهر node/npm/git READY (git جاهز بالفعل عبر Copilot CLI)، ويختفي BLOCKED عن python بعد التثبيت، وتُطبَّق الهجرة والبذرة بنجاح (psql اختياري).

---

## المرحلة ٢ — اكتمال المنهاج والمحتوى التربوي

**الحالة الإجمالية: ✅ 96 وحدة و380 درسًا تغطي 380/380 خانة في النموذج الأولي (تم الهدف)؛ 🟡 النقل إلى Prisma/PostgreSQL وتدقيق المحتوى التربوي المتخصص ما زالا معلّقين.**

| البند | المسار | الحالة | الخطوة التالية |
|---|---|---|---|
| تغطية المقرر كاملًا (96 وحدة / 380 درسًا) | `scripts/curriculum-content/v6-coverage.js`، `v6-content-A.js`…`v6-content-H.js`، `scripts/seed-lesson-content-demo.js`، `backend/data.json`، `apps/api/prisma/schema.prisma` (نموذج `Curriculum`) | ✅ في النموذج / 🟡 في الإنتاج | اكتملت 380/380 خانة ووُرّثت نواتج v4/v5؛ المتبقي نقل الدروس والأسئلة إلى `Curriculum` و`CompetencyReference` و`Assessment` في Prisma بعد توفّر PostgreSQL. |
| نواتج تعلّم قابلة للقياس | `apps/api/prisma/schema.prisma` (`CompetencyReference`, `Assessment`)، `apps/web/src/pages/teacher/Curriculum.tsx` | 🟡 | ربط كل درس بناتج تعلّم ومهارة مرجعية واحدة على الأقل، مع معايير إتقان `targetMastery`. |
| توسيع بنك الأسئلة | `apps/web/src/pages/teacher/AssessmentBank.tsx`، `backend/data.json`، نموذج `Assessment` | 🟡 | أسئلة بمستويات صعوبة، أنواع متعددة، وتصحيح آلي مع تغذية راجعة وصفية. |
| مراجعة تربوية متخصصة | `docs/review/2026-11-complete-review.md`، `scripts/curriculum-content/` | 🔲 | مراجعة من مفتّشين ومعلمين مختصين (تسلسل، تدرّج، حجم نص مناسب للعمر). |
| رسوم وأمثلة أكثر | `apps/web/public/illustrations/diagrams/`، `apps/web/src/components/` | 🟡 | 299 درسًا مصوّرًا من 380 اليوم، مع مثالين محلولين لكل درس؛ المتبقي رسوم للدروس الثمانية والثمانين الأخرى، وتدقيق نصوص alt مع مراجع تربوي. |

---

## المرحلة ٣ — التجربة والوصولية والأداء

**الحالة الإجمالية: 🟡 أساس v7 مُنجز، والتدقيق الآلي ل WCAG ما زال مطلوبًا.**

| البند | المسار | الحالة | الخطوة التالية |
|---|---|---|---|
| تجربة v7 ولوحات أوضح | `apps/web/src/components/ux/`، `pages/Dashboard.tsx`، `components/ExecutiveDashboard.tsx`، `pages/admin/ReportCards.tsx`، `pages/admin/GradeResults.tsx`، `pages/{admin,teacher}/Engagement.tsx`، `pages/family/ReportCard.tsx` | ✅ في النموذج / 🟡 تدقيق آلي | ملخّصات «القراءة السريعة»، مؤشرات ورسوم من بيانات حقيقية، إنجازات غير تنافسية، واحترام `prefers-reduced-motion`؛ يبقى فحص تباين آلي وقياس زمن التحميل. |
| PWA / عمل دون اتصال | `apps/web/public/` (إضافة `manifest.webmanifest` وservice worker)، `apps/web/vite.config.ts` | 🔲 | تخزين الدروس والمقاطع الصوتية في cache، وتحديد ما يُخزَّن محليًا من بيانات التلميذ. |
| WCAG | `apps/web/src/` (كل الصفحات، خصوصًا `apps/web/src/pages/family/LearningPath.tsx`) | 🟡 | تدقيق AA: تباين، تنقّل بلوحة المفاتيح، `aria-*`， إعلان تغيّر اللغة/الاتجاه، واختبار قارئ شاشة. |
| تجربة الهاتف | `apps/web/src/`، `apps/web/src/components/` | 🟡 | اختبار لمسي على أحجام صغيرة، أهداف لمس ≥ 44px، وتقليل الرسوم المتحركة حسب تفضيل النظام. |
| تقليل حجم الحزمة | `apps/web/vite.config.ts`، `apps/web/dist/assets/` | 🟡 | تقسيم إضافي حسب المسار، ضغط الصور والخطوط، وقياس حجم الحزمة قبل/بعد كل إصدار. |

---

## المرحلة ٤ — التشغيل والحكامة والأمان

**الحالة الإجمالية: 🟡 أساس التدقيق موجود، والأتمتة حديثة.**

| البند | المسار | الحالة | الخطوة التالية |
|---|---|---|---|
| CI/CD | `.github/workflows/ci.yml` (جديد)، `scripts/check-runtime-env.js` | 🟡 | ربط النشر بعد نجاح typecheck/build/ smoke/ extended + parity؛ فحص التبعيات وتوقيع الإصدارات. |
| الأمان | `apps/api/src/`، `apps/api/prisma/schema.prisma` (`Session`, `AuditLog`) | 🟡 | مراجعة RBAC والنطاقات، حماية من CSRF/SSRF، تحديد معدل الطلبات، وتدوير الأسرار دون تخزينها في المستودع. |
| النسخ الاحتياطي | `apps/api/prisma/`، بيئة PostgreSQL | 🔲 | نسخ احتياطي مجدول مشفّر + خطة استعادة مُختبرة (لا يكتفي بوجود `db:seed`). |
| سياسات التدقيق | `apps/api/prisma/schema.prisma` (`AuditLog`)، `docs/review/production-readiness.md` | 🟡 | مدة احتفاظ واضحة، توقيع زمني، وتقرير مراجعة قابل للتصدير. |
| فصل حضور القسم عن زمن المنصة | `apps/web/src/pages/family/WeeklySummary.tsx`، `apps/api/prisma/schema.prisma` (`Attendance`, `StudentEngagement`) | ✅ / 🟡 | الفصل مُطبَّق في الواجهة والـ API؛ يبقى توحيد المصطلحات في التقارير المطبوعة وتدقيق الحساب. |

---

## المرحلة ٥ — التوسّع المؤسسي

**الحالة الإجمالية: 🔲 مخطط.**

| البند | المسار | الحالة | الخطوة التالية |
|---|---|---|---|
| أدوات تأليف محسّنة | `apps/web/src/pages/teacher/LessonEditor.tsx`، `apps/web/src/pages/admin/` | 🟡 | معاينة مباشرة، إدخال صوت/شرائح، مسودّات مُدقَّقة، ونشر بمراجعة. |
| برنامج تدريب | `apps/web/src/pages/` (جديدة)، `docs/` | 🔲 | مسار تدريب للمعلمين مع تتبّع إتمام وشهادات داخلية. |
| تعدد المدارس | `apps/api/prisma/schema.prisma` (إضافة نموذج `School`/Tenant)، `apps/api/src/` | 🔲 | عزل بيانات كل مدرسة (tenant scoping) وتوسيع `scope` في `User` وصلاحيات الإدارة. |
| تطبيق موبايل | `mobile/` (جديد)، `apps/api/src/` | 🔲 | تطبيق يعيد استخدام الـ API الإنتاجي، مع عمل دون اتصال للدروس والمقاطع الصوتية. |

---

## ترتيب التنفيذ المقترح

1. المرحلة ١ أولًا: تثبيت Python/PostgreSQL (git جاهز محليًا)، ثم التحقق بـ `node scripts/check-runtime-env.js` و`npm run db:migrate` و`npm run db:seed`.
2. المرحلة ٤ بالتوازي: تهيئة مستودع Git وremote ثم تفعيل `.github/workflows/ci.yml` بالدفع، يليه الأمان والنسخ الاحتياطي.
3. المرحلة ٢: المحتوى (52+ درسًا) بموافقة تربوية قبل النشر.
4. المرحلة ٣ ثم المرحلة ٥ بعد استقرار البيانات والهوية.
