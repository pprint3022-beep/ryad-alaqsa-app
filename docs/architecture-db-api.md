# هيكلة البنية، قاعدة البيانات و API
**المشروع:** Ryad Al Aqsa App — Institut Ryad Al Aqsa / رياض الأقصى  
**الهدف:** فصل **منصة المدير والإدارة (الخادم الرئيسي)** عن **الحسابات الخاصة** (معلم/ولي/تلميذ)، مع إدارة الإدارة للمحتوى والأداء وتنفيذ المهام وتطوير الاستراتيجية.

---

## 1) نظرة عامة على البنية (Architecture)

```text
[Clients]
  ├─ Admin Portal (Web)  —— منصة المدير والإدارة (خادم رئيسي)
  └─ Private Spaces      —— حسابات خاصة: معلم / ولي أمر / تلميذ (Web/Mobile)

        │ HTTPS (JWT/Session) + RBAC + Scope
        ▼
[API Gateway / Backend Server]
  ├─ Auth & Identity Service      (تسجيل دخول، أدوار، جلسات، فصل البوابات)
  ├─ RBAC/Policy Service          (صلاحيات، تفويض، نطاقات)
  ├─ Admin & Strategy Service     (محتوى، أداء، مهام، استراتيجية، تقارير مؤسسية)
  ├─ School Ops Service           (تسجيل، ملفات، جداول، وثائق، حضور، تقييم)
  ├─ Communication Service        (رسائل، تعميمات، إشعارات)
  └─ Learning Service             (مواد، دروس، واجبات، تقدم، إنجازات)

        ▼
[Data Layer]
  ├─ PostgreSQL (أساسي: مستخدمون، أدوار، هيكل تعليمي، سجلات)
  ├─ Object Storage (ملفات، موارد تعليمية، مرفقات)
  ├─ Cache (جلسات/مؤشرات أداء)
  └─ Audit Log Store (سجل تدقيق للعمليات الحساسة)
```

### مبادئ الفصل
- **فصل البوابات:** نوع البوابة (`admin_portal` | `private`) يُثبت في الجلسة/التوكن بعد تسجيل الدخول؛ أي طلب لمسارات الإدارة من حساب خاص يُرفض (403).
- **RBAC + نطاق (Scope):** صلاحية = (دور، مورد، إجراء، نطاق). النطاق قد يكون مؤسسة/مستوى/فصل/مادة/تلميذ/أبناء.
- **الخادم الرئيسي:** يستضيف خدمات الإدارة والتشغيل والبيانات؛ الواجهات عملاء فقط.

---

## 2) نموذج الأدوار والنطاقات
- **أدوار إدارية (منصة الإدارة):** `director`, `deputy_director`, `supervisor`, `clerk`, `admin_staff`
- **أدوار خاصة:** `teacher`, `parent`, `student`
- **المستويات:** تمهيدي، الأول..السادس ابتدائي
- **تفويض نائب المدير:** سجلات تفويض زمنية/إجرائية (ما الذي يمكن اعتماده/تنفيذه بالنيابة).

---

## 3) مخطط قاعدة البيانات (مقترح)

### 3.1 الهوية والوصول
- **users**: `id, full_name, email, phone, password_hash, status, created_at, updated_at`
- **roles**: `id, code, name_ar, portal_type(admin_portal|private)`
- **user_roles**: `id, user_id, role_id, scope_type(global|level|class|subject|student|children), scope_id?, granted_by?, valid_from?, valid_to?`
- **delegations** (تفويض نائب المدير): `id, from_role_user_id(director), to_user_id, permissions_json, valid_from, valid_to, active`
- **sessions/tokens**: `id, user_id, portal_type, issued_at, expires_at, revoked_at`

### 3.2 الهيكل التعليمي
- **academic_years**: `id, name, start_date, end_date, is_current`
- **levels**: `id, code, name_ar` (تمهيدي، أول..سادس ابتدائي), `order`
- **classes**: `id, academic_year_id, level_id, name, capacity`
- **subjects**: `id, name_ar, category(core_language|optional_language|other), active`
- **level_subjects**: `id, level_id, subject_id, required(bool)`
- **teacher_assignments**: `id, teacher_user_id, class_id, subject_id?, academic_year_id`

### 3.3 التلاميذ والأولياء
- **students**: `id, user_id?, full_name, level_id, class_id, enrollment_status, dob?`
- **guardians**: `id, user_id, full_name, phone, email`
- **guardian_students**: `guardian_id, student_id, relation`

### 3.4 التشغيل والإدارة
- **enrollments**: `id, student_id, academic_year_id, level_id, class_id?, status(pending|approved|rejected|incomplete), submitted_by, reviewed_by, reviewed_at, notes`
- **documents**: `id, type(incoming|outgoing|record|file), title, ref_no, owner_scope, file_url, created_by, created_at, status`
- **tasks**: `id, title, description, owner_role/user, due_date, status, priority, related_goal_id?`
- **approvals**: `id, entity_type, entity_id, requested_by, approver_role, status, decided_by, decided_at, delegation_id?`

### 3.5 المحتوى والأداء والاستراتيجية (إدارة)
- **content_items**: `id, subject_id, level_id?, title, type(lesson|resource|exercise|media), status(draft|review|published|archived), created_by, approved_by?, published_at?`
- **content_assets**: `id, content_item_id, storage_key/url, mime, size`
- **performance_indicators**: `id, name, scope(institution|level|class|teacher), period, value, target, source`
- **strategic_goals**: `id, title, description, period, owner, status`
- **initiatives**: `id, goal_id, title, progress, status, owner`

### 3.6 التعليم والتقييم والتواصل
- **attendance**: `id, student_id, class_id, date, status(present|absent|late), recorded_by`
- **assignments**: `id, class_id, subject_id, teacher_id, title, description, due_at, status`
- **submissions**: `id, assignment_id, student_id, submitted_at, status, grade?, feedback?`
- **grades/assessments**: `id, student_id, subject_id, class_id, term, score, scale, teacher_id`
- **messages**: `id, thread_id?, sender_user_id, recipient_scope(user|class|guardians|role), body, created_at`
- **announcements**: `id, title, body, audience_scope, created_by, approved_by?, published_at`
- **notifications**: `id, user_id, type, payload, read_at, created_at`

### 3.7 التحفيز والتقارير
- **student_progress**: `id, student_id, subject_id/track, progress_pct, updated_at`
- **achievements**: `id, student_id, type(badge|xp|streak), value, awarded_at`
- **reports**: `id, type, scope, period, generated_by, file_url?, summary_json`
- **audit_logs**: `id, actor_user_id, action, entity_type, entity_id, before_json?, after_json?, ip, created_at`

---

## 4) واجهة API (مقترحة، REST-ish)

### 4.1 المصادقة والفصل بين البوابات
- `POST /auth/login` — `{identifier, password, portal: "admin_portal"|"private"}` → توكن يحتوي `portal_type` + أدوار
- `POST /auth/logout`, `POST /auth/refresh`
- `GET /auth/me` — الملف والدور/النطاق
- **سياسة:** رفض أي `/admin/*` إذا `portal_type != admin_portal`

### 4.2 منصة الإدارة (الخادم الرئيسي) `/admin/...`
**المستخدمون والهيكل**
- `GET/POST /admin/users`, `GET/PUT /admin/users/:id`, `PUT /admin/users/:id/roles`
- `GET/POST/PUT /admin/academic-years`, `/admin/levels`, `/admin/classes`, `/admin/subjects`
- `POST/PUT /admin/delegations` (تفويض نائب المدير — المدير فقط/حسب السياسة)

**المحتوى والأداء والتنفيذ والاستراتيجية (إدارة عام + صلاحيات حسب الدور)**
- `GET/POST/PUT /admin/content` ، `POST /admin/content/:id/publish|archive`
- `GET/POST /admin/performance/indicators` ، `GET /admin/performance/reports?scope=&period=`
- `GET/POST/PUT /admin/tasks` ، `GET /admin/tasks/overview`
- `GET/POST/PUT /admin/strategy/goals` ، `/admin/strategy/initiatives`

**التشغيل والاعتمادات والوثائق**
- `GET/POST/PUT /admin/enrollments` ، `POST /admin/enrollments/:id/approve|reject`
- `GET/POST/PUT /admin/documents` ، `GET /admin/documents/incoming|outgoing`
- `GET/POST /admin/approvals` ، `POST /admin/approvals/:id/decide`
- `GET/POST /admin/schedules` ، `GET/POST /admin/announcements`
- `GET /admin/reports/*` ، `POST /admin/reports/export`
- `GET /admin/audit-logs` (مدير/مصرح)

**الإشراف والكتابة** (نفس البادئة مع تحقق صلاحيات الدور والنطاق)
- `/admin/supervision/*` (ملاحظات، زيارات، تقارير إشراف)
- `/admin/office/*` (ملفات، صادر/وارد، طباعة)

### 4.3 فضاءات الحسابات الخاصة `/me/...`
**المعلم** `/teacher/...` (نطاق: فصوله/مواده)
- `GET /teacher/classes`, `/teacher/students?classId=`
- `GET/POST/PUT /teacher/attendance`, `/teacher/assignments`, `/teacher/submissions/:id/grade`
- `GET/POST /teacher/reports` (تقارير متابعة قابلة للمشاركة)
- `GET/POST /teacher/messages`

**ولي الأمر** `/parent/...` (نطاق: أبناؤه)
- `GET /parent/children`, `GET /parent/children/:id/overview|attendance|assignments|grades|reports`
- `GET /parent/children/:id/guidance` (توصيات دعم وتكامل مع المعلم)
- `GET/POST /parent/messages`, `GET /parent/calendar`, `GET /parent/notifications`

**التلميذ** `/student/...` (نطاق: حسابه)
- `GET /student/dashboard` (مساري اليوم)، `GET /student/schedule`
- `GET /student/subjects` (أساسي/اختياري/أخرى)، `GET /student/learning?subjectId=&level=`
- `GET/POST /student/assignments`, `POST /student/assignments/:id/submit`
- `GET /student/progress`, `GET /student/achievements`, `GET/POST /student/messages` (حسب السياسة)

### 4.4 مشترك (حسب البوابة/الدور)
- `GET /notifications`, `PUT /notifications/:id/read`
- `GET /institution/profile` (بيانات المؤسسة)

---

## 5) اعتبارات أمان وتنفيذ
- **التحقق:** كل طلب يمر عبر مصادقة → تحقق بوابة → تحقق RBAC → تحقق نطاق (scope).
- **الخصوصية:** تقييد بيانات ولي الأمر/التلميذ بنطاق الأبناء/الحساب؛ إخفاء بيانات حساسة غير لازمة.
- **التدقيق:** تسجيل الاعتمادات، تغييرات الصلاحيات، نشر المحتوى، تعديل الدرجات، العمليات الحساسة.
- **الأداء:** فهارس على (user_id, role, scope)، (student_id, date)، (class_id, subject_id)، وتقارير مجمعة دورية.
- **اللغات والمحتوى:** دعم محتوى متعدد اللغات (AR/FR/EN/Amazigh + اختياري) وربط المواد بالمستويات.