# خريطة الانتقال إلى الإنتاج — Ryad Al Aqsa

> هذا المستند هو المرجع العملي لتحويل **النموذج الأولي العامل** (vanilla JS + JSON) إلى **منصة إنتاجية** (React + Fastify + PostgreSQL + ML) دون فقدان أي وظيفة أو بيانات.

## 1) المبادئ الحاكمة

1. **لا إعادة كتابة من الصفر:** النموذج الأولي هو المواصفة الحيّة (60+ نقطة API، 37 شاشة، 43 مجموعة بيانات).
2. **الحفاظ على الجذور:** قرار بشري، خصوصية وتقليل بيانات، عدالة وعدم وصم، تدخل مبكر وتنمية مواهب.
3. **التدرّج:** كل مرحلة قابلة للتشغيل والاختبار بمفردها؛ لا "بيغ بانغ".
4. **الأمان أولًا:** فصل البوابات، RBAC + Scope، تدقيق، احتفاظ، أسرار خارج الكود.
5. **قابلية القياس:** كل ميزة مرتبطة بمؤشر أثر أو KPI.

## 2) المعمارية المستهدفة

```text
┌──────────────────────────┐      ┌──────────────────────────┐
│  apps/web (React/Vite)   │ ───► │  apps/api (Fastify/TS)   │
│  ar/fr/en/amz · RTL/LTR  │      │  Auth · RBAC · Audit     │
└──────────────────────────┘      └───────┬──────────┬───────┘
                                          │          │
                              ┌───────────▼──┐   ┌───▼─────────┐
                              │ PostgreSQL 16│   │ Redis (opt) │
                              │  Prisma ORM  │   │ cache/queue │
                              └──────────────┘   └─────────────┘
                                          │
                              ┌───────────▼──────────────┐
                              │ services/ml (FastAPI)    │
                              │ gap · warning · recomm.  │
                              └──────────────────────────┘
```

- **الواجهة:** React 18 + Vite + TypeScript + Tailwind، هوية رياض الأقصى (أخضر `#4E9E2F`، ذهبي `#F5B800`، بطاقات دائرية، أزرار بارزة، الشعار الرسمي).
- **الخادم:** Fastify 4 + TypeScript + Zod، صيغة استجابة موحدة، إصدار API عبر `/api/v1` تدريجيًا مع إبقاء `/api` للتوافق.
- **البيانات:** PostgreSQL + Prisma، مع نسخ احتياطي يومي وسياسة احتفاظ.
- **الكاش:** Redis اختياري (جلسات/إحصاءات/طوابير) مع Fallback داخلي للتطوير.
- **ML:** خدمة Python منفصلة، تُستدعى عبر HTTP، وقرارها استشاري فقط.

## 3) مطابقة البيانات (Prototype → Prisma)

| مجموعة `data.json` | جدول Prisma | ملاحظات الترحيل |
|---|---|---|
| `users` | `User` + `Session` | تجزئة كلمات المرور تُرحّل كما هي (scrypt/PBKDF2) ثم تُعاد إلى Argon2id عند أول دخول |
| `levels`, `classes` | `Level`, `Class` | `teacherId` من `users` بدور teacher |
| `students` | `Student` | `guardianId` → `User` بدور parent |
| `subjects`, `curriculum` | `Subject`, `Curriculum` | حالة النشر `status` |
| `competencyReferences`, `competencies` | `CompetencyReference`, `StudentCompetency` | ربط `refId` عند توفره |
| `assessments` | `Assessment` | نوع التقييم + الفصل |
| `feedbackCards` | `FeedbackCard` + `FeedbackCardHistory` | `evidenceIds[]` تُحوّل إلى `Evidence` عند الحاجة |
| `cases` | `Case` + `CaseTimeline` | الخط الزمني مرتب |
| `talents`, `learningPaths`, `interventions`, `alerts` | جداول مطابقة | علاقات `studentId` إلزامية |
| `agentProfiles`, `agentRuns`, `evidence` | `AgentProfile`, `AgentRun`, `Evidence` | كل تشغيل مرتبط بدليل |
| `activities`, `activityEnrollments` | `Activity`, `ActivityEnrollment` | قيد فريد (طالب، نشاط) |
| `publications` | `Publication` | نشر بعد مراجعة |
| `communications`, `drafts` | `Communication`, `Draft` | الحوكمة في `governance` JSON |
| `impactLog` | `ImpactLog` | baseline / target / current |
| `wellbeingCheckins`, `mentoringPairs` | جداول مطابقة | بيانات حساسة: تقليل وتجميع |
| `attendance`, `assignments`, `submissions`, `grades` | جداول مطابقة | فهارس على (طالب، مادة، فصل) |
| `staff`, `finance`, `goals`, `strategy`, `competitors`, `partnerships` | جداول الإدارة | JSON للحقول المرنة |
| `auditLogs` | `AuditLog` | تُرحّل للقراءة فقط |
| `retentionPolicy`, `languageConfig` | إعدادات | ملف/جدول إعدادات |

**قاعدة:** أي حقل غير موجود في `schema.prisma` لا يُخترع؛ يُحفظ في حقل `profile`/`details` من نوع JSON مع توثيق.

## 4) تدفّق المصادقة

```text
POST /api/auth/login { login, password, portal }
  ├─ التحقق من المستخدم (email/phone) + isActive
  ├─ رفض عدم تطابق الدور مع البوابة (403)
  ├─ التحقق من كلمة المرور (Argon2id؛ مع دعم legacy وإعادة التجزئة)
  ├─ إنشاء Session (refreshHash، expiresAt = 14 يومًا)
  └─ إرجاع accessToken (2 ساعة) + refreshToken + user

POST /api/auth/refresh { refreshToken }
  ├─ البحث بالـ hash، التحقق من الصلاحية
  ├─ إبطال الجلسة القديمة (rotation)
  └─ إرجاع زوج جديد

POST /api/auth/logout | /logout-all
GET  /api/auth/me
```

- الرموز تُوقّع بـ `JWT_SECRET` (≥ 32 حرفًا) وتُخزّن في `localStorage` في تطوير الويب فقط؛ في الإنتاج يُفضّل `httpOnly cookie` + CSRF.
- حدود معدل: 200 طلب/دقيقة لكل IP (قابلة للضبط)، مع حد أقسى على `/api/auth/*`.

## 5) خطوات الترحيل (Checklist)

### المرحلة 1 — الأساس (الحالية)
- [x] Monorepo + pnpm workspaces + `tsconfig.base.json`
- [x] Prisma schema شامل (30+ موديل)
- [ ] Fastify: config, Prisma, Redis fallback, password, tokens
- [ ] Fastify: auth plugin + RBAC + audit + health
- [ ] React: routing, auth store, i18n (4 لغات), design system, login, dashboard
- [ ] Seed script من `backend/data.json`
- [ ] اختبارات API (health + auth validation) + اختبار الدخان للنموذج

### المرحلة 2 — الوظائف الأساسية
- [ ] الطلاب/الفصول/الحضور/الواجبات/الدرجات
- [ ] المناهج والكفايات والتقييمات
- [ ] مسارات التعلم وبطاقات التغذية الراجعة
- [ ] إدارة الحالات والخط الزمني
- [ ] لوحات المعلم/الولي/التلميذ

### المرحلة 3 — الميزات المتقدمة
- [ ] المساعد الذكي (تشغيلات + أدلة + موافقة)
- [ ] ML: فجوات، إنذار مبكر، توصيات، A/B
- [ ] الأنشطة، الرفاه، الإرشاد، المعرض الرقمي
- [ ] التواصل الأسري وحوكمته
- [ ] قياس الأثر والتحليلات المجهولة

### المرحلة 4 — الإطلاق
- [ ] i18n كامل + إتاحة WCAG 2.1 AA
- [ ] PWA + Push
- [ ] اختبار حمل (k6) وأمان (OWASP)
- [ ] مراقبة (Prometheus/Grafana/Sentry) ونسخ احتياطي
- [ ] تدريب المستخدمين وUAT

## 6) البيئات والإعدادات

| المتغير | الاستخدام | افتراضي تطويري |
|---|---|---|
| `NODE_ENV` | بيئة التشغيل | `development` |
| `PORT` | منفذ API | `3001` |
| `DATABASE_URL` | اتصال PostgreSQL | — (إلزامي في الإنتاج) |
| `JWT_SECRET` | توقيع الرموز | قيمة تطويرية فقط |
| `JWT_EXPIRES_IN` | عمر access token | `2h` |
| `REFRESH_TTL_DAYS` | عمر refresh token | `14` |
| `REDIS_URL` | كاش/جلسات | فارغ = Fallback داخلي |
| `CORS_ORIGIN` | أصل الواجهة | `http://localhost:5173` |
| `ARGON2_MEMORY_COST` | قوة التجزئة | `19456` (KiB) |

**ممنوع** رفع `.env` أو الأسرار إلى المستودع. تدوير `JWT_SECRET` يبطل كل الرموز النشطة (مقبول في الطوارئ).

## 7) الأمان والحوكمة

- **فصل البوابات:** `admin_portal` ≠ `private` على مستوى الوسيط والمسار.
- **RBAC + Scope:** المعلم مقيّد بفصوله، الولي بأبنائه، التلميذ بنفسه.
- **التدقيق:** كل عملية كتابة/اعتماد/إرسال تُسجّل (الفاعل، الكيان، التفاصيل، الزمن).
- **الاحتفاظ:** سياسة قابلة للتطبيق (`/api/admin/retention/apply`) مع عدم حذف ما يلزم قانونًا.
- **الخصوصية:** التقارير المجمّعة بحد أدنى 3 أفراد؛ لا كشف فردي في التحليلات.
- **الذكاء الاصطناعي:** النتائج استشارية، مع أدلة قابلة للفحص وموافقة بشرية قبل أي إجراء.

## 8) الاختبار والجودة

| المستوى | الأداة | التغطية المستهدفة |
|---|---|---|
| Unit | Jest/Vitest | 70% للخدمات الحساسة (auth, rbac, ml) |
| Integration | Supertest + DB اختباري | كل مسار API |
| E2E | Playwright | 10 مسارات حرجة (دخول، تقييم، اعتماد، تواصل) |
| Smoke | `tests/prototype-smoke.js` | النموذج الأولي (41 فحصًا) |
| Load | k6 | p95 < 200ms، 500 مستخدم متزامن |
| Security | OWASP ZAP + مراجعة يدوية | 0 ثغرات حرجة |

## 9) النشر

```bash
docker compose up -d --build   # web + api + postgres + redis (+ ml اختياري)
```

- أسرار عبر مدير أسرار (Docker secrets / Vault / cloud).
- HTTPS إلزامي (reverse proxy: Caddy/Nginx/Traefik).
- نسخ احتياطي يومي لقاعدة البيانات + اختبار استعادة شهري.
- مراقبة: `/api/health`، لوحات Prometheus، تنبيهات Sentry.

## 10) المخاطر والتخفيف

| الخطر | التخفيف |
|---|---|
| فقدان بيانات أثناء الترحيل | Seed قابل للتكرار + تحقق من الأعداد + نسخة احتياطية قبل التنفيذ |
| تضخم النطاق | الالتزام بالمراحل أعلاه؛ كل ميزة خلف علم تشغيل |
| ضعف التبنّي | تدريب، أدلة مصوّرة، تشغيل تجريبي مع 3 فصول |
| ثغرة أمنية | مراجعة OWASP، اختبار اختراق، مبدأ أقل صلاحية |
| اعتماد مفرط على AI | قرار بشري إلزامي + أدلة + سجل تدقيق |
