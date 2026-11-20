# رياض الأقصى — Institut Ryad Al Aqsa

منصة تربوية متكاملة لمؤسسة **رياض الأقصى / Institut Ryad Al Aqsa** (Groupe scolaire AL-AKSA) — سيدي علال البحراوي، المغرب.
تجربة تعلم تفاعلية بهوية المؤسسة الرسمية (الشمس، الطفلان، وحروف I·R·A) مع فصل صارم بين بوابة الإدارة والحسابات الخاصة، ودعم أربع لغات: **العربية · Français · English · ⵜⴰⵎⴰⵣⵉⵖⵜ**.

> يحتوي المستودع على **نموذج أولي عامل** (vanilla JS + Node بدون تبعيات خارجية) و**أساس الإنتاج** (Monorepo: React + Fastify + Prisma/PostgreSQL).

---

## 1) التشغيل السريع — النموذج الأولي (جاهز الآن)

```bash
cd ryad-alaqsa-app/backend
node server.js
# افتح http://localhost:3001
```

- يقدّم الخادم الواجهة الكاملة (`index.html`, `app.js`, `styles.css`, `i18n.js`, `logo.svg`, PWA) وواجهة API واحدة.
- كلمة المرور التجريبية لجميع الحسابات: `1234`.
- الحسابات: `director@ryad.ma` · `deputy@ryad.ma` · `supervisor@ryad.ma` · `clerk@ryad.ma` · `admin@ryad.ma` (بوابة الإدارة) — `teacher@ryad.ma` · `parent@ryad.ma` · `student@ryad.ma` (البوابة الخاصة).
- فحص سريع شامل: `node tests/prototype-smoke.js` (يشغّل الخادم على منفذ معزول ويتحقق من 41 نقطة: مصادقة، بوابات، RBAC، تقارير، تدوير الرموز).
- فحص موسّع: `node tests/prototype-extended.js` (136 فحصًا؛ آخر نتيجة **136 نجاحًا، 0 فشل، 0 تخطيات**).
- مراجعة شاملة وخارطة طريق: `docs/review/2026-11-complete-review.md`.

## 2) أساس الإنتاج (Monorepo)

```text
ryad-alaqsa-app/
├── apps/
│   ├── web/                 # React 18 + Vite + TypeScript + Tailwind (هوية رياض الأقصى)
│   └── api/                 # Fastify 4 + TypeScript + Prisma + Redis (optional)
├── packages/shared/         # أنواع وثوابت مشتركة بين الواجهة والخادم
├── services/ml/             # خدمة Python/FastAPI للذكاء الاصطناعي
├── backend/                 # النموذج الأولي العامل (مرجع وظيفي وبيانات تجريبية)
├── docs/                    # البنية، الحوكمة، الصلاحيات، خارطة الإنتاج
├── tests/                   # اختبارات الدخان (prototype + production)
└── package-lock.json            # قفل npm/workspaces
```

### المتطلبات
- Node.js ≥ 20 (تم التطوير على Node 26)
- npm 10+ مع workspaces (الطريقة المعتمدة محليًا وفي CI؛ ملف القفل `package-lock.json`)
- PostgreSQL 16 (اختياري للتطوير: يمكن تشغيل الواجهة على النموذج الأولي)
- Python 3.11+ (اختياري لخدمة ML)

### أوامر جذرية
```bash
npm ci
npm run dev         # تطبيق الويب على :5173 (شغّل API النموذج على :3001 في نافذة أخرى)
npm run build
npm test
npm run db:migrate  # prisma migrate dev
npm run db:seed     # تحميل بيانات data.json التجريبية
npm run db:studio
```

### تطبيق الويب
```bash
cd apps/web
npm run dev         # http://localhost:5173 (proxy /api -> :3001)
npm run build       # tsc + vite build
```
متغيرات البيئة: `VITE_API_URL` (افتراضي `http://localhost:3001`).

### واجهة API
```bash
cd apps/api
cp .env.example .env
npm run prisma:generate
npm run dev         # http://localhost:3001
```
- مصادقة: Argon2id، رموز وصول قصيرة + Refresh rotation، جلسات في PostgreSQL.
- فصل البوابات: `admin_portal` (مدير/نائب/مشرف/كاتب/إدارة) و`private` (معلم/ولي/تلميذ).
- RBAC + Scope + تدقيق (`auditLogs`) على كل عملية حساسة.
- صيغة الأخطاء الموحدة: `{ ok: false, error, message, details? }`.

---

## 3) الأدوار والمساحات

| الفضاء | الأدوار | أبرز الوظائف |
|---|---|---|
| بوابة الإدارة | مدير، نائب، مشرف، كاتب، إدارة | لوحة قيادة، تقارير، اعتمادات، تسجيل، جداول، استراتيجية، أداء، تدقيق، اتصال أسري |
| البوابة الخاصة | معلم/ة | حصص، فصول، حضور، واجبات، تقييمات، بطاقات تغذية راجعة، حالات، رسائل |
| البوابة الخاصة | ولي الأمر | ملخص الأبناء، ملف الابن، رؤى، مواهب، أنشطة، تقويم، رسائل، موافقات |
| البوابة الخاصة | التلميذ | مساري، التعلم، التقدم، الواجبات، الإنجازات، الأنشطة |

**قاعدة ذهبية:** لا يرى أي طرف بيانات خارج نطاقه، وكل قرار تربوي حساس يمر عبر مراجعة بشرية موثّقة.

---

## 4) ما تم تنفيذه في النموذج الأولي

- **التعلم والتقييم:** 96 وحدة منهجية (تمهيدي → السادس × 14 مادة)، 91 مرجع كفايات، تقييمات تشخيصية/تكوينية، بنك أسئلة وتقييمات تفاعلية مع تحليل مفردات ونتائج استرشادية، مسارات تعلم، بطاقات تغذية راجعة بدورة حياة كاملة (مقترحة → معتمدة → قيد التنفيذ → منجزة).
- **الحالات والمتابعة:** 20 حالة مع خط زمني عبر الفصول والسنة، إسناد، مواعيد مراجعة، وتدقيق.
- **المواهب والدعم:** اكتشاف مواهب، برامج إثراء، تدخلات دعم، تنبيهات استحقاق، وقياس أثر (`impactLog`).
- **بوابة الأولياء:** لوحة، إشعارات، أنشطة، حالة، مواهب، تقييمات، محتوى، تتبع تفاعل.
- **المعرض الرقمي:** نشر أعمال التلاميذ، مراجعة واعتماد، تصنيف حسب المستوى/المادة، ملف إنجاز.
- **المجتمع:** نوادٍ ومسابقات، تسجيل في الأنشطة، تقويم، إرشاد الأقران، شبكة قدماء، تطوع، مؤشرات رفاه.
- **التواصل:** مسودات → اعتماد → إرسال (WhatsApp/SMS/Email/In-App) ضمن حوكمة وموافقات.
- **الذكاء الاصطناعي المساعد:** تنبؤ بالفجوات، كشف شذوذ، توصيات، إنذار مبكر، اختبارات A/B — مع أدلة بشرية وموافقة.
- **التحليلات:** تقارير أثر زمنية، تحليلات مجهولة الهوية بحد أدنى 3 أفراد (k-anonymity).
- **الحماية:** تجزئة scrypt، رموز وصول + Refresh rotation، حدود معدل، رؤوس أمان، فصل بوابات، سجل تدقيق، سياسة احتفاظ.
- **الواجهة:** 4 لغات + RTL/LTR، وضع داكن، انتقالات سلسة، هياكل تحميل، إشعارات، PWA + عمل دون اتصال.

---

## 5) حالة أساس الإنتاج

| المجال | الحالة |
|---|---|
| Monorepo + workspaces + TypeScript base | ✅ |
| Prisma schema (PostgreSQL) + back-relations | ✅ `prisma validate/generate` ناجح |
| Fastify API (config, auth, RBAC, audit, health) | ✅ tsc + 19/20 jest (DB skipped) |
| React web (routing, auth, i18n، 49 صفحة محمّلة ديناميكيًا) | ✅ بناء ناجح + تحقق في المتصفح |
| الواجهة الرئيسية + مركز مراجعة البطاقات + مختبر التحليلات | ✅ مؤشرات حيّة، مراجعة بشرية بتدقيق، تحليلات استشارية |
| Seed من `backend/data.json` | ✅ يُترجم TypeScript؛ التنفيذ يحتاج PostgreSQL |
| خدمة ML (FastAPI) | ✅ هيكل + 23 اختبارًا جاهزة؛ Python غير متوفر محليًا |
| CI/CD + Docker | ✅ CI يعمل بـ npm/workspaces بلا `continue-on-error` |
| أدلة المستخدمين + الفهرس | ✅ 5 أدلة في `docs/guides/**` |

التفاصيل: `docs/status.md` و`apps/api/VERIFICATION.md` و`tests/README.md`.

---

## 6) الهوية والبيانات المؤسسية

- التميمة/الأيقونة: `logo.svg` (الشعار الرسمي: الشمس والأطفال المتعاونون، وحروف I·R·A).
- الألوان: أخضر `#4E9E2F` / `#3A7A23`، ذهبي `#F5B800`، برتقالي `#F39C12`، رمادي `#1C1C1C`.
- العنوان: Hay Ryad II, N° 17, Sidi Allal El Bahraoui, Maroc.
- الهاتف: +212 5 37 52 10 23 / +212 5 37 52 10 24 — واتساب: +212 7 08 23 07 15.
- البريد: ryad@groupescolaireal-aksa.com.

---

## 7) الوثائق
- `docs/fondations-architecture-bnia.md` — الأسس البنيوية الموحدة (جذور، طبقات، كيانات، RBAC، وكلاء، حوكمة).
- `docs/architecture-production.md` — **خريطة الانتقال من النموذج إلى الإنتاج**.
- `docs/schema-postgres.sql` — مخطط PostgreSQL المرجعي.
- `docs/permission-matrix.md` — مصفوفة الصلاحيات.
- `docs/architecture-db-api.md` — قاعدة البيانات وواجهات API.
- `docs/developpement-priorites-implantees.md` — الأولويات المضمّنة وحالة التنفيذ.
- `docs/production-gouvernance-roadmap.md` — خارطة الإنتاج والحوكمة والأمان وقياس الأثر.
- `docs/vision-integree-agents-multiniveaux.md` — رؤية الوكلاء المتخصصين.
- `docs/architecture-agents-rbac-liens.md` — المعمارية والربط والأدلة والتدقيق.
- `docs/guides/README.md` — فهرس أدلة الاستخدام (الإدارة، المعلم، ولي الأمر، التلميذ، الإطلاق التدريجي).
- `tests/README.md` — مجموعتا اختبار النموذج (الدخان والموسّع).
- `services/ml/TESTING.md` — اختبارات خدمة ML (23 حالة).
