# Ryad Al Aqsa — ML service

خدمة استشارية صغيرة (FastAPI) تُغذّي لوحات المؤسسة بإشارات مبكرة وتوصيات. **لا تتخذ قرارًا ولا تحفظ بيانات شخصية.**

## التشغيل
```bash
cd services/ml
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Swagger: http://localhost:8000/docs
- Health: http://localhost:8000/health

## النقاط
| Method | Path | الوصف |
|---|---|---|
| GET | `/health` | حالة الخدمة والنماذج |
| POST | `/v1/gap-risk` | مخاطر فجوة لتلميذ واحد (مدخلات مجمّعة فقط) |
| POST | `/v1/early-warning` | قائمة مرتبة بالمخاطر العالية |
| POST | `/v1/recommendations` | توصيات مبنية على القوة/الاهتمام/الفجوة |

## مبادئ
- **أدلة شفافة:** كل نتيجة تُرجع `drivers` (عوامل) و`suggested_actions`.
- **لا هوية:** يُستخدم `learner_key` مستعار فقط.
- **قرار بشري:** كل استجابة تحمل `advisory_only: true`.
- **تكافؤ مع النموذج:** الأوزان تطابق `backend/ml.js` لتسهيل المقارنة والاختبار.

## الخطوة التالية
- تدريب نموذج انحدار على بيانات تاريخية (بعد توفر بيانات كافية ومجهولة الهوية).
- تتبع تجارب (MLflow) وبوابة موافقة قبل نشر أي نموذج جديد.
- ربط الخدمة بـ `apps/api` عبر `ML_SERVICE_URL` مع timeout وfallback إلى القواعد الحالية.
