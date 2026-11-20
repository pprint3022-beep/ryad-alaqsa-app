# جاهزية الإنتاج — Production readiness checklist

> المعهد: Institut Ryad Al Aqsa · التاريخ: 2026-11-20 · الحالة: النموذج الأولي يعمل، والإنتاج **غير مُتحقَّق منه محليًا** حتى الآن.
> الغرض: ربط كل مكوّن في النموذج الأولي ببديله الإنتاجي، وتثبيت الأوامر المحلية، وتسجيل ما لم يُختبر بعد.

---

## 1) خريطة الاستبدال — Prototype → Production

| # | النموذج الأولي (Prototype) | البديل الإنتاجي (Production replacement) | المسارات | الحالة |
|---|---|---|---|---|
| 1 | مخزن JSON (`demoLessonContentSeed: "v6"` — 96 وحدة و380 درسًا) | **PostgreSQL / Prisma** مع هجرات وبذرة وقيود علائقية | `backend/data.json` → `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts` | 🟡 مخطط وموجود، غير مُهاجَر فعليًا |
| 2 | خادم Node HTTP | **Fastify API** مع CORS/Helmet/Rate-limit/JWT/Zod | `backend/server.js` → `apps/api/src/index.ts`, `apps/api/package.json` | 🟡 الكود موجود، لم يُشغَّل ضد قاعدة بيانات |
| 3 | `SpeechSynthesis` + مقاطع محلية | **TTS مُدار** بنفس قواعد أمان الصوت: لا تُقرأ العربية أو اليفيناغ بصوت أجنبي افتراضي، الصوت اختياري وبطلب المستخدم فقط | `apps/web/src/lib/speech.ts`, `apps/web/public/audio/amz/` → مزوّد TTS مُدار عبر `apps/api/src/` | 🟡 القواعد محفوظة، التكامل لم يُنفَّذ |
| 4 | طباعة المتصفح (`window.print()`) | **مكتبة PDF حقيقية** بخطوط عربية وترقيم صفحات وتوقيع مستند معتمد | `apps/web/src/pages/admin/ReportCards.tsx`, `apps/web/src/pages/family/ReportCard.tsx`, `apps/web/src/pages/admin/GradeResults.tsx` → مولّد PDF في `apps/api/src/` | 🔲 لم يبدأ |
| 5 | مسودّات `localStorage` | **مسودّات في قاعدة البيانات مع تدقيق** (من أنشأ/عدّل/اعتمد ومتى) | `apps/web/src/pages/family/LearningPath.tsx`, `apps/web/src/store/auth.ts` → نماذج `Draft` و`AuditLog` في `apps/api/prisma/schema.prisma` | 🟡 النماذج موجودة، النقل لم يُنجز |
| 6 | خدمة ML استشارية في النموذج الأولي | **خدمة Python** (FastAPI) مع تجارب `pytest` وقرار بشري فقط (`advisory_only`) | `backend/ml.js` → `services/ml/app/main.py`, `services/ml/tests/test_api.py`, `services/ml/pytest.ini`, `services/ml/requirements.txt` | 🟡 البنية والاختبارات موجودة، لم تُشغَّل (Python stub محليًا) |
| 7 | مكوّنات v7 (`ux/`) ولوحات وتقارير «القراءة السريعة» | **نظام تصميم موحّد** مع رموز ألوان وتوثيق مكوّنات وفحوص إتاحة آلية (WCAG AA) | `apps/web/src/components/ux/`، `pages/Dashboard.tsx`، `components/ExecutiveDashboard.tsx`، صفحات التقارير → مكتبة مكوّنات + اختبارات a11y في CI | 🟡 مُنجزة في النموذج وتحقّق متصفحيًا، والتدقيق الآلي لم يُضف بعد |

> قواعد ثابتة عند الاستبدال: فصل `admin_portal` عن فضاء التلميذ، نطاق المعلم على فصوله، الولي على أبنائه، تسجيل كل قراءة حسّاسة في التدقيق، واعتبار زمن المنصة منفصلًا عن حضور القسم.

---

## 2) الأوامر المحلية المطلوبة — Exact local commands

من جذر المستودع `ryad-alaqsa-app/`:

```bash
npm run db:migrate
npm run db:seed
npm run test:smoke
node tests/prototype-extended.js
node scripts/check-runtime-env.js
```

- `npm run db:migrate` ينفّذ `prisma migrate dev` ويحتاج `DATABASE_URL` وخادم PostgreSQL يعمل.
- `npm run db:seed` ينفّذ `apps/api/prisma/seed.ts`.
- `npm run test:smoke` يشغّل `tests/prototype-smoke.js`.
- `node tests/prototype-extended.js` **يشغّل خادمه الخاص على المنفذ 3198** (`EXTENDED_TEST_PORT` للتبديل) ولا يحتاج خدمة خارجية.
- `node scripts/check-runtime-env.js` تقرير فقط، يخرج دائمًا برمز 0 ويُظهر READY / BLOCKED / OPTIONAL مع إجراءات BLOCKED.

---

## 3) قائمة «لم يُتحقَّق منها بعد» — Not yet verified

- ⛔ **قاعدة البيانات الفعلية:** لم تُطبَّق الهجرة ولا البذرة على PostgreSQL حقيقي؛ لا يوجد `psql` محلي ولا `DATABASE_URL`.
- ⛔ **أدوات محلية:** `python` هو stub من Microsoft Store؛ لم تُشغَّل اختبارات `pytest` لخدمة ML. أمّا `git` فمتاح محليًا عبر حزمة GitHub Copilot CLI ويُكتشف في `scripts/check-runtime-env.js`، لكنه غير مضاف إلى PATH ولا يوجد مستودع مُهيأ بعد.
- ⛔ **خدمة ML:** لم تُختبر نقاط `/health` و`/v1/*` ولا التكامل مع `apps/api` عبر `ML_SERVICE_URL`.
- 🟡 **إنتاج الـ API:** `npm run typecheck` / `npm run build` موجودة كأوامر، لكن التشغيل ضد Prisma Client مُولَّد وقاعدة بيانات فعلية لم يُؤكَّد.
- 🟡 **PDF:** لا يوجد مولّد PDF حقيقي بعد؛ الطباعة تعتمد على المتصفح فقط.
- 🟡 **TTS المُدار:** لم يُختبر أي مزوّد صوت خارجي؛ قواعد منع الصوت الخاطئ مُطبَّقة في `apps/web/src/lib/speech.ts` فقط.
- 🟡 **المسودّات والتدقيق:** لم يُثبت نقل مسودّات `localStorage` إلى `Draft` مع سجل `AuditLog` كامل.
- 🔲 **CI:** ملف `.github/workflows/ci.yml` أُضيف لكنه لم يُشغَّل على GitHub Actions بعد (يتطلب تهيئة مستودع وremote ودفعًا؛ Git متاح محليًا).
- 🔲 **النسخ الاحتياطي والاستعادة، والأمان (CSRF/SSRF/تحديد المعدل)، وإتاحة WCAG AA، وPWA/دون اتصال، وتعدد المدارس:** لم تُختبر.

---

## 4) بوابة الانتقال إلى الإنتاج — Go / no-go

لا يُعدّ المشروع جاهزًا للإنتاج حتى تتحقق كل الشروط التالية:

1. `node scripts/check-runtime-env.js` بلا عناصر BLOCKED في node/npm/git/python/البيانات (psql اختياري للتشغيل الآلي).
2. نجاح `npm run db:migrate` و`npm run db:seed` على بيئة PostgreSQL مُعدّة، مع حفظ نسخة احتياطية قابلة للاستعادة.
3. نجاح `npm run typecheck` و`npm run build` و`npm run test:smoke` و`node tests/prototype-extended.js` في CI.
4. تدقيق أمني وإتاحة (WCAG AA) وتوقيع مولّد PDF واختبار TTS المُدار مع نفس قواعد أمان الصوت.
5. توثيق أي استثناء في هذا الملف مع صاحبه وتاريخ المراجعة.
