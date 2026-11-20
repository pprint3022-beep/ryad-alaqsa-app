# مرجع واجهات API — Ryad Al Aqsa

## المصادقة (Auth)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | تسجيل دخول (portal: admin_portal/private, login, password) → token + refreshToken |
| POST | `/api/auth/refresh` | تجديد رمز الوصول (refreshToken) → new token + rotated refresh |
| GET | `/api/auth/me` | معلومات المستخدم الحالي |

## بوابة الإدارة (Admin) — `/api/admin/*`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/admin/overview` | all admin | نظرة عامة (حضور، تلاميذ، فصول، تدقيق، بطاقات، حالات) |
| GET | `/api/admin/curriculum` | all admin | المناهج (items, subjects, levels) |
| POST | `/api/admin/curriculum` | director, deputy, admin | إنشاء منهج |
| GET | `/api/admin/audit-logs` | director, deputy, admin | سجل التدقيق (آخر 100) |
| GET | `/api/admin/performance` | all admin | أداء حسب المستوى |
| GET | `/api/admin/strategy` | director, deputy, admin | استراتيجية وأهداف ومنافسون وشراكات |
| GET | `/api/admin/finance` | director, deputy | بيانات مالية |
| GET | `/api/admin/learning-analytics` | all admin | تحليلات تعلم (summary + insights + activities) |
| GET | `/api/admin/smart-assistant` | director, deputy, supervisor, admin | المساعد الاجتماعي وبيئة الوكلاء (agents, cases, cards, evidence, library, drafts, activities, publications) |
| GET | `/api/admin/competency-refs` | all admin + clerk | مراجع كفايات (level filter) |
| GET | `/api/admin/feedback-cards` | director, deputy, supervisor, admin | بطاقات تغذية راجعة (studentId filter) |
| POST | `/api/admin/feedback-cards/update` | director, deputy, supervisor, admin | تحديث بطاقة (status, assignee, reviewNotes, nextReview, actions) |
| GET | `/api/admin/cases` | director, deputy, supervisor, admin | حالات (studentId filter) |
| POST | `/api/admin/cases/update` | director, deputy, supervisor, admin | تحديث حالة (status, ownerRole, ownerId, focus, nextReview) |
| POST | `/api/admin/cases/timeline` | director, deputy, supervisor, admin | إضافة حدث للخط الزمني |
| GET | `/api/admin/library` | all admin + clerk | المكتبة العلمية |
| GET | `/api/admin/system-stats` | all admin | إحصاءات النظام + retention policy |
| GET | `/api/admin/impact` | director, deputy, supervisor, admin | قياس أثر (interventions, cards, cases, outreach, reassessmentDue) |
| GET | `/api/admin/alerts` | director, deputy, supervisor, admin | تنبيهات (db alerts + reassessment due) |
| GET | `/api/admin/retention` | director, deputy, admin | سياسة احتفاظ + نوع التخزين |
| POST | `/api/admin/retention/apply` | director, admin | تطبيق تنظيف (audit/sessions) |
| GET | `/api/admin/assessments` | director, deputy, supervisor, admin | تقييمات (studentId filter) |
| POST | `/api/admin/assessments` | director, deputy, supervisor, admin | إنشاء تقييم |
| GET | `/api/admin/communications` | director, deputy, supervisor, admin | سجل تواصل + مسودات |
| POST | `/api/admin/communications/update` | director, deputy, supervisor, admin | تحديث تواصل (status, governance, notes) |
| GET | `/api/admin/impact-report` | director, deputy, supervisor, admin | تقرير أثر (summary + impactLog + trends) |
| GET | `/api/admin/analytics/anonymized` | director, deputy, admin | تحليلات مجهولة (k-anonymity + trends) |
| GET | `/api/admin/integrations` | director, deputy, admin | قائمة التكاملات |
| GET | `/api/admin/integrations/export` | director, deputy, admin | تصدير بيانات (MASSAR/eSchool) |
| POST | `/api/admin/communications/send` | director, deputy, supervisor, admin | إرسال تواصل (حوكمة + delivery) |

## حسابات خاصة (Private) — `/api/teacher/*`, `/api/parent/*`, `/api/student/*`

### معلم (Teacher)
| Method | Path | Description |
|---|---|---|
| GET | `/api/teacher/classes` | فصول المعلم (with students) |
| GET | `/api/teacher/student-report?studentId=` | تقرير تلميذ (نطاق فصول المعلم) |
| GET | `/api/teacher/student-insights?studentId=` | رؤى تلميذ (نطاق) |
| GET | `/api/teacher/drafts?studentId=` | مسودات (نطاق) |
| GET | `/api/teacher/feedback-cards?studentId=` | بطاقات (نطاق) |
| POST | `/api/teacher/feedback-cards/update` | تحديث بطاقة (نطاق) |
| GET | `/api/teacher/cases?studentId=` | حالات (نطاق) |
| POST | `/api/teacher/cases/timeline` | إضافة حدث (نطاق) |
| GET | `/api/teacher/competency-refs?level=` | مراجع كفايات |
| GET | `/api/teacher/assessments?studentId=` | تقييمات (نطاق) |
| POST | `/api/teacher/assessments` | إنشاء تقييم (نطاق) |
| GET | `/api/teacher/communications?studentId=` | تواصل (نطاق) |
| POST | `/api/teacher/communications/update` | تحديث تواصل (نطاق) |
| GET | `/api/teacher/alerts` | تنبيهات (نطاق) |
| GET | `/api/teacher/impact-report` | تقرير أثر (scoped) |
| POST | `/api/teacher/communications/send` | إرسال تواصل (scoped + governance) |

### ولي أمر (Parent)
| Method | Path | Description |
|---|---|---|
| GET | `/api/parent/children` | أبناء ولي الأمر |
| GET | `/api/parent/child-report?studentId=` | تقرير ابن (أبناء فقط) |
| GET | `/api/parent/child-insights?studentId=` | رؤى ابن (أبناء فقط) |

### تلميذ (Student)
| Method | Path | Description |
|---|---|---|
| GET | `/api/student/profile` | ملف التلميذ |
| GET | `/api/student/insights` | رؤى التلميذ (ذاته) |
| GET | `/api/student/curriculum` | مناهج مستوى التلميذ |

## مشترك
| Method | Path | Description |
|---|---|---|
| GET | `/api/institution` | معلومات المؤسسة |