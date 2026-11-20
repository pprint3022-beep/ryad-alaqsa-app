const state = {
  portal: null, // 'admin' | 'private'
  role: null,
  view: null,
  token: null,
  refreshToken: null,
  user: null,
  api: { ok: null, base: '' },
  cache: {},
  selected: { studentId: null, cardId: null, caseId: null },
};

// Apply stored language direction on load
(function() {
  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'ar';
  const langs = (typeof LANGUAGES !== 'undefined') ? LANGUAGES : { ar: { dir: 'rtl' } };
  document.documentElement.lang = lang;
  document.documentElement.dir = (langs[lang] && langs[lang].dir) || 'rtl';
})();

// Register service worker for PWA (offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker registered:', reg.scope);
    }).catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  });
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers||{}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  try {
    const res = await fetch(path, { ...options, headers });
    const text = await res.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!res.ok) return { ok: false, status: res.status, error: data?.error || data?.message || 'error', data };
    state.api.ok = true;
    return { ok: true, status: res.status, data };
  } catch (e) {
    state.api.ok = false;
    return { ok: false, status: 0, error: 'network', data: null };
  }
}

function esc(s='') { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function fmtStatus(s) {
  const map = { proposed:'مقترحة', approved:'معتمدة', rejected:'مرفوضة', in_progress:'قيد التنفيذ', completed:'منجزة', active:'نشطة' };
  return map[s] || s || '';
}

const roleMeta = {
  director: { label: 'المدير', home: 'dashboard', portal: 'admin' },
  deputy: { label: 'نائب المدير', home: 'dashboard', portal: 'admin' },
  supervisor: { label: 'المشرف', home: 'supervision', portal: 'admin' },
  clerk: { label: 'الكاتب', home: 'office', portal: 'admin' },
  admin: { label: 'الإدارة (عام)', home: 'adminOps', portal: 'admin' },
  teacher: { label: 'المعلم/ة', home: 'today', portal: 'private' },
  parent: { label: 'ولي الأمر', home: 'children', portal: 'private' },
  student: { label: 'التلميذ', home: 'journey', portal: 'private' },
};

const adminRoles = ['director','deputy','supervisor','clerk','admin'];
const privateRoles = ['teacher','parent','student'];

const levels = ['تمهيدي', 'الأول ابتدائي', 'الثاني ابتدائي', 'الثالث ابتدائي', 'الرابع ابتدائي', 'الخامس ابتدائي', 'السادس ابتدائي'];

const subjects = {
  coreLanguages: ['اللغة العربية', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'اللغة الأمازيغية'],
  optionalLanguages: ['الإسبانية', 'الألمانية', 'الإيطالية'],
  other: ['الرياضيات', 'التربية الإسلامية', 'النشاط العلمي', 'الثقافة', 'التاريخ والجغرافيا', 'أنشطة فنية', 'تربية بدنية'],
};

const navByRole = {
  director: [
    ['dashboard', 'لوحة القيادة'],
    ['reports', 'التقارير والأداء'],
    ['learningAnalytics', 'تحليلات التعلم والمواهب'],
    ['smartAssistant', 'المساعد الاجتماعي وبيئة الوكلاء'],
    ['management', 'إدارة المؤسسة'],
    ['approvals', 'الاعتمادات'],
    ['strategy', 'الاستراتيجية'],
    ['staffing', 'توزيع المهام والصلاحيات'],
    ['comms', 'التعميمات'],
  ],
  deputy: [
    ['dashboard', 'لوحة المتابعة'],
    ['reports', 'التقارير والأداء'],
    ['learningAnalytics', 'تحليلات التعلم'],
    ['smartAssistant', 'المساعد الاجتماعي وبيئة الوكلاء'],
    ['approvals', 'اعتمادات مفوضة'],
    ['execution', 'متابعة التنفيذ'],
    ['staffing', 'متابعة المهام'],
    ['comms', 'التعميمات'],
  ],
  supervisor: [
    ['supervision', 'الإشراف التربوي'],
    ['learningAnalytics', 'متابعة الفجوات والمواهب'],
    ['smartAssistant', 'المساعد الاجتماعي وبيئة الوكلاء'],
    ['attendance', 'متابعة الحضور'],
    ['classes', 'الفصول والمستويات'],
    ['reports', 'تقارير الإشراف والأداء'],
    ['messages', 'التواصل'],
  ],
  clerk: [
    ['office', 'المكتب والوثائق'],
    ['enrollment', 'التسجيل والملفات'],
    ['schedules', 'الجداول والطباعة'],
    ['comms', 'التعميمات والصادر'],
    ['messages', 'الرسائل'],
  ],
  admin: [
    ['adminOps', 'لوحة الإدارة'],
    ['content', 'إدارة المحتوى'],
    ['performance', 'إدارة الأداء'],
    ['learningAnalytics', 'متابعة البرامج والدعم'],
    ['smartAssistant', 'المساعد الاجتماعي وبيئة الوكلاء'],
    ['tasks', 'تنفيذ المهام'],
    ['strategy', 'تطوير الاستراتيجية'],
    ['comms', 'التعميمات والتنسيق'],
  ],
  teacher: [
    ['today', 'الرئيسية'],
    ['classes', 'فصولي والمستويات'],
    ['attendance', 'الحضور'],
    ['assignments', 'الواجبات والتقييم'],
    ['teacherReports', 'تقارير المتابعة'],
    ['studentInsights', 'تشخيص ومسارات التعلم'],
    ['teacherComms', 'تقارير ومسودات تواصل'],
    ['activities', 'النوادي والأنشطة الإشعاعية'],
    ['messages', 'التواصل'],
  ],
  parent: [
    ['children', 'ملخص الأبناء'],
    ['child', 'ملف الابن والتقارير'],
    ['childInsights', 'مسار التعلم والتوصيات'],
    ['parentGuidance', 'دعم التعلم والتكامل'],
    ['activities', 'النوادي والأنشطة الإشعاعية'],
    ['calendar', 'التقويم'],
    ['messages', 'الرسائل والتعميمات'],
  ],
  student: [
    ['journey', 'مساري اليوم'],
    ['assignments', 'واجباتي'],
    ['learn', 'المواد الدراسية'],
    ['myPath', 'مساري وتوصياتي'],
    ['activities', 'النوادي والأنشطة الإشعاعية'],
    ['progress', 'إنجازاتي'],
    ['schedule', 'الجدول'],
  ],
};

const institution = {
  name: 'Institut Ryad Al Aqsa / رياض الأقصى',
  group: 'Groupe scolaire AL-AKSA',
  address: 'Hay Ryad II, N° 17, Sidi Allal El Bahraoui, Maroc',
  phones: ['+212 5 37 52 10 23', '+212 5 37 52 10 24'],
  whatsapp: '+212 7 08 23 07 15',
  email: 'ryad@groupescolaireal-aksa.com',
  hours: [
    'الإثنين: 08:00–16:00',
    'الثلاثاء–الخميس: 08:00–18:00',
    'الجمعة: 08:00–13:00',
  ],
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function choosePortal(portal) {
  state.portal = portal;
  state.token = null; state.user = null;
  const isAdmin = portal === 'admin';
  document.getElementById('login-title').textContent = isAdmin ? 'دخول منصة المدير والإدارة' : 'دخول الحساب الخاص';
  document.getElementById('login-subtitle').textContent = isAdmin
    ? 'ولوج آمن عبر الخادم الرئيسي للأقسام الإدارية.'
    : 'ولوج حساب خاص (معلم/ة، ولي أمر، تلميذ). لا تظهر منصة الإدارة هنا.';
  document.getElementById('login-hint').textContent = 'أدخل البريد وكلمة المرور (تجريبي: 1234). عند توفر الخادم سيتم الدخول الآمن وربط البيانات.';
  showScreen('screen-login');
}

async function doLogin() {
  if (!state.portal) { showScreen('screen-portal'); return; }
  const login = document.getElementById('login-id').value.trim();
  const password = document.getElementById('login-pass').value || '1234';
  const hint = document.getElementById('login-hint');
  if (login) {
    const res = await api('/api/auth/login', { method:'POST', body: JSON.stringify({ login, password, portal: state.portal }) });
    if (res.ok && (res.data?.token || res.data?.accessToken)) {
      state.token = res.data.token || res.data.accessToken;
      state.refreshToken = res.data.refreshToken || null;
      state.user = res.data.user;
      const role = res.data.user.role;
      if (roleMeta[role] && roleMeta[role].portal === state.portal) {
        enterRole(role);
        hint.textContent = 'تم تسجيل الدخول وربط الجلسة بالبوابة المناسبة.';
        return;
      }
    } else if (res.status === 0) {
      hint.textContent = 'الخادم غير متاح حاليًا — عرض تجريبي بالأدوار المتاحة لهذه البوابة.';
    } else if (res.status) {
      hint.textContent = 'تعذر تسجيل الدخول بهذه البيانات لهذه البوابة (تحقق من البريد/كلمة المرور).';
    }
  }
  renderRolesForPortal();
  showScreen('screen-roles');
}

function roleButton(role) {
  const m = roleMeta[role];
  const icons = {director:'👔',deputy:'🧑‍💼',supervisor:'🧭',clerk:'🗃️',admin:'🗂️',teacher:'📘',parent:'👨‍👩‍👧',student:'🎒'};
  const desc = {
    director:'إدارة شاملة وصلاحيات كاملة',
    deputy:'متابعة وتنفيذ بصلاحيات مفوضة',
    supervisor:'إشراف تربوي ومتابعة الفصول',
    clerk:'وثائق، ملفات، صادر/وارد',
    admin:'إدارة المحتوى والأداء والمهام والاستراتيجية',
    teacher:'تسيير، تواصل، وتقارير متابعة',
    parent:'متابعة الأبناء ودعم التكامل مع المعلم',
    student:'فضاء تعليمي ومواد دراسية'
  };
  return `<button class="role-btn" onclick="enterRole('${role}')"><span>${icons[role]||'👤'}</span><strong>${m.label}</strong><small>${desc[role]||''}</small></button>`;
}

function renderRolesForPortal() {
  const isAdmin = state.portal === 'admin';
  const roles = isAdmin ? adminRoles : privateRoles;
  document.getElementById('roles-title').textContent = isAdmin ? 'منصة المدير والإدارة (الخادم الرئيسي)' : 'الحسابات الخاصة';
  document.getElementById('roles-subtitle').textContent = isAdmin
    ? 'أقسام خاصة بالإدارة فقط: القيادة، الإشراف، الكتابة، وإدارة المحتوى والأداء والتنفيذ والاستراتيجية.'
    : 'فضاءات خاصة بالمعلمين وأولياء الأمور والتلاميذ. لا يمكن الوصول إلى منصة المدير والإدارة من هنا.';
  document.getElementById('roles-grid').innerHTML = roles.map(roleButton).join('');
}

function showRolesForPortal() {
  renderRolesForPortal();
  showScreen('screen-roles');
}

function enterRole(role) {
  // Enforce portal separation
  if (state.portal && roleMeta[role].portal !== state.portal) return;
  state.role = role;
  state.view = roleMeta[role].home;
  const portalLabel = roleMeta[role].portal === 'admin' ? 'منصة إدارية (خادم رئيسي)' : 'حساب خاص';
  const who = state.user?.name ? `${state.user.name} — ` : '';
  document.getElementById('role-badge').textContent = who + roleMeta[role].label + ' · ' + portalLabel;
  renderNav();
  renderView();
  showScreen('screen-app');
  // Language selector
  const wrap = document.getElementById('lang-selector-wrap');
  if (wrap && typeof langSelectorHtml === 'function') wrap.innerHTML = langSelectorHtml();
}
function renderNav() {
  const nav = document.getElementById('sidebar');
  const logoHtml = '<div style="text-align:center;padding:12px 0 16px;border-bottom:1px solid var(--border);margin-bottom:12px"><img src="logo.svg" alt="رياض الأقصى" style="width:48px;height:48px;border-radius:12px;transition:transform 0.3s" onmouseover="this.style.transform=\'scale(1.1) rotate(5deg)\'" onmouseout="this.style.transform=\'\'" onerror="this.style.display=\'none\'" /></div>';
  nav.innerHTML = logoHtml + navByRole[state.role].map(([key, label]) =>
    `<button class="nav-item ${state.view===key?'active':''}" onclick="setView('${key}')">${label}</button>`
  ).join('');
}
async function setView(view) { state.view = view; renderNav(); await renderView(); }

function kpi(val, lbl) { return `<div class="kpi"><div class="val">${val}</div><div class="lbl">${lbl}</div></div>`; }
function listItem(title, meta, tagHtml='') {
  return `<li><div><strong>${title}</strong><div class="muted" style="font-size:13px">${meta||''}</div></div>${tagHtml}</li>`;
}
function tag(text, cls='info') { return `<span class="tag ${cls}">${text}</span>`; }

const views = {
  // Director
  dashboard: async () => {
    let ov=null, impact=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/overview'), api('/api/admin/impact')]);
      if (r1.ok) ov=r1.data; if (r2.ok) impact=r2.data.impact;
    }
    const due = ov?.reassessmentDue ?? impact?.reassessmentDue?.length ?? 0;
    return `
    <h2>${state.role === 'deputy' ? 'لوحة متابعة نائب المدير' : 'لوحة القيادة الاستراتيجية'}</h2>
    <p class="muted">منصة المدير والإدارة (الخادم الرئيسي) · نظرة شاملة حية عند توفر الجلسة (${new Date().toLocaleDateString('ar-MA')})</p>
    <div class="grid kpis">
      ${kpi(ov?.studentsPresent ?? '—', 'تلاميذ')}
      ${kpi((ov?.attendanceRate ?? 94)+'%', 'مؤشر حضور')}
      ${kpi(ov?.feedbackPending ?? '—', 'بطاقات بانتظار اعتماد')}
      ${kpi(ov?.activeCases ?? '—', 'حالات نشطة')}
    </div>
    <div class="grid kpis">
      ${kpi(due, 'استحقاقات إعادة تقييم')}
      ${kpi(ov?.competencyRefs ?? '—', 'مراجع كفايات')}
      ${kpi(impact?.feedbackCards?.completed ?? '—', 'بطاقات منجزة')}
      ${kpi(ov?.auditCount ?? '—', 'سجلات تدقيق')}
    </div>
    <div class="grid two">
      <div class="panel-card"><h3>أولويات تربوية وتشغيلية</h3><ul class="list">
        ${listItem('اعتماد بطاقات التغذية الراجعة', 'مراجعة بشرية ومتابعة تنفيذ', tag(ov?.feedbackPending?'مطلوب':'مستقر', ov?.feedbackPending?'warn':'ok'))}
        ${listItem('متابعة الحالات واستحقاقات التقييم', `${due} استحقاق/تنبيه`, tag(due?'تنبيه':'مستقر', due?'warn':'ok'))}
        ${listItem('نموذج كفايات وتقييمات إدخال', 'مرجع موحد مرتبط بالتشخيص والمسارات', tag('مفعّل','info'))}
        ${listItem('تواصل أسري محكوم', 'مسودات واعتماد وسجل إرسال', tag('حوكمة','info'))}
      </ul></div>
      <div class="panel-card"><h3>ربط حي بالبيانات</h3><ul class="list">
        ${listItem('المصدر', state.token?'API + جلسة مصادقة':'عرض تجريبي (سجّل الدخول للبيانات الحية)', tag(state.token?'حي':'تجريبي', state.token?'ok':'info'))}
        ${listItem('قياس الأثر', `أنشطة إشعاعية: ${impact?.outreach?.activities ?? '—'} · منشورات: ${impact?.outreach?.publications ?? '—'}`, tag('متابعة','info'))}
        ${listItem('الأمن والحوكمة', 'فصل بوابات، RBAC، تدقيق، تجزئة كلمات مرور، تجديد جلسات', tag('مطبّق تدريجيًا','ok'))}
      </ul><div class="cta-row"><button class="btn primary" onclick="setView('smartAssistant')">المساعد الاجتماعي وبيئة الوكلاء</button><button class="btn secondary" onclick="setView('learningAnalytics')">تحليلات التعلم</button></div></div>
    </div>`; },
  reports: async () => {
    let perf=null, la=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/performance'), api('/api/admin/learning-analytics')]);
      if (r1.ok) perf=r1.data; if (r2.ok) la=r2.data;
    }
    const rows = (perf?.byLevel||levels.map((l,i)=>({level:l, average:(14-i*0.3).toFixed(1), students:'—'})));
    return `
    <h2>التقارير والتحليلات (حي حسب الصلاحية)</h2>
    <div class="panel-card"><p class="muted">ربط بنيوي وإحصائي: مستوى ← فصل ← تلميذ · السنة 2025-2026 ${state.token?'· بيانات حية':''}</p>
    <div class="grid kpis">${kpi(la?.summary?.students ?? '—','تلاميذ ضمن التحليل')}${kpi(la?.summary?.withGaps ?? '—','بحاجة دعم')}${kpi(la?.summary?.gifted ?? '—','مؤشرات تميز')}${kpi(la?.summary?.activeInterventions ?? '—','تدخلات نشطة')}</div>
    <table class="table" style="margin-top:12px"><tr><th>المستوى</th><th>عدد التلاميذ</th><th>متوسط/مؤشر</th></tr>
      ${rows.map(r=>`<tr><td>${esc(r.level)}</td><td>${esc(r.students??'—')}</td><td>${esc(r.average??'—')} ${tag(r.average>=14?'جيد':r.average?'متابعة':'—', r.average>=14?'ok':'warn')}</td></tr>`).join('')}
    </table></div>`; },
  management: async () => {
    let ov=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/overview');
      if (r.ok) ov = r.data;
    }
    return `<h2>إدارة المؤسسة (حي)</h2>
    <div class="grid two">
      <div class="panel-card"><h3>المستخدمون والأدوار</h3><ul class="list">
        ${listItem('المدير', 'صلاحيات كاملة واعتماد نهائي', tag('نشط','ok'))}
        ${listItem('نائب المدير', 'متابعة وتنفيذ بصلاحيات مفوضة', tag('نشط','ok'))}
        ${listItem('المشرف', 'إشراف تربوي ومتابعة الفصول والسلوك', tag('نشط','ok'))}
        ${listItem('الكاتب', 'وثائق، ملفات، صادر/وارد، طباعة', tag('نشط','ok'))}
        ${listItem('المعلمون', (ov?.studentsPresent ? '5+' : '18')+' · تمهيدي → السادس', tag('نشط','ok'))}
        ${listItem('أولياء الأمور', 'متابعة الأبناء', tag('نشط','ok'))}
      </ul></div>
      <div class="panel-card"><h3>الهيكل التعليمي</h3><ul class="list">
        ${listItem('السنة الدراسية', '2025-2026', tag('جارية','info'))}
        ${listItem('المستويات', (ov?.levels?.length||levels.length) + ' مستويات (تمهيدي - السادس)', '')}
        ${listItem('الفصول', (ov?.levels||[]).reduce((s,l)=>s+(l.classes||0),0)||'14'+' فصلاً', '')}
        ${listItem('التلاميذ', ov?.studentsPresent||'—', tag('مسجل','info'))}
      </ul><div class="muted" style="margin-top:8px;font-size:13px">${levels.join('، ')}</div></div>
    </div>`; },
  approvals: async () => {
    let ov=null, comms=[];
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/overview'), api('/api/admin/communications')]);
      if (r1.ok) ov=r1.data; if (r2.ok) comms=r2.data.communications||[];
    }
    const pending = (comms||[]).filter(c=>c.status==='draft'||c.status==='pending');
    const items = pending.length ? pending.map(c=>listItem(esc(c.type||'تواصل'), esc(`${c.channel||''} · ${c.status||''} · ${c.studentId||''}`), tag('بانتظار','warn'))).join('') : `
      ${listItem('إعادة تسجيل - سارة بنعلي', 'الصف 3ب · اليوم', tag('جديد','info'))}
      ${listItem('طلب تحويل فصل - يوسف أمين', 'من 5أ إلى 5ب', tag('مراجعة','warn'))}
      ${listItem('تعميم رحلة مدرسية', 'بانتظار موافقة المدير', tag('معلق','info'))}`;
    return `<h2>الاعتمادات والطلبات (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul>
    <div class="cta-row" style="margin-top:12px">
      <button class="btn primary" onclick="setView('approvals')">تحديث</button>
      <button class="btn secondary" onclick="setView('smartAssistant')">المساعد والوكلاء</button>
    </div></div>`; },
  // Admin
  tasks: async () => {
    let ov=null, alerts=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/overview'), api('/api/admin/alerts')]);
      if (r1.ok) ov=r1.data; if (r2.ok) alerts=r2.data.alerts;
    }
    const due = ov?.reassessmentDue ?? 0;
    const pending = ov?.feedbackPending ?? 0;
    return `<h2>تنفيذ المهام (إدارة تنفيذية) (حي)</h2>
    <div class="grid kpis">${kpi(pending, 'بطاقات بانتظار اعتماد')}${kpi(due, 'استحقاقات مراجعة')}${kpi((alerts||[]).length, 'تنبيهات')}${kpi(ov?.activeCases ?? '—', 'حالات نشطة')}</div>
    <div class="panel-card"><h3>لوحة المهام التشغيلية</h3><ul class="list">
      ${listItem('مراجعة طلبات إعادة التسجيل', '7 طلبات · مسؤول: الكاتب', tag('أولوية','warn'))}
      ${listItem('اعتماد بطاقات التغذية الراجعة', pending + ' بانتظار', tag(pending?'مطلوب':'مستقر', pending?'warn':'ok'))}
      ${listItem('متابعة استحقاقات إعادة التقييم', due + ' استحقاق', tag(due?'تنبيه':'مستقر', due?'warn':'ok'))}
      ${listItem('متابعة تنبيهات', (alerts||[]).length + ' تنبيه', tag((alerts||[]).length?'متابعة':'مستقر', (alerts||[]).length?'warn':'ok'))}
      ${listItem('إعداد تقرير أداء أسبوعي', 'حضور وواجبات ودرجات', tag('اليوم','info'))}
    </ul><div class="cta-row">
      <button class="btn primary" onclick="setView('approvals')">الاعتمادات</button>
      <button class="btn secondary" onclick="setView('smartAssistant')">المساعد والوكلاء</button>
    </div></div>`; },
  enrollment: async () => {
    let ov=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/overview');
      if (r.ok) ov = r.data;
    }
    return `<h2>التسجيل وإعادة التسجيل (حي)</h2>
    <div class="grid kpis">${kpi(ov?.studentsPresent ?? '—','تلاميذ مسجلين')}${kpi((ov?.levels||[]).length ?? 7,'مستويات')}${kpi((ov?.levels||[]).reduce((s,l)=>s+(l.classes||0),0) ?? '—','فصول')}</div>
    <div class="panel-card"><ul class="list">
      ${listItem('سارة بنعلي', 'إعادة تسجيل · الصف 3ب', tag('جديد','info'))}
      ${listItem('آدم المرابط', 'تسجيل جديد · الصف 1أ', tag('مستندات ناقصة','warn'))}
      ${listItem('هدى القاسمي', 'إعادة تسجيل · الصف 4أ', tag('معتمد','ok'))}
    </ul><div class="cta-row"><button class="btn primary">+ تسجيل جديد</button><button class="btn secondary" onclick="setView('management')">إدارة المؤسسة</button></div></div>`; },
  schedules: async () => {
    let events=null;
    if (state.token) {
      const r = await api('/api/calendar/events');
      if (r.ok) events = r.data.events;
    }
    const items = (events||[]).slice(0,5).map(e=>`<tr><td>${esc(e.title)}</td><td>${esc(e.date)}</td><td>${tag(e.type==='academic'?'أكاديمي':'فعالية','info')}</td></tr>`).join('') || `
      <tr><td>1أ</td><td>اليوم</td><td>${tag('منشور','ok')}</td></tr>
      <tr><td>4ب</td><td>أمس</td><td>${tag('منشور','ok')}</td></tr>
      <tr><td>6ج</td><td>اليوم</td><td>${tag('تعارض قاعة','warn')}</td></tr>`;
    return `<h2>الجداول والبرامج (حي)</h2>
    <div class="panel-card"><table class="table"><tr><th>الفعالية</th><th>التاريخ</th><th>النوع</th></tr>${items}</table></div>`; },
  execution: async () => {
    let strat=null, ov=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/strategy'), api('/api/admin/overview')]);
      if (r1.ok) strat=r1.data; if (r2.ok) ov=r2.data;
    }
    const initHtml = (strat?.strategy?.initiatives||[]).map(i=>`<p>${esc(i.title)} <strong>${i.progress}%</strong></p><div class="progress"><span style="width:${i.progress}%"></span></div><br/>`).join('') || `
      <p>إكمال إعادة التسجيل <strong>80%</strong></p><div class="progress"><span style="width:80%"></span></div><br/>
      <p>تنظيم فعاليات تربوية <strong>50%</strong></p><div class="progress"><span style="width:50%"></span></div><br/>
      <p>تحديث التواصل مع الأولياء <strong>65%</strong></p><div class="progress"><span style="width:65%"></span></div>`;
    return `<h2>متابعة التنفيذ (حي)</h2>
    <div class="panel-card"><h3>أهداف الشهر</h3>${initHtml}
    <div class="cta-row" style="margin-top:12px"><button class="btn primary" onclick="setView('strategy')">الاستراتيجية</button><button class="btn secondary" onclick="setView('performance')">الأداء</button></div></div>`; },
  staffing: async () => {
    let ov=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/overview');
      if (r.ok) ov = r.data;
    }
    return `<h2>توزيع المهام والصلاحيات (حي)</h2>
    <p class="muted">منصة الإدارة (الخادم الرئيسي) — فصل تام عن الحسابات الخاصة بعد الولوج.</p>
    <div class="grid two">
      <div class="panel-card"><h3>نائب المدير</h3><ul class="list">
        ${listItem('متابعة سير العمل اليومي', 'نيابة عن المدير عند الغياب', tag('مفوض','info'))}
        ${listItem('اعتماد عمليات تشغيلية', 'ضمن حدود التفويض', tag('اعتماد جزئي','warn'))}
        ${listItem('متابعة تقارير الأداء', 'رفع تقارير للمدير', tag('تنفيذ','ok'))}
      </ul></div>
      <div class="panel-card"><h3>المشرف</h3><ul class="list">
        ${listItem('الإشراف التربوي والسلوكي', 'جميع المستويات (تمهيدي-سادس)', tag('ميداني','info'))}
        ${listItem('متابعة انضباط الحضور', 'تلاميذ ومعلمون', tag('متابعة','ok'))}
        ${listItem('تقارير إشراف دورية', 'رفع ملاحظات للإدارة', tag('تقارير','warn'))}
      </ul></div>
      <div class="panel-card"><h3>الكاتب</h3><ul class="list">
        ${listItem('إدارة الملفات والوثائق', 'تسجيل، أرشفة، طباعة', tag('مكتبي','info'))}
        ${listItem('الصادر والوارد', 'تعميمات، مراسلات، محاضر', tag('تنفيذ','ok'))}
        ${listItem('دعم عمليات التسجيل', 'إدخال بيانات ومتابعة ملفات', tag('تشغيل','ok'))}
      </ul></div>
      <div class="panel-card"><h3>الإدارة (عام)</h3><ul class="list">
        ${listItem('إدارة المحتوى', 'مناهج، موارد، نشر وتحديث', tag('محتوى','info'))}
        ${listItem('إدارة الأداء', 'مؤشرات، تقارير، متابعة', tag('أداء','ok'))}
        ${listItem('تنفيذ المهام', 'خطط تشغيلية ومتابعة إنجاز', tag('تنفيذ','ok'))}
        ${listItem('تطوير الاستراتيجية', 'أهداف، مبادرات، تحسين مستمر', tag('استراتيجية','warn'))}
      </ul></div>
    </div>`; },
  adminOps: async () => {
    let ov=null, impact=null, alerts=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2,r3] = await Promise.all([api('/api/admin/overview'), api('/api/admin/impact'), api('/api/admin/alerts')]);
      if (r1.ok) ov=r1.data; if (r2.ok) impact=r2.data.impact; if (r3.ok) alerts=r3.data.alerts;
    }
    const due = ov?.reassessmentDue ?? impact?.reassessmentDue?.length ?? 0;
    return `
    <h2>لوحة الإدارة التنفيذية (حي)</h2>
    <p class="muted">هدف الإدارة: العمل الفعلي (محتوى، أداء، مهام، استراتيجية) — ربط حي بالبيانات (حسب الصلاحية).</p>
    <div class="grid kpis">${kpi(ov?.studentsPresent ?? '—','تلاميذ')}${kpi(ov?.feedbackPending ?? '—','بطاقات بانتظار اعتماد')}${kpi(ov?.activeCases ?? '—','حالات نشطة')}${kpi(due,'استحقاقات مراجعة')}</div>
    <div class="grid two">
      <div class="panel-card"><h3>أولويات (حسب البيانات)</h3><ul class="list">
        ${listItem('اعتماد بطاقات التغذية الراجعة', (ov?.feedbackPending||0)+' بانتظار مراجعة', tag((ov?.feedbackPending||0)>0?'مطلوب':'مستقر',(ov?.feedbackPending||0)>0?'warn':'ok'))}
        ${listItem('متابعة حالات واستحقاقات', due+' استحقاق/تنبيه', tag(due?'تنبيه':'مستقر',due?'warn':'ok'))}
        ${listItem('قياس الأثر', 'بطاقات منجزة: '+(impact?.feedbackCards?.completed||0), tag('أثر','info'))}
        ${listItem('أنشطة إشعاعية', (impact?.outreach?.activities||0)+' نشاط · '+(impact?.outreach?.publications||0)+' منشور', tag('مجتمع','ok'))}
      </ul></div>
      <div class="panel-card"><h3>إيقاع العمل (حي)</h3><ul class="list">
        ${listItem('يومي', 'حضور، تواصل، معالجة طلبات، حل عوائق', tag('روتين','ok'))}
        ${listItem('أسبوعي', 'تقارير أداء، تحديث محتوى، اجتماع تنسيق', tag('متابعة','ok'))}
        ${listItem('شهري', 'مراجعة مؤشرات وأهداف، تقرير للمدير', tag('تقييم','info'))}
        ${listItem('فصلي', 'تقييم استراتيجية، تطوير مناهج وشراكات', tag('تطوير','warn'))}
      </ul><div class="cta-row">
        <button class="btn primary" onclick="setView('tasks')">المهام</button>
        <button class="btn secondary" onclick="setView('performance')">الأداء</button>
        <button class="btn secondary" onclick="setView('content')">المحتوى</button>
        <button class="btn secondary" onclick="setView('smartAssistant')">المساعد والوكلاء</button>
      </div></div>
    </div>
    ${(alerts||[]).length?`<div class="panel-card" style="margin-top:14px"><h3>تنبيهات (أول 5)</h3><ul class="list">${(alerts||[]).slice(0,5).map(a=>listItem(esc(a.message||a.kind), esc(a.studentId?('تلميذ: '+(a.studentId)):''), tag(a.level==='high'?'عاجل':'تنبيه',a.level==='high'?'danger':'warn'))).join('')}</ul></div>`:''}`; },
  content: async () => {
    let cur=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/curriculum');
      if (r.ok) cur = r.data;
    }
    const items = (cur?.items||[]).slice(0,8);
    const itemsHtml = items.length ? items.map(c=>listItem(esc(c.unit||''), esc(`${c.level||''} · ${c.subject||''} · ${c.status||''}`), tag(c.status==='published'?'منشور':c.status==='draft'?'مسودة':'—', c.status==='published'?'ok':'warn'))).join('') : `
        ${listItem('اللغات الأساسية', subjects.coreLanguages.join('، '), tag('منشور','ok'))}
        ${listItem('لغات اختيارية', subjects.optionalLanguages.join('، '), tag('متاح','info'))}
        ${listItem('مواد أخرى', 'رياضيات، تربية إسلامية، نشاط علمي، ثقافة، تاريخ وجغرافيا', tag('محدث','ok'))}`;
    return `<h2>إدارة المحتوى (حي)</h2>
    <div class="grid two">
      <div class="panel-card"><h3>المناهج والمواد (من الخادم)</h3><ul class="list">${itemsHtml}</ul><p class="muted" style="font-size:13px;margin-top:8px">وحدات: ${(cur?.items||[]).length} · مواد: ${(cur?.subjects||[]).length} · مستويات: ${(cur?.levels||[]).length} · لغات: ar, fr, en, amz</p></div>
      <div class="panel-card"><h3>عمليات المحتوى</h3><ul class="list">
        ${listItem('إنشاء/تحديث درس أو مورد', 'رفع ملفات، فيديو، تمارين', tag('إنشاء/تعديل','info'))}
        ${listItem('مراجعة ونشر', 'اعتماد قبل الظهور للتلاميذ/المعلمين', tag('اعتماد','warn'))}
        ${listItem('أرشفة محتوى', 'تنظيم حسب المستوى والمادة', tag('تنظيم','ok'))}
      </ul><div class="cta-row"><button class="btn primary">+ محتوى جديد</button></div></div>
    </div>`; },
  performance: async () => {
    let perf=null, impact=null;
    if (state.token && state.portal==='admin') { const [r1,r2]=await Promise.all([api('/api/admin/performance'), api('/api/admin/impact')]); if(r1.ok) perf=r1.data; if(r2.ok) impact=r2.data.impact; }
    const rows=(perf?.byLevel||[]).map(r=>listItem(esc(r.level), `متوسط: ${esc(r.average??'—')} · تلاميذ: ${esc(r.students??'—')}`, tag(r.average>=14?'جيد':'متابعة', r.average>=14?'ok':'warn'))).join('') || listItem('بيانات الأداء','سجّل الدخول لعرض مؤشرات حية',tag('تجريبي','info'));
    return `<h2>إدارة الأداء (حي)</h2>
    <div class="grid kpis">${kpi(impact?.feedbackCards?.inProgress ?? '—','بطاقات قيد التنفيذ')}${kpi(impact?.feedbackCards?.completed ?? '—','بطاقات منجزة')}${kpi(impact?.reassessmentDue?.length ?? '—','استحقاقات مراجعة')}</div>
    <div class="panel-card"><h3>الأداء حسب المستوى</h3><ul class="list">${rows}</ul></div>`; },
  strategy: async () => {
    let strat=null, goals=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/strategy');
      if (r.ok) { strat=r.data.strategy; goals=r.data.goals; }
    }
    const goalsHtml = (goals||[]).map(g=>listItem(esc(g.title), `${esc(g.kpi)}: ${g.current}/${g.target} (${g.status})`, tag(g.status==='on_track'?'في المسار':g.status==='at_risk'?'خطر':'قيد', g.status==='on_track'?'ok':g.status==='at_risk'?'danger':'info'))).join('') || `
        ${listItem('تحسين التحصيل الدراسي', '78% / 85%', tag('في المسار','ok'))}
        ${listItem('رفع الانضباط والحضور', '93% / 96%', tag('يحتاج متابعة','warn'))}`;
    const initHtml = (strat?.initiatives||[]).map(i=>listItem(esc(i.title), `تقدم: ${i.progress}% · ${esc(i.owner)}`, tag(i.progress>=60?'جيد':i.progress>=40?'قيد':'بداية', i.progress>=60?'ok':i.progress>=40?'info':'warn'))).join('') || '';
    return `<h2>${state.role === 'admin' ? 'تطوير الاستراتيجية' : 'الاستراتيجية والخطط'} (حي)</h2>
    <div class="grid two">
      <div class="panel-card"><h3>الأهداف الاستراتيجية</h3><ul class="list">${goalsHtml}</ul></div>
      <div class="panel-card"><h3>مبادرات وخطط</h3><ul class="list">${initHtml}${listItem('خطة الفصل الدراسي', 'أهداف، مؤشرات، مسؤوليات', tag('معتمدة','ok'))}${listItem('برنامج دعم + إثراء', 'تشخيص، إعادة تقييم، أنشطة', tag('نشط','info'))}</ul><div class="cta-row"><button class="btn primary">تحديث الخطة</button></div></div>
    </div>
    ${strat?`<div class="panel-card" style="margin-top:14px"><h3>رؤية وركائز</h3><p><strong>الرؤية:</strong> ${esc(strat.vision)}</p><p><strong>الركائز:</strong> ${(strat.pillars||[]).map(esc).join(' · ')}</p></div>`:''}`; },
  learningAnalytics: async () => {
    let la=null, impact=null;
    if (state.token && state.portal==='admin') { const [r1,r2]=await Promise.all([api('/api/admin/learning-analytics'), api('/api/admin/impact')]); if(r1.ok) la=r1.data; if(r2.ok) impact=r2.data.impact; }
    const insights = la?.insights||[];
    const items = insights.map(i=>listItem(esc(i.student?.name||i.id), `${esc(i.classification||'')} · فجوات: ${(i.gaps||[]).map(g=>g.skill).join('، ')||'لا'} · مراجعة: ${esc(i.learningPath?.reassessDate||'-')}`, tag(i.gaps?.length?'دعم':i.talents?.length?'إثراء':'متابعة', i.gaps?.length?'warn':i.talents?.length?'ok':'info'))).join('') || `
        ${listItem('فجوات حرجة (آدم)', 'كسور/قراءة — خطة دعم نشطة', tag('عاجل','danger'))}
        ${listItem('موهبة/تميز (سارة)', 'تفكير منطقي علمي — مسار إثرائي', tag('فرصة','ok'))}
        ${listItem('تنمية مبكرة (ياسين)', 'حس موسيقي — أنشطة فنية', tag('متابعة','info'))}`;
    return `<h2>تحليلات التعلم، المواهب، والفجوات (حي)</h2>
    <p class="muted">تقييم إدخال ← كفايات مرجعية ← تغذية راجعة/بطاقات ← مسار ← إعادة تقييم، مع تنبيهات استحقاق وقياس أثر.</p>
    <div class="grid kpis">${kpi(la?.summary?.students ?? insights.length ?? 3,'تلاميذ')}${kpi(la?.summary?.withGaps ?? 1,'بحاجة دعم')}${kpi(la?.summary?.gifted ?? 1,'مؤشرات تميز')}${kpi(impact?.reassessmentDue?.length ?? 0,'استحقاقات إعادة تقييم')}</div>
    <div class="grid two">
      <div class="panel-card"><h3>تصنيف ورؤى فردية (ضمن الصلاحية)</h3><ul class="list">${items}</ul></div>
      <div class="panel-card"><h3>قياس أثر وربط</h3><ul class="list">
        ${listItem('بطاقات التغذية الراجعة', `منجزة: ${impact?.feedbackCards?.completed||0} · قيد التنفيذ: ${impact?.feedbackCards?.inProgress||0}`, tag('أثر','info'))}
        ${listItem('أنشطة إشعاعية ومنشورات', `${impact?.outreach?.activities||0} نشاط · ${impact?.outreach?.publications||0} منشور`, tag('مجتمع','ok'))}
        ${listItem('نموذج كفايات شامل', 'مراجع لكل المستويات والمواد مرتبطة بتقييمات الإدخال', tag('معياري','ok'))}
        ${listItem('تنبيهات استحقاق', `${impact?.reassessmentDue?.length||0} عنصر يحتاج مراجعة/إعادة تقييم`, tag(impact?.reassessmentDue?.length?'تنبيه':'مستقر', impact?.reassessmentDue?.length?'warn':'ok'))}
      </ul></div>
    </div>`; },
  smartAssistant: async () => {
    const fallback = {
      stats: { activeCases: 2, feedbackCards: 2, evidenceCount: 5, gaps: 2, talents: 2 },
      agentProfiles: [
        {id:'pedagogy_agent',name:'وكيل بيداغوجي (كفايات وتفريق تعليم)',domain:'بيداغوجي'},
        {id:'social_agent',name:'وكيل اجتماعي-تربوي (سياق وتواصل)',domain:'اجتماعي'},
        {id:'psych_support_agent',name:'وكيل مساندة نفسية-تربوية (مؤشرات)',domain:'نفسي-تربوي'},
        {id:'talent_agent',name:'وكيل مواهب وإثراء',domain:'مواهب/أنشطة'},
        {id:'curriculum_agent',name:'وكيل مناهج ومجالات معرفية',domain:'معرفي'}
      ],
      cases: [
        {id:'case_adam',studentId:'s_adam',status:'active',focus:'سد فجوات القراءة والكسور مع دعم أسري',nextReview:'2026-11-30',timeline:[{term:'الفصل 1',date:'2026-11-10',event:'فتح حالة وملاحظة أولية'},{term:'الفصل 1',date:'2026-11-17',event:'تنبيه فجوات + خطة دعم + تواصل أسري'}]},
        {id:'case_sara',studentId:'s_sara',status:'active',focus:'إثراء علمي مع دعم لغوي مستهدف',nextReview:'2026-12-05',timeline:[{term:'الفصل 1',date:'2026-11-12',event:'رصد مؤشرات تميز واهتمام علمي'},{term:'الفصل 1',date:'2026-11-17',event:'مسار إثراء + ترشيح أنشطة إشعاعية'}]}
      ],
      feedbackCards: [
        {id:'fc1',studentId:'s_adam',summary:'فجوات في الكسور والقراءة تستدعي دعمًا مبكرًا',priority:'high',status:'proposed',nextReview:'2026-11-30',evidenceIds:['ev1','ev2'],recommendations:['تمارين تدريجية يومية 15-20 دقيقة','دعم مجموعات صغيرة داخل القسم','متابعة أسبوعية وتواصل مع الأسرة'],reviewNotes:'',history:[]},
        {id:'fc2',studentId:'s_sara',summary:'تميز علمي مع حاجة لدعم التعبير الشفهي بالفرنسية',priority:'medium',status:'proposed',nextReview:'2026-12-05',evidenceIds:['ev4','ev5'],recommendations:['تحدي رياضيات أسبوعي ومشروع Arduino مبسط','تمارين تعبير شفهي فرنسي قصيرة'],reviewNotes:'',history:[]}
      ],
      library: [{title:'الدعم المبكر للفجوات القرائية'},{title:'تفريق التعليم والانضباط الإيجابي'},{title:'تنمية المواهب والتغذية الراجعة'}],
      _demo: true
    };
    let data = fallback, impact=null, alertsData=null, comms=null;
    if (state.token && state.portal === 'admin') {
      const [r1,r2,r3,r4] = await Promise.all([api('/api/admin/smart-assistant'), api('/api/admin/impact'), api('/api/admin/alerts'), api('/api/admin/communications')]);
      if (r1.ok && r1.data) data = { ...fallback, ...r1.data, _demo:false };
      if (r2.ok) impact = r2.data.impact; if (r3.ok) alertsData = r3.data.alerts; if (r4.ok) comms = r4.data.communications;
    }
    const students = { s_adam:'آدم المرابط', s_sara:'سارة بنعلي', s_yassine:'ياسين بنعلي' };
    const pTag = p => p==='high'?tag('أولوية عالية','danger'):p==='medium'?tag('متوسطة','warn'):tag('عادية','info');
    const sTag = s => s==='approved'?tag('معتمدة','ok'):s==='rejected'?tag('مرفوضة','danger'):s==='in_progress'?tag('قيد التنفيذ','warn'):s==='completed'?tag('منجزة','ok'):tag('مقترحة','info');
    const canAct = state.token && state.portal === 'admin';
    const selectedCard = (data.feedbackCards||[]).find(c=>c.id===state.selected.cardId) || null;
    const selectedCase = (data.cases||[]).find(c=>c.id===state.selected.caseId) || null;
    const cardsHtml = (data.feedbackCards||[]).map(c=>`
      <li style="cursor:pointer;${state.selected.cardId===c.id?'background:#F0FAE8;border-radius:10px;padding:8px':''}" onclick="selectFeedbackCard('${c.id}')">
        <div>
          <strong>${esc(students[c.studentId]||c.studentId)} — ${esc(c.summary||'')}</strong>
          <div class="muted" style="font-size:13px">أدلة: ${(c.evidenceIds||[]).join(', ')} · مراجعة: ${esc(c.nextReview||'-')} · الحالة: ${fmtStatus(c.status)}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          ${pTag(c.priority)} ${sTag(c.status)}
        </div>
      </li>`).join('') || '<li><div class="muted">لا توجد بطاقات حالياً.</div></li>';
    const casesHtml = (data.cases||[]).map(cs=>{
      const last = (cs.timeline||[]).slice(-1)[0];
      return `<li style="cursor:pointer;${state.selected.caseId===cs.id?'background:#F0FAE8;border-radius:10px;padding:8px':''}" onclick="selectCase('${cs.id}')"><div><strong>${esc(students[cs.studentId]||cs.studentId)} — ${fmtStatus(cs.status)}</strong><div class="muted" style="font-size:13px">${esc(cs.focus||'')} · آخر حدث: ${esc(last?.event||'-')} (${esc(last?.date||'-')}) · متابعة: ${esc(cs.nextReview||'-')}</div></div>${tag('حالة','info')}</li>`;
    }).join('') || '<li><div class="muted">لا توجد حالات.</div></li>';
    const detailCard = selectedCard ? `
      <div class="panel-card" style="margin-top:14px;border:2px solid #58CC02"><h3>إدارة تفصيلية: بطاقة التغذية الراجعة (${esc(selectedCard.id)})</h3>
        <p><strong>التلميذ:</strong> ${esc(students[selectedCard.studentId]||selectedCard.studentId)} · <strong>الحالة:</strong> ${fmtStatus(selectedCard.status)} · <strong>الأولوية:</strong> ${esc(selectedCard.priority)} · <strong>مراجعة:</strong> ${esc(selectedCard.nextReview||'-')}</p>
        <p><strong>الملخص:</strong> ${esc(selectedCard.summary||'')}</p>
        <p><strong>التوصيات:</strong> ${(selectedCard.recommendations||[]).map(esc).join('؛ ')||'-'}</p>
        <p><strong>الأدلة:</strong> ${(selectedCard.evidenceIds||[]).join(', ')||'-'} · <strong>ملاحظات مراجعة:</strong> ${esc(selectedCard.reviewNotes||'-')}</p>
        <div class="cta-row">${canAct?`<button class="btn primary" style="padding:8px 12px" onclick="updateFeedbackCard('${selectedCard.id}','approved')">اعتماد</button>
          <button class="btn secondary" style="padding:8px 12px" onclick="updateFeedbackCard('${selectedCard.id}','in_progress')">قيد التنفيذ</button>
          <button class="btn secondary" style="padding:8px 12px" onclick="updateFeedbackCard('${selectedCard.id}','completed')">منجزة</button>
          <button class="btn secondary" style="padding:8px 12px" onclick="updateFeedbackCard('${selectedCard.id}','rejected')">رفض</button>
          <button class="btn secondary" style="padding:8px 12px" onclick="editFeedbackNote('${selectedCard.id}')">إضافة/تعديل ملاحظة</button>`:'<span class="muted">سجّل الدخول بصلاحية للتعديل والاعتماد.</span>'}</div>
        <div style="margin-top:10px"><strong>سجل التغييرات:</strong><ul class="list">${(selectedCard.history||[]).slice(-5).reverse().map(h=>`<li><div class="muted" style="font-size:13px">${esc(h.at||'')} · ${esc(h.by||'')} · ${esc(h.action||'')} — ${esc(h.note||'')}</div></li>`).join('') || '<li><div class="muted">لا سجل بعد.</div></li>'}</ul></div>
      </div>` : '';
    const detailCase = selectedCase ? `
      <div class="panel-card" style="margin-top:14px;border:2px solid #1CB0F6"><h3>إدارة تفصيلية: الحالة (${esc(selectedCase.id)})</h3>
        <p><strong>التلميذ:</strong> ${esc(students[selectedCase.studentId]||selectedCase.studentId)} · <strong>الحالة:</strong> ${fmtStatus(selectedCase.status)} · <strong>التركيز:</strong> ${esc(selectedCase.focus||'')} · <strong>مراجعة قادمة:</strong> ${esc(selectedCase.nextReview||'-')}</p>
        <div class="cta-row">${canAct?`<button class="btn secondary" style="padding:8px 12px" onclick="addCaseTimeline('${selectedCase.id}')">+ إضافة حدث زمني</button>`:''}</div>
        <div style="margin-top:10px"><strong>الخط الزمني (عبر الفصول/السنة):</strong><ul class="list">${(selectedCase.timeline||[]).slice().reverse().map(e=>`<li><div><strong>${esc(e.date||'')} ${e.term?('· '+esc(e.term)) : ''}</strong><div class="muted" style="font-size:13px">${esc(e.event||'')} ${e.by?('— '+esc(e.by)) : ''}</div></div></li>`).join('')}</ul></div>
      </div>` : '';
    const agentsHtml = (data.agentProfiles||[]).map(a=>listItem(esc(a.name), esc(a.domain||a.level||''), tag('نشط','ok'))).join('');
    const libHtml = (data.library||[]).slice(0,5).map(l=>listItem(esc(l.title), esc([l.type,l.topic].filter(Boolean).join(' · ')||'مورد علمي/بيداغوجي'), tag('مورد','info'))).join('');
    const dueCount = impact?.reassessmentDue?.length ?? 0;
    const alertsList = (alertsData||[]).slice(0,6);
    const alertsHtml = alertsList.map(a=>listItem(esc(a.message||a.kind), esc(a.studentId?('تلميذ: '+(students[a.studentId]||a.studentId)):(a.date||'')), tag(a.level==='high'?'عاجل':'تنبيه', a.level==='high'?'danger':'warn'))).join('') || '<li><div class="muted">لا تنبيهات استحقاق حالية.</div></li>';
    const commsHtml = (comms||[]).slice(0,4).map(c=>listItem(esc(c.type||'تواصل'), esc(`${students[c.studentId]||c.studentId||''} · ${c.channel||''} · ${c.status||''} ${c.governance?.approvedBy?'· معتمد':''}`), tag(c.status==='sent'?'مرسل':c.status==='approved'?'معتمد':'مسودة', c.status==='sent'?'ok':c.status==='approved'?'info':'warn'))).join('') || '<li><div class="muted">سجل تواصل (مسودات/اعتماد/إرسال) يظهر عند توفر بيانات.</div></li>';
    const demoNote = data._demo ? '<p class="muted" style="margin-top:8px">عرض تجريبي محلي. سجّل الدخول من بوابة الإدارة (director@ryad.ma / 1234) للبيانات الحية، الاعتماد، الخط الزمني، والتنبيهات والتواصل المحكوم.</p>' : '<p class="muted" style="margin-top:8px">بيانات حية مرتبطة بالجلسة مع تدقيق، تنبيهات استحقاق إعادة التقييم، وتتبع أثر وتواصل ضمن الحوكمة.</p>';
    return `
      <h2>المساعد الاجتماعي وبيئة الوكلاء</h2>
      <p class="muted">متابعة حالة بحالة عبر الفصول والسنة مع وكلاء متخصصين مساعدين، بطاقات تغذية راجعة، أدلة، وقرار بشري. (انقر على بطاقة/حالة للإدارة التفصيلية)</p>
      <div class="grid kpis">${kpi(data.stats?.activeCases ?? 2,'حالات نشطة')}${kpi(data.stats?.feedbackCards ?? (data.feedbackCards||[]).length,'بطاقات تغذية راجعة')}${kpi(data.stats?.evidenceCount ?? 0,'سجلات أدلة')}${kpi(dueCount,'استحقاقات إعادة تقييم')}</div>
      <div class="grid two">
        <div class="panel-card"><h3>متابعة حالات (حالة بحالة)</h3><ul class="list">${casesHtml}</ul></div>
        <div class="panel-card"><h3>بطاقات التغذية الراجعة (دورة حياة)</h3><ul class="list">${cardsHtml}</ul></div>
      </div>
      ${detailCase}${detailCard}
      <div class="grid two" style="margin-top:14px">
        <div class="panel-card"><h3>تنبيهات استحقاق إعادة التقييم والتدخل</h3><ul class="list">${alertsHtml}</ul></div>
        <div class="panel-card"><h3>تواصل أسري تنفيذي (حوكمة واعتماد)</h3><ul class="list">${commsHtml}</ul><p class="muted" style="font-size:13px">مسودات → مراجعة/اعتماد → إرسال مع سجل وموافقة/خصوصية حسب السياسة.</p></div>
      </div>
      <div class="grid two" style="margin-top:14px">
        <div class="panel-card"><h3>وكلاء متخصصون وقياس الأثر</h3><ul class="list">${agentsHtml}${impact?listItem('أثر البطاقات',`منجزة: ${impact.feedbackCards?.completed||0} / قيد التنفيذ: ${impact.feedbackCards?.inProgress||0}`,tag('قياس','info')):''}</ul></div>
        <div class="panel-card"><h3>المكتبة ونموذج الكفايات المرجعي</h3><ul class="list">${libHtml || listItem('مكتبة علمية','موارد بيداغوجية ونفس-اجتماعية',tag('موارد','info'))}${listItem('مرجع كفايات شامل', 'مرجع حسب جميع المستويات والمواد (مرتبط بتقييمات الإدخال)', tag('معياري','ok'))}</ul></div>
      </div>${demoNote}`;
  },
  supervision: async () => {
    let la=null, alerts=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/learning-analytics'), api('/api/admin/alerts')]);
      if (r1.ok) la=r1.data; if (r2.ok) alerts=r2.data.alerts;
    }
    const levelsHtml = levels.map((l,i)=>listItem(l, i===0?'متابعة أنشطة وتمهيد':'متابعة دروس وسلوك', i%3===0?tag('زيارة مجدولة','info'):tag('مستقر','ok'))).join('');
    return `<h2>الإشراف التربوي (حي)</h2>
    <div class="grid kpis">${kpi(la?.summary?.students ?? 21,'تلاميذ تحت المتابعة')}${kpi(la?.summary?.withGaps ?? '—','بحاجة دعم')}${kpi((alerts||[]).length,'تنبيهات/استحقاقات')}${kpi(la?.summary?.activeInterventions ?? '—','تدخلات نشطة')}</div>
    <div class="grid two">
      <div class="panel-card"><h3>متابعة المستويات (تمهيدي - السادس)</h3><ul class="list">${levelsHtml}</ul></div>
      <div class="panel-card"><h3>تنبيهات واستحقاقات (أول 8)</h3><ul class="list">${(alerts||[]).slice(0,8).map(a=>listItem(esc(a.message||a.kind), esc(a.studentId?('تلميذ: '+a.studentId):''), tag(a.level==='high'?'عاجل':'تنبيه',a.level==='high'?'danger':'warn'))).join('') || '<li><div class="muted">لا تنبيهات.</div></li>'}</ul></div>
    </div>`; },
  office: async () => {
    let ov=null;
    if (state.token && state.portal==='admin') {
      const r = await api('/api/admin/overview');
      if (r.ok) ov = r.data;
    }
    return `<h2>المكتب والوثائق (حي)</h2>
    <div class="grid two">
      <div class="panel-card"><h3>الصادر والوارد</h3><ul class="list">
        ${listItem('تعميم اجتماع الأولياء', 'مرسل لجميع الأولياء · أمس', tag('مرسل','ok'))}
        ${listItem('طلب ملف تسجيل', 'وارد · ولي أمر', tag('قيد المعالجة','warn'))}
        ${listItem('محضر اجتماع إداري', 'أرشفة', tag('مكتمل','ok'))}
      </ul><div class="cta-row"><button class="btn primary">+ تسجيل وثيقة</button></div></div>
      <div class="panel-card"><h3>ملفات التلاميذ</h3><ul class="list">
        ${listItem('ملفات التمهيدي', 'مكتملة 95%', tag('جيد','ok'))}
        ${listItem('ملفات السادس ابتدائي', 'تحديث شهادات', tag('متابعة','warn'))}
        ${listItem('طلبات طباعة', '4 طلبات', tag('قيد التنفيذ','info'))}
        ${listItem('تلاميذ مسجلين', ov?.studentsPresent ?? '—', tag('بيانات','info'))}
      </ul></div>
    </div>`; },
  // Teacher
  today: async () => {
    let insights=null, alerts=null;
    if (state.token && state.role==='teacher') {
      const [r1,r2] = await Promise.all([api('/api/teacher/student-insights?studentId=s_sara'), api('/api/teacher/alerts')]);
      if (r1.ok) insights=r1.data.insights; if (r2.ok) alerts=r2.data.alerts;
    }
    return `<h2>مرحبًا، ${esc(state.user?.name||'أستاذة مريم')}</h2>
    <p class="muted">فضاء خاص للمعلم/ة: تسيير، تواصل، ومتابعة التلاميذ (تمهيدي - السادس) — ${state.token?'بيانات حية':''}</p>
    <div class="grid two">
      <div class="panel-card"><h3>حصص اليوم</h3><ul class="list">
        ${listItem('08:30 - رياضيات', 'الرابع ابتدائي (أ) · قاعة 2', tag('التالي','info'))}
        ${listItem('10:15 - اللغة الفرنسية', 'الثاني ابتدائي (ب) · قاعة 1', '')}
        ${listItem('14:00 - دعم تربوي', 'تمهيدي · مجموعة أ', '')}
      </ul></div>
      <div class="panel-card"><h3>أدوات التسيير والتواصل</h3>
        <div class="cta-row">
          <button class="btn primary" onclick="setView('attendance')">رصد الحضور</button>
          <button class="btn secondary" onclick="setView('assignments')">تصحيح واجب</button>
          <button class="btn secondary" onclick="setView('messages')">رسالة لولي/تلميذ</button>
          <button class="btn secondary" onclick="setView('teacherReports')">تقارير التقدم</button>
        </div>
        <ul class="list" style="margin-top:10px">
          ${listItem('تنبيهات/استحقاقات', (alerts||[]).length+' عنصر', tag((alerts||[]).length?'تنبيه':'مستقر',(alerts||[]).length?'warn':'ok'))}
          ${listItem('تصنيف (سارة)', esc(insights?.classification||'—'), tag(insights?.gaps?.length?'دعم':'إثراء', insights?.gaps?.length?'warn':'ok'))}
        </ul>
      </div>
    </div>`; },
  classes: async () => {
    let cls=[];
    if (state.token && state.role==='teacher') {
      const r = await api('/api/teacher/classes');
      if (r.ok) cls = r.data.classes||[];
    }
    const cards = cls.length ? cls.map(c=>`<div class="panel-card"><h3>${esc(c.name)} (${esc(c.level)})</h3><p class="muted">${(c.students||[]).length} تلميذًا</p><ul class="list">
      ${listItem('تلاميذ', (c.students||[]).slice(0,4).map(s=>esc(s.name)).join('، ')||'—', tag('فصل','info'))}
    </ul></div>`).join('') : `<div class="panel-card"><h3>تمهيدي (أ)</h3><p class="muted">22 تلميذًا · أنشطة تربوية</p><ul class="list">${listItem('الحضور اليوم','95%',tag('جيد','ok'))}</ul></div>
      <div class="panel-card"><h3>الرابع ابتدائي (أ)</h3><p class="muted">28 تلميذًا · رياضيات</p><ul class="list">${listItem('متوسط التقدم','82%',tag('جيد','ok'))}</ul></div>`;
    return `<h2>فصولي والمستويات (حي)</h2><p class="muted">المستويات المتاحة: ${levels.join(' · ')}</p><div class="grid two">${cards}</div>`; },
  attendance: async () => {
    let report=null;
    if (state.token && state.role==='teacher') {
      const r = await api('/api/teacher/student-report?studentId=s_sara');
      if (r.ok) report = r.data.report;
    }
    const att = report?.attendance || { total:4, present:3, rate:75 };
    return `<h2>رصد الحضور - الصف 4أ</h2>
    <div class="panel-card"><p class="muted">حضور: ${att.present}/${att.total} (${att.rate}%)</p>
    <table class="table"><tr><th>التلميذ</th><th>الحالة</th></tr>
      <tr><td>يوسف أمين</td><td>${tag('حاضر','ok')}</td></tr>
      <tr><td>سارة بنعلي</td><td>${tag('حاضر','ok')}</td></tr>
      <tr><td>آدم المرابط</td><td>${tag('متأخر','warn')}</td></tr>
      <tr><td>هدى القاسمي</td><td>${tag('غائب','danger')}</td></tr>
    </table><div class="cta-row"><button class="btn primary">حفظ وإرسال</button></div></div>`; },
  assignments: async () => {
    let reps=[];
    if (state.token && state.role==='teacher') {
      const r = await api('/api/teacher/student-report?studentId=s_sara');
      if (r.ok) reps = r.data.report?.assignments||[];
    }
    const items = reps.length ? reps.map(a=>listItem(esc(a.title), esc(`${a.subject||''} · ${a.dueDate||''} · ${a.status||''} ${a.grade?'· '+a.grade+'/'+a.scale:''}`), tag(a.status==='submitted'?'تم التسليم':a.status==='pending'?'معلق':'غير مسلم', a.status==='submitted'?'ok':a.status==='pending'?'warn':'info'))).join('') : `
      ${listItem('واجب الكسور', 'الرابع ابتدائي (أ) · الاستحقاق: اليوم', tag('12 تسليم','warn'))}
      ${listItem('تمرين قراءة', 'الثاني ابتدائي (ب) · الاستحقاق: غدًا', tag('منشور','info'))}
      ${listItem('نشاط علمي', 'تمهيدي · مصحح', tag('مكتمل','ok'))}`;
    return `<h2>الواجبات والتقييم (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul><div class="cta-row"><button class="btn primary">+ إنشاء واجب</button><button class="btn secondary" onclick="setView('teacherReports')">عرض أثر على التقدم</button></div></div>`; },
  teacherReports: async () => {
    let reps=[];
    if (state.token && state.role==='teacher') {
      const ids=['s_sara','s_adam'];
      const rs = await Promise.all(ids.map(id=>api(`/api/teacher/student-report?studentId=${id}`)));
      reps = rs.map((r,i)=>r.ok?{id:ids[i],...r.data.report}:null).filter(Boolean);
    }
    const cards = reps.length ? reps.map(r=>`<div class="panel-card"><h3>${esc(r.student?.name||'')}</h3><ul class="list">
      ${listItem('المستوى/الفصل', `${esc(r.level||'')} · ${esc(r.class||'')}`, '')}
      ${listItem('الحضور', `${r.attendance?.rate??'-'}%`, tag((r.attendance?.rate??0)>=95?'جيد':'متابعة',(r.attendance?.rate??0)>=95?'ok':'warn'))}
      ${listItem('المتوسط', esc(r.average??'-'), tag((Number(r.average)||0)>=14?'جيد':'متابعة',(Number(r.average)||0)>=14?'ok':'warn'))}
      ${listItem('إرشادات', (r.guidance||[]).join(' · ')||'-', tag('توصية','info'))}
    </ul></div>`).join('') : `<div class="panel-card"><h3>ملخص التقدم (تجريبي)</h3><ul class="list">
        ${listItem('تمهيدي (أ)', 'تقدم المهارات: 84%', tag('جيد','ok'))}
        ${listItem('الرابع ابتدائي (أ)', 'متوسط الرياضيات: 14.2/20', tag('جيد','ok'))}
        ${listItem('السادس ابتدائي (ب)', 'بحاجة دعم في الفرنسية', tag('متابعة','warn'))}
      </ul></div><div class="panel-card"><h3>توصيات قابلة للمشاركة</h3><ul class="list">${listItem('خطة دعم أسبوعية','3 تلاميذ في الرابع ابتدائي',tag('إجراء','info'))}${listItem('تنسيق مع ولي الأمر','متابعة واجبات المنزل',tag('تواصل','warn'))}</ul></div>`;
    return `<h2>تقارير متابعة التلاميذ (حي حسب النطاق)</h2><p class="muted">تقارير مبنية من الحضور والواجبات والدرجات مع مراعاة نطاق المعلم والخصوصية.</p><div class="grid two">${cards}</div><div class="cta-row"><button class="btn primary" onclick="setView('studentInsights')">تشخيص ومسارات وبطاقات</button></div>`;
  },
  studentInsights: async () => {
    let insights=[]; let cards=[];
    if (state.token && state.role==='teacher') {
      const ids=['s_sara','s_adam'];
      const rs = await Promise.all(ids.map(id=>api(`/api/teacher/student-insights?studentId=${id}`)));
      insights = rs.map((r,i)=>r.ok?{id:ids[i],...r.data.insights}:null).filter(Boolean);
      const cr = await api('/api/teacher/feedback-cards'); if (cr.ok) cards = cr.data.feedbackCards||[];
    }
    const cardFor = sid => (cards||[]).filter(c=>c.studentId===sid);
    const blocks = insights.length ? insights.map(i=>{
      const c = cardFor(i.student?.id||i.id)[0];
      return `<div class="panel-card"><h3>${esc(i.student?.name||'')} (${esc(i.level||'')})</h3><ul class="list">
        ${listItem('التصنيف', esc(i.classification||'-'), tag(i.gaps?.length?'دعم':i.talents?.length?'موهبة':'متابعة', i.gaps?.length?'danger':i.talents?.length?'ok':'info'))}
        ${listItem('فجوات', (i.gaps||[]).map(g=>`${g.skill} (${Math.round((g.mastery||0)*100)}%)`).join('، ')||'لا فجوات حرجة', tag(i.gaps?.length?'تنبيه':'مستقر', i.gaps?.length?'warn':'ok'))}
        ${listItem('نقاط قوة/مواهب', (i.strengths||[]).map(s=>s.skill).concat((i.talents||[]).map(t=>t.domain)).join('، ')||'-', tag('قوة','ok'))}
        ${listItem('مسار وإعادة تقييم', `${esc(i.learningPath?.focus||'-')} · ${esc(i.learningPath?.reassessDate||'-')}`, tag('خطة','info'))}
        ${listItem('بطاقة تغذية راجعة', c?`${esc(c.summary)} — ${fmtStatus(c.status)}`:'لا بطاقة', c?tag(fmtStatus(c.status), c.status==='approved'?'ok':'info'):tag('—','info'))}
        ${listItem('كفايات مرجعية', `${(i.competencies||[]).length} كفايات مرتبطة بمرجع المستوى`, tag('معياري','info'))}
      </ul></div>`; }).join('') : `<div class="panel-card"><h3>سارة بنعلي (الرابع ابتدائي)</h3><ul class="list">
        ${listItem('التصنيف', 'موهوب/متميز مع مسار إثرائي', tag('موهبة','ok'))}
        ${listItem('قوة', 'رياضيات/نشاط علمي (تفكير منطقي)', tag('قوة','ok'))}
        ${listItem('دعم', 'تعبير شفهي فرنسي 60%', tag('متابعة','warn'))}
        ${listItem('إعادة تقييم', '2026-12-05', tag('مجدول','info'))}
      </ul></div>
      <div class="panel-card"><h3>آدم المرابط (الرابع ابتدائي)</h3><ul class="list">
        ${listItem('التصنيف', 'يحتاج دعم/سد فجوات', tag('دعم','danger'))}
        ${listItem('فجوات', 'كسور 38%، قراءة وفهم 45%', tag('تنبيه','danger'))}
        ${listItem('إعادة تقييم', '2026-11-30', tag('قريب','warn'))}
      </ul></div>`;
    const canAct = state.token && state.role==='teacher';
    return `<h2>تشخيص، تغذية راجعة، ومسارات التعلم (حي)</h2>
    <p class="muted">تقييم إدخال وكفايات مرجعية ← تغذية راجعة وبطاقات ← مسار/أنشطة ← إعادة تقييم وتنبيهات (ضمن نطاق المعلم).</p>
    <div class="grid two">${blocks}</div>
    <div class="panel-card" style="margin-top:14px"><h3>إدارة تفصيلية للبطاقات والحالات (ضمن النطاق)</h3>
      <p class="muted">يمكن اعتماد/تحديث بطاقات التغذية الراجعة وإضافة أحداث للحالات عبر الواجهة الإدارية أو عبر مسارات المعلم عند الصلاحية.</p>
      ${canAct && cards.length ? `<ul class="list">${cards.map(c=>`<li><div><strong>${esc(c.id)}</strong><div class="muted" style="font-size:13px">${esc(c.summary)} · ${fmtStatus(c.status)}</div></div><div class="cta-row">${c.status!=='approved'?`<button class="btn secondary" style="padding:4px 8px;font-size:12px" onclick="updateFeedbackCard('${c.id}','approved')">اعتماد</button>`:''}${c.status!=='in_progress'?`<button class="btn secondary" style="padding:4px 8px;font-size:12px" onclick="updateFeedbackCard('${c.id}','in_progress')">تنفيذ</button>`:''}</div></li>`).join('')}</ul>` : '<p class="muted">سجّل الدخول كمعلم لعرض وإدارة بطاقات النطاق.</p>'}
    </div>`;
  },
  teacherComms: async () => {
    let drafts=[], comms=[];
    if (state.token && state.role==='teacher') {
      const [r1,r2] = await Promise.all([api('/api/teacher/drafts'), api('/api/teacher/communications')]);
      if (r1.ok) drafts=r1.data.drafts||[]; if (r2.ok) comms=r2.data.communications||[];
    }
    const draftsHtml = (drafts||[]).map(d=>`<div class="panel-card"><h3>${esc(d.subject||d.type)}</h3><p style="white-space:pre-wrap;line-height:1.7;background:#F7F7F5;padding:12px;border-radius:12px;font-size:14px">${esc(d.body||'')}</p><div class="cta-row"><button class="btn secondary" style="padding:6px 10px;font-size:13px" onclick="setView('teacherReports')">تقارير</button></div></div>`).join('') || '<div class="panel-card"><h3>مسودات (تجريبية)</h3><p class="muted">مسودات تواصل مع الأسر/الإدارة (معتمدة/مرسلة) تظهر عند توفر بيانات.</p></div>';
    const commsHtml = (comms||[]).map(c=>listItem(esc(c.type||'تواصل'), esc(`${c.channel||''} · ${c.status||''} ${c.governance?.approvedBy?'· معتمد':''}`), tag(c.status==='sent'?'مرسل':c.status==='approved'?'معتمد':'مسودة', c.status==='sent'?'ok':c.status==='approved'?'info':'warn'))).join('') || '<li><div class="muted">سجل تواصل (مسودات/اعتماد/إرسال) يظهر عند توفر بيانات.</div></li>';
    return `<h2>تقارير ومسودات تواصل (ملخص وموسّع)</h2>
    <p class="muted">تقارير قابلة للمشاركة مع الأسر/الإدارة ومسودات تواصل مدعومة بالتحليل — مع مراجعة واعتماد المعلم قبل الإرسال (حوكمة).</p>
    <div class="grid two">
      <div class="panel-card"><h3>مسودات (${drafts.length})</h3><div class="grid">${draftsHtml}</div></div>
      <div class="panel-card"><h3>سجل تواصل (حوكمة)</h3><ul class="list">${commsHtml}</ul><p class="muted" style="font-size:13px;margin-top:8px">مسودة → اعتماد → إرسال (مع تسجيل تدقيق).</p></div>
    </div>`; },
  // Parent
  children: async () => {
    let kids=[];
    if (state.token && state.role==='parent') {
      const r = await api('/api/parent/children');
      if (r.ok) kids = r.data.children||[];
    }
    const html = kids.length ? kids.map(k=>`<div class="panel-card"><h3>${esc(k.name)}</h3><p class="muted">${esc(k.level||'')} · ${esc(k.class||'')}</p><ul class="list">
      ${listItem('ملف الابن', 'عرض التقرير والرؤى', tag('متاح','info'))}
    </ul><div class="cta-row"><button class="btn secondary" onclick="setView('child')">عرض التقرير</button><button class="btn secondary" onclick="setView('childInsights')">مسار التعلم</button></div></div>`).join('') : `<div class="panel-card"><h3>سارة بنعلي</h3><p class="muted">الرابع ابتدائي (أ)</p><ul class="list">${listItem('حضور اليوم','حاضرة',tag('ok','ok'))}${listItem('المستوى العام','جيد (تقدم مستمر)',tag('جيد','ok'))}</ul><div class="cta-row"><button class="btn secondary" onclick="setView('child')">عرض التقرير</button></div></div>
    <div class="panel-card"><h3>ياسين بنعلي</h3><p class="muted">تمهيدي (أ)</p><ul class="list">${listItem('حضور اليوم','حاضر',tag('ok','ok'))}${listItem('المستوى العام','جيد جدًا في المهارات',tag('جيد','ok'))}</ul></div>`;
    return `<h2>ملخص الأبناء</h2><p class="muted">حساب خاص لولي الأمر لمتابعة الأبناء والتكامل مع المعلمين (ضمن الخصوصية).</p><div class="grid two">${html}</div>`; },
  child: async () => {
    let report=null, talents=[], assessments=[], caseFile=null, notifs=null;
    if (state.token && state.role==='parent') {
      const [r1,r2,r3,r4,r5] = await Promise.all([
        api('/api/parent/child-report?studentId=s_sara'),
        api('/api/parent/child-talents?studentId=s_sara'),
        api('/api/parent/child-assessments?studentId=s_sara'),
        api('/api/parent/child-case?studentId=s_sara'),
        api('/api/parent/notifications'),
      ]);
      if (r1.ok) report = r1.data.report;
      if (r2.ok) talents = r2.data.talents||[];
      if (r3.ok) assessments = r3.data.assessments||[];
      if (r4.ok) caseFile = r4.data.case;
      if (r5.ok) notifs = r5.data;
    }
    const gradesHtml = (report?.grades||[]).map(g=>`${esc(g.subject)}: ${g.score}/${g.scale}`).join(' · ') || 'الرياضيات: 16/20 · الفرنسية: 14/20 · العربية: 17/20';
    const guidanceHtml = (report?.guidance||[]).map(g=>listItem(esc(g), '', tag('توصية','info'))).join('') || `${listItem('نقطة قوة','مشاركة جيدة في النشاط العلمي',tag('إيجابي','ok'))}${listItem('يحتاج دعم','مراجعة التعبير الشفهي بالفرنسية 10 دقائق',tag('توصية','warn'))}`;
    const talentsHtml = talents.length ? talents.map(t=>listItem(esc(t.domain), esc(t.talent+' ('+t.level+')'), tag(t.level==='gifted'?'موهبة':'وعد', t.level==='gifted'?'ok':'info'))).join('') : listItem('لا مواهب مرصودة', 'سيتم تحديثها', tag('—','info'));
    const assessHtml = assessments.length ? assessments.slice(0,4).map(a=>listItem(esc(a.subject||a.refSkill), `إتقان ${Math.round((a.score||0)*100)}% · ${esc(a.type||'')} · ${esc(a.date||'')}`, tag((a.score||0)>=0.7?'جيد':'متابعة', (a.score||0)>=0.7?'ok':'warn'))).join('') : listItem('لا تقييمات', 'سيتم إضافتها', tag('—','info'));
    const notifHtml = (notifs?.alerts||[]).concat(notifs?.due||[]).slice(0,4).map(n=>listItem(esc(n.message||n.type||'تنبيه'), esc(n.due||n.date||''), tag('تنبيه','warn'))).join('') || listItem('لا تنبيهات', 'كل شيء على ما يرام', tag('مستقر','ok'));
    return `<h2>ملف الابن: ${esc(report?.student?.name||'سارة بنعلي')} (تقارير)</h2>
    <div class="grid two">
      <div class="panel-card"><h3>الحضور والأداء</h3>
        <p>الحضور: <strong>${report?.attendance?.rate ?? 96}%</strong> (${report?.attendance?.present ?? 0}/${report?.attendance?.total ?? 0})</p><div class="progress"><span style="width:${report?.attendance?.rate ?? 96}%"></span></div><br/>
        <p>${gradesHtml}</p>
        <p class="muted" style="font-size:13px">${esc(report?.privacy||'')}</p>
      </div>
      <div class="panel-card"><h3>تقرير المعلم ونقاط الدعم</h3><ul class="list">${guidanceHtml}</ul><div class="cta-row"><button class="btn secondary" onclick="setView('childInsights')">مسار التعلم</button><button class="btn secondary" onclick="setView('messages')">مراسلة المعلم</button></div></div>
    </div>
    <div class="grid two" style="margin-top:14px">
      <div class="panel-card"><h3>المواهب والبرامج</h3><ul class="list">${talentsHtml}</ul></div>
      <div class="panel-card"><h3>التقييمات (إدخال)</h3><ul class="list">${assessHtml}</ul></div>
    </div>
    <div class="grid two" style="margin-top:14px">
      <div class="panel-card"><h3>الحالة (متابعة)</h3><ul class="list">
        ${caseFile ? listItem(esc(caseFile.focus||''), `الحالة: ${fmtStatus(caseFile.status)} · مراجعة: ${esc(caseFile.nextReview||'-')}`, tag(caseFile.status==='active'?'نشطة':'—', 'info')) : listItem('لا حالة نشطة', '—', tag('—','info'))}
      </ul></div>
      <div class="panel-card"><h3>تنبيهات واستحقاقات</h3><ul class="list">${notifHtml}</ul></div>
    </div>`; },
  childInsights: async () => {
    let ins=null;
    if (state.token && state.role==='parent') {
      const r = await api('/api/parent/child-insights?studentId=s_sara');
      if (r.ok) ins = r.data.insights;
    }
    const gaps = (ins?.gaps||[]).map(g=>`${g.skill} (${Math.round((g.mastery||0)*100)}%)`).join('، ') || 'لا فجوات حرجة مرصودة';
    const acts = (ins?.recommendedActivities||[]).slice(0,4).map(a=>listItem(esc(a.name), esc(a.category||''), tag(a.outreach?'إشعاع':'نشاط', a.outreach?'ok':'info'))).join('') || `${listItem('نادي Arduino والروبوتيك','مناسب للاهتمام العلمي',tag('إثراء','ok'))}${listItem('شطرنج / مسابقات رياضيات','تنمية التفكير',tag('موصى به','info'))}`;
    return `<h2>مسار التعلم والتوصيات (${esc(ins?.student?.name||'سارة')})</h2>
    <p class="muted">رؤية مبسطة لولي الأمر ضمن الخصوصية: تقدم، نقاط دعم/قوة، توصيات وتمارين وأنشطة موازية.</p>
    <div class="grid two">
      <div class="panel-card"><h3>التشخيص المبسط</h3><ul class="list">
        ${listItem('التصنيف', esc(ins?.classification||'تميز مع مسار إثرائي'), tag(ins?.gaps?.length?'متابعة':'إيجابي', ins?.gaps?.length?'warn':'ok'))}
        ${listItem('نقاط قوة', (ins?.strengths||[]).map(s=>s.skill).join('، ')||'رياضيات ونشاط علمي', tag('قوة','ok'))}
        ${listItem('نقاط دعم', gaps, tag(ins?.gaps?.length?'دعم':'مستقر', ins?.gaps?.length?'warn':'ok'))}
      </ul></div>
      <div class="panel-card"><h3>خطة ومسار</h3><ul class="list">
        ${listItem('التركيز', esc(ins?.learningPath?.focus||'تعزيز الفرنسية + إثراء'), tag('نشط','info'))}
        ${listItem('خطوات تالية', (ins?.learningPath?.nextSteps||['تمارين قراءة فرنسية 10 دقائق/يوم']).slice(0,3).join(' · '), '')}
        ${listItem('إعادة تقييم', esc(ins?.learningPath?.reassessDate||'2026-12-05'), tag('مجدول','info'))}
      </ul></div>
    </div>
    <div class="panel-card" style="margin-top:14px"><h3>أنشطة موازية مقترحة لتنمية المواهب</h3><ul class="list">${acts}</ul><div class="cta-row"><button class="btn primary" onclick="setView('parentGuidance')">كيف أساعد في المنزل؟</button></div></div>`;
  },
  parentGuidance: async () => {
    let ins=null;
    if (state.token && state.role==='parent') {
      const r = await api('/api/parent/child-insights?studentId=s_sara');
      if (r.ok) ins = r.data.insights;
    }
    const gaps = (ins?.gaps||[]).map(g=>g.skill).join('، ') || 'الرياضيات (كسور)';
    return `<h2>دعم التعلم والتكامل مع المعلم</h2>
    <div class="grid two">
      <div class="panel-card"><h3>إرشادات حسب تقرير الابن</h3><ul class="list">
        ${listItem('الرياضيات (كسور)', 'مراجعة قصيرة يومية 15 دقيقة مع أمثلة منزلية', tag('أسبوعي','info'))}
        ${listItem('اللغة الفرنسية', 'قراءة 10 دقائق بصوت مرتفع 3 مرات أسبوعيًا', tag('روتين','ok'))}
        ${listItem('تنظيم الوقت', 'تثبيت وقت ثابت لإنجاز الواجبات بعد المدرسة', tag('عادة','ok'))}
        ${ins?listItem('نقاط دعم (من البيانات)', gaps, tag('دعم','warn')):''}
      </ul></div>
      <div class="panel-card"><h3>التكامل ولي الأمر - معلم</h3><ul class="list">
        ${listItem('مشاركة الملاحظات', 'إبلاغ المعلم بصعوبات أو تحسن ملحوظ', tag('تواصل','info'))}
        ${listItem('متابعة خطة الدعم', 'الالتزام بتوصيات المعلم ومراجعة التقدم', tag('مشترك','ok'))}
        ${listItem('اجتماع/رسالة دورية', 'تحديث كل أسبوعين حول تقدم الابن', tag('مقترح','warn'))}
      </ul><div class="cta-row"><button class="btn primary" onclick="setView('messages')">التواصل مع المعلم</button></div></div>
    </div>`; },
  calendar: async () => {
    let events=null;
    if (state.token) {
      const r = await api('/api/calendar/events');
      if (r.ok) events = r.data.events;
    }
    const items = (events||[]).map(e=>listItem(esc(e.title), esc(`${e.date} · ${e.type} · ${e.audience||''}`), tag(e.type==='academic'?'أكاديمي':e.type==='meeting'?'اجتماع':e.type==='competition'?'منافسة':'فعالية', 'info'))).join('') || `
      ${listItem('اختبار رياضيات', 'الأربعاء 09:00 · الصف 4أ', tag('أكاديمي','info'))}
      ${listItem('اجتماع أولياء الأمور', 'الخميس 16:30', tag('موعد','warn'))}
      ${listItem('فعالية القراءة', 'الجمعة 10:00', tag('فعالية','ok'))}`;
    return `<h2>التقويم والمواعيد (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul></div>`; },
  // Student
  journey: async () => {
    let ins=null;
    if (state.token && state.role==='student') {
      const r = await api('/api/student/insights');
      if (r.ok) ins = r.data.insights;
    }
    const gaps = (ins?.gaps||[]).map(g=>g.skill).join('، ') || 'لا فجوات حرجة';
    const strengths = (ins?.strengths||[]).map(s=>s.skill).join('، ') || 'الرياضيات، القراءة';
    return `<h2>مساري اليوم</h2>
    <p class="muted">فضاء تعليمي خاص بالتلميذ (لغات أساسية واختيارية ومواد أخرى) — ${state.token?'بيانات حية':''}</p>
    <div class="cta-row" style="margin-bottom:12px"><span class="streak">🔥 سلسلة 5 أيام</span> <span class="tag ok">هدف اليوم: 3 مهام</span></div>
    <div class="panel-card"><h3>تقدم اليوم</h3><p><strong>2 / 3</strong> مهام مكتملة</p><div class="progress"><span style="width:66%"></span></div>
      <div class="cta-row"><button class="btn primary" onclick="setView('learn')">ابدأ المهمة التالية</button><button class="btn secondary" onclick="setView('myPath')">مساري وتوصياتي</button></div></div>
    <div class="panel-card" style="margin-top:14px"><h3>ملخص تشخيصي</h3><ul class="list">
      ${listItem('نقاط قوة', strengths, tag('قوة','ok'))}
      ${listItem('نقاط دعم', gaps, tag(ins?.gaps?.length?'متابعة':'مستقر', ins?.gaps?.length?'warn':'ok'))}
      ${listItem('تصنيف', esc(ins?.classification||'موهوب/متميز'), tag('مسار','info'))}
    </ul></div>`; },
  learn: async () => {
    let content=null;
    if (state.token && state.role==='student') {
      const r = await api('/api/student/content');
      if (r.ok) content = r.data;
    }
    const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'ar';
    const langNames = { ar: 'العربية', fr: 'Français', en: 'English', amz: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' };
    const items = (content?.items||[]).slice(0,8);
    const itemsHtml = items.length ? items.map(c=>listItem(esc(c.subject||c.subjectId), esc(`${c.unit||''} · ${c.lessons?.length||0} دروس · ${c.language||'ar'}`), tag(c.status==='published'?'منشور':'مسودة', c.status==='published'?'ok':'warn'))).join('') : subjects.coreLanguages.map(s => listItem(s, 'مواد ودروس وتمارين تفاعلية', tag('أساسي','ok'))).join('');
    return `<h2>المواد الدراسية (فضاء التلميذ)</h2>
    <p class="muted">دعم 4 لغات أساسية: العربية، الفرنسية، الإنجليزية، الأمازيغية (+ اختيارية: إسبانية، ألمانية، إيطالية). اللغة الحالية: ${langNames[lang]||lang}</p>
    <div class="grid two">
      <div class="panel-card"><h3>اللغات الأساسية</h3><ul class="list">
        ${subjects.coreLanguages.map(s => listItem(s, 'مواد ودروس وتمارين تفاعلية', tag('أساسي','ok'))).join('')}
      </ul></div>
      <div class="panel-card"><h3>لغات اختيارية</h3><ul class="list">
        ${subjects.optionalLanguages.map(s => listItem(s, 'متاحة حسب البرنامج/المستوى', tag('اختياري','info'))).join('')}
      </ul></div>
      <div class="panel-card" style="grid-column:1/-1"><h3>مواد أخرى</h3><ul class="list">
        ${subjects.other.map(s => listItem(s, 'دروس، موارد، وأنشطة', tag('مقرر','info'))).join('')}
      </ul></div>
      ${content ? `<div class="panel-card" style="grid-column:1/-1"><h3>محتوى تعليمي (${esc(content.level||'')})</h3><ul class="list">${itemsHtml}</ul><p class="muted" style="font-size:13px;margin-top:8px">وحدات: ${items.length} · لغات: ar, fr, en, amz</p></div>` : ''}
    </div>`; },
  progress: async () => {
    let ins=null, showcase=null, portfolio=null;
    if (state.token && state.role==='student') {
      const [r1,r2,r3] = await Promise.all([
        api('/api/student/insights'),
        api('/api/showcase'),
        api('/api/showcase/portfolio?studentId=s_sara'),
      ]);
      if (r1.ok) ins = r1.data.insights;
      if (r2.ok) showcase = r2.data;
      if (r3.ok) portfolio = r3.data;
    }
    const xp = 320 + (ins?.strengths?.length||0)*10 + (ins?.talents?.length||0)*20;
    const badges = (ins?.talents?.length||0) + (ins?.strengths?.length||0) + 3;
    const worksHtml = (portfolio?.works||[]).slice(0,4).map(w=>listItem(esc(w.title||'عمل'), esc(`${w.subject||''} · ${w.grade||''}/20`), tag(w.grade>=16?'متميز':'جيد', w.grade>=16?'ok':'info'))).join('') || listItem('لا أعمال منشورة', 'أكمل واجباتك لتظهر هنا', tag('—','info'));
    const featuredHtml = (showcase?.featured||[]).slice(0,3).map(f=>listItem(esc(f.title||''), esc(f.student||''), tag('مميز','ok'))).join('') || '';
    return `<h2>إنجازاتي (حي)</h2>
    <div class="grid kpis">${kpi(xp, 'نقاط XP')}${kpi('5', 'سلسلة الأيام')}${kpi(badges, 'شارات')}</div>
    <div class="grid two" style="margin-top:14px">
      <div class="panel-card"><h3>شاراتي وتقدمي</h3><ul class="list">
        ${listItem('🏅 المثابر', 'أكملت الواجبات 7 أيام متتالية', tag('مكتسبة','ok'))}
        ${listItem('📚 قارئ نشط', 'أنهيت 5 دروس قراءة', tag('مكتسبة','ok'))}
        ${listItem('⭐ تحسن ملحوظ', 'تحسن في الرياضيات هذا الشهر', tag('جديدة','info'))}
        ${ins?.gaps?.length ? listItem('🎯 تحدي دعم', 'خطة دعم نشطة (إنجاز)', tag('قيد','warn')) : ''}
      </ul><p class="muted" style="margin-top:10px">المسار يُحدّث بناءً على التقييم، التغذية الراجعة، وإعادة التقييم. ${ins ? 'تصنيف: ' + esc(ins.classification||'') : ''}</p></div>
      <div class="panel-card"><h3>معرض أعمالي (Portfolio)</h3><ul class="list">${worksHtml}</ul></div>
    </div>
    ${featuredHtml ? `<div class="panel-card" style="margin-top:14px"><h3>أعمال مميزة (Showcase)</h3><ul class="list">${featuredHtml}</ul></div>` : ''}`; },
  myPath: async () => {
    let ins=null;
    if (state.token && state.role==='student') {
      const r = await api('/api/student/insights');
      if (r.ok) ins = r.data.insights;
    }
    const comps = (ins?.competencies||[]).slice(0,5).map(c=>listItem(esc(`${c.subject} — ${c.skill}`), `إتقان ${Math.round((c.mastery||0)*100)}% (هدف ${Math.round((c.targetMastery||0.7)*100)}%)`, tag(c.mastery>= (c.targetMastery||0.7)?'جيد':'متابعة', c.mastery>= (c.targetMastery||0.7)?'ok':'warn'))).join('');
    const ex = (ins?.suggestedExercises||[]).slice(0,4).map(e=>listItem(esc(e.exercise), esc(e.frequency||''), tag('تمرين','info'))).join('');
    const fbCards = (ins?.feedbackCards||[]).slice(0,2).map(c=>listItem(esc(c.summary), `${fmtStatus(c.status)} · مراجعة ${esc(c.nextReview||'-')}`, tag(fmtStatus(c.status), c.status==='approved'||c.status==='completed'?'ok':'info'))).join('');
    return `<h2>مساري التعلمي وتوصياتي</h2>
    <p class="muted">تقييم ← تغذية راجعة ← مسار تعلم ← تمارين/أنشطة ← إعادة تقييم (مرتبط بالكفايات المرجعية وبطاقات التغذية الراجعة المعتمدة).</p>
    <div class="grid two">
      <div class="panel-card"><h3>التشخيص والتصنيف</h3><ul class="list">
        ${listItem('التصنيف', esc(ins?.classification||'موهوب/متميز مع مسار إثرائي'), tag(ins?.gaps?.length?'دعم':'إثراء', ins?.gaps?.length?'warn':'ok'))}
        ${listItem('نقاط قوة', (ins?.strengths||[]).map(s=>s.skill).join('، ')||'الرياضيات، النشاط العلمي', tag('قوة','ok'))}
        ${listItem('نقاط دعم', (ins?.gaps||[]).map(g=>g.skill).join('، ')||'لا فجوات حرجة', tag(ins?.gaps?.length?'متابعة':'مستقر', ins?.gaps?.length?'warn':'ok'))}
      </ul></div>
      <div class="panel-card"><h3>مسار التعلم والكفايات</h3><ul class="list">
        ${listItem('التركيز', esc(ins?.learningPath?.focus||'تعزيز الفرنسية + إثراء'), tag('نشط','info'))}
        ${listItem('إعادة التقييم', esc(ins?.learningPath?.reassessDate||'2026-12-05'), tag('مجدول','info'))}
        ${comps || listItem('كفايات', 'مرتبطة بمرجع المستوى والمادة', tag('معياري','info'))}
      </ul></div>
    </div>
    <div class="grid two" style="margin-top:14px">
      <div class="panel-card"><h3>تمارين مقترحة وتغذية راجعة</h3><ul class="list">${ex || listItem('تمارين','تمارين موجهة حسب المسار',tag('خطة','info'))}</ul></div>
      <div class="panel-card"><h3>بطاقات التغذية الراجعة</h3><ul class="list">${fbCards || listItem('لا بطاقات حالياً','ستظهر هنا التوصيات المعتمدة',tag('—','info'))}</ul></div>
    </div>`;
  },
  activities: async () => {
    let la=null, impact=null;
    if (state.token && state.portal==='admin') {
      const [r1,r2] = await Promise.all([api('/api/admin/learning-analytics'), api('/api/admin/impact')]);
      if (r1.ok) la = r1.data; if (r2.ok) impact = r2.data.impact;
    }
    const acts = (la?.activities||[]).slice(0,6);
    const actsHtml = acts.length ? acts.map(a=>listItem(esc(a.name), esc(a.category||''+' · '+a.schedule||''), tag(a.type==='competition'?'مسابقة':a.type==='community'?'مجتمع':'نادي', a.outreach?'ok':'info'))).join('') : `
        ${listItem('نادي الشطرنج / كرة القدم', 'رياضة وذهنية · أسبوعي', tag('نادي','ok'))}
        ${listItem('نادي Arduino والروبوتيك', 'علوم وتكنولوجيا · أسبوعي', tag('نادي','ok'))}
        ${listItem('المسرح والموسيقى والثقافة', 'فنون وثقافة · أسبوعي', tag('نادي','ok'))}`;
    const pubsHtml = (impact?.outreach?.publications ? '' : '') + `
      ${listItem('أعمال نادي القصة القصيرة — العدد 1', 'آداب · 2026-11-10 · تنمية التعبير', tag('منشور','ok'))}
      ${listItem('عرض مسرحي: مواهب التلاميذ', 'فنون · 2026-11-05 · ثقة وتواصل', tag('منشور','ok'))}
      ${listItem('تحدي الرياضيات الشهري — نتائج', 'رياضيات · 2026-11-12 · تحفيز وتفوق', tag('منشور','ok'))}`;
    return `<h2>النوادي، الأنشطة المشتركة، والمجتمع</h2>
    <p class="muted">أنشطة إشعاعية دورية (نوادٍ ومسابقات) تُنشر وتُستثمر لتنمية اللغات، العلوم، الآداب، الفنون، الرياضة والمواهب.</p>
    <div class="grid two">
      <div class="panel-card"><h3>نوادٍ وbeginTransaction</h3><ul class="list">${actsHtml}</ul></div>
      <div class="panel-card"><h3>نشر واستثمار الأثر</h3><ul class="list">${pubsHtml}</ul><p class="muted" style="margin-top:8px">الهدف: إشعاع المدرسي نحو الأسرة والمجتمع واستثمار الإنتاجات في التعلم وتنمية المواهب.</p></div>
    </div>`;
  },
  schedule: async () => {
    let events=null;
    if (state.token) {
      const r = await api('/api/calendar/events');
      if (r.ok) events = r.data.events;
    }
    const items = (events||[]).map(e=>listItem(esc(e.title), esc(`${e.date} · ${e.type} · ${e.audience}`), tag(e.type==='academic'?'أكاديمي':e.type==='meeting'?'اجتماع':e.type==='competition'?'منافسة':'فعالية', 'info'))).join('') || `
      ${listItem('08:30', 'رياضيات · أ. مريم · قاعة 2', '')}
      ${listItem('10:15', 'اللغة العربية · أ. كريم · قاعة 1', '')}
      ${listItem('14:00', 'علوم · أ. سعاد · المختبر', '')}`;
    return `<h2>جدولي / التقويم (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul></div>`; },
  // Shared
  comms: async () => {
    let comms=[];
    if (state.token) {
      const base = state.portal==='admin' ? '/api/admin/communications' : (state.role==='teacher' ? '/api/teacher/communications' : null);
      if (base) { const r = await api(base); if (r.ok) comms = r.data.communications||[]; }
    }
    const items = comms.length ? comms.slice(0,5).map(c=>listItem(esc(c.type||'تواصل'), esc(`${c.channel||''} · ${c.status||''} ${c.governance?.approvedBy?'· معتمد':''}`), tag(c.status==='sent'?'مرسل':c.status==='approved'?'معتمد':'مسودة', c.status==='sent'?'ok':c.status==='approved'?'info':'warn'))).join('') : `
      ${listItem('تعميم: اجتماع أولياء الأمور', 'مرسل لجميع الأولياء · أمس', tag('مرسل','ok'))}
      ${listItem('تذكير: فعالية القراءة', 'الجمعة 10:00 · مجدول', tag('مجدول','info'))}
      ${listItem('رسالة من الإدارة', 'تحديث أوقات الاستقبال', tag('جديد','warn'))}`;
    return `<h2>التواصل والتعميمات (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul><div class="cta-row"><button class="btn primary">+ تعميم جديد</button></div></div>`; },
  messages: async () => {
    let comms=[];
    if (state.token) {
      const base = state.portal==='admin' ? '/api/admin/communications' : (state.role==='teacher' ? '/api/teacher/communications' : null);
      if (base) { const r = await api(base); if (r.ok) comms = r.data.communications||[]; }
    }
    const items = comms.length ? comms.slice(0,5).map(c=>listItem(esc(c.type||'تواصل'), esc(`${c.channel||''} · ${c.status||''}`), tag(c.status==='sent'?'مرسل':c.status==='approved'?'معتمد':'مسودة', c.status==='sent'?'ok':c.status==='approved'?'info':'warn'))).join('') : `
      ${listItem('إدارة المؤسسة', 'تذكير بموعد اجتماع أولياء الأمور', tag('جديد','warn'))}
      ${listItem('أ. مريم (رياضيات)', 'سارة أبدعت في واجب الكسور - تقرير مرفق', tag('مقروء','ok'))}
      ${listItem('ولي أمر (سارة بنعلي)', 'استفسار حول خطة دعم الفرنسية', tag('قيد الرد','info'))}`;
    return `<h2>التواصل (حي)</h2>
    <div class="panel-card"><ul class="list">${items}</ul><div class="cta-row"><button class="btn primary">+ رسالة جديدة</button></div></div>`; },
};

async function renderView() {
  const main = document.getElementById('main');
  const fn = views[state.view];
  if (!fn) { main.innerHTML = '<div class="panel-card">قريبًا</div>'; return; }
  // Smooth transition
  main.style.opacity = '0';
  main.style.transform = 'translateY(8px)';
  await new Promise(r => setTimeout(r, 150));
  const out = fn();
  if (out && typeof out.then === 'function') {
    main.innerHTML = '<div class="panel-card muted"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton" style="width:60%"></div><p style="margin-top:8px">جارٍ تحميل البيانات...</p></div>';
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
    try { main.innerHTML = await out; }
    catch(e) { main.innerHTML = `<div class="panel-card"><strong>تعذر تحميل العرض.</strong><div class="muted">${esc(e.message||'خطأ')}</div></div>`; }
  } else {
    main.innerHTML = out || '<div class="panel-card">قريبًا</div>';
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
  }
}

// Toast notification helper
function showToast(message, type='info', duration=3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; setTimeout(() => toast.remove(), 300); }, duration);
}

async function refreshCurrentView() { await renderView(); }

async function doGlobalSearch() {
  const q = document.getElementById('global-search')?.value?.trim();
  if (!q) return;
  const base = state.portal === 'admin' ? '/api/admin/search' : (state.role === 'teacher' ? '/api/teacher/search' : null);
  if (!base) { showToast('البحث متاح للإدارة والمعلمين', 'info'); return; }
  const r = await api(base + '?q=' + encodeURIComponent(q));
  if (r.ok && r.data.results) {
    const results = r.data.results;
    const html = results.length ? results.map(res => `<li><div><strong>${esc(res.title)}</strong><div class="muted" style="font-size:13px">${esc(res.subtitle)} · ${esc(res.type)}</div></div>${tag(res.type,'info')}</li>`).join('') : '<li><div class="muted">لا نتائج.</div></li>';
    // Show in a panel
    const panel = document.getElementById('panel');
    const overlay = document.getElementById('panel-overlay');
    const title = document.getElementById('panel-title');
    const body = document.getElementById('panel-body');
    overlay.classList.remove('hidden');
    panel.classList.remove('hidden');
    title.textContent = `نتائج البحث: "${q}" (${r.data.total})`;
    body.innerHTML = `<ul class="list">${html}</ul>`;
  } else {
    showToast('تعذر البحث: ' + (r.error || r.status), 'error');
  }
}

async function updateFeedbackCard(id, status) {
  if (!state.token) { alert('يلزم تسجيل الدخول عبر الخادم لتنفيذ الاعتماد/التحديث.'); return; }
  const note = prompt('ملاحظة/مبرر (اختياري):') || '';
  const base = state.portal === 'admin' ? '/api/admin/feedback-cards/update' : '/api/teacher/feedback-cards/update';
  const res = await api(base, { method:'POST', body: JSON.stringify({ id, status, note, reviewNotes: note }) });
  if (res.ok) {
    alert('تم تحديث بطاقة التغذية الراجعة وتسجيل الإجراء في سجل التدقيق.');
    await refreshCurrentView();
  } else {
    alert('تعذر التحديث: ' + (res.error||res.status) + (res.status===403?' (تحقق من الصلاحية والنطاق)':''));
  }
}

function selectFeedbackCard(id) { state.selected.cardId = (state.selected.cardId===id?null:id); refreshCurrentView(); }
function selectCase(id) { state.selected.caseId = (state.selected.caseId===id?null:id); refreshCurrentView(); }
async function editFeedbackNote(id) {
  if (!state.token) { alert('يلزم تسجيل الدخول.'); return; }
  const note = prompt('ملاحظة المراجعة/خطة المتابعة:');
  if (note === null) return;
  const base = state.portal === 'admin' ? '/api/admin/feedback-cards/update' : '/api/teacher/feedback-cards/update';
  const res = await api(base, { method:'POST', body: JSON.stringify({ id, reviewNotes: note, note }) });
  if (res.ok) { await refreshCurrentView(); } else { alert('تعذر الحفظ: ' + (res.error||res.status)); }
}
async function addCaseTimeline(caseRef) {
  if (!state.token) { alert('يلزم تسجيل الدخول عبر الخادم لإضافة حدث للحالة.'); return; }
  const event = prompt('وصف الحدث/الإجراء (جلسة استماع، تواصل أسري، تدخل، ملاحظة، إعادة تقييم...):');
  if (!event) return;
  const base = state.portal === 'admin' ? '/api/admin/cases/timeline' : '/api/teacher/cases/timeline';
  const body = { event, date: new Date().toISOString().slice(0,10), term: 'الفصل 1' };
  if (String(caseRef).startsWith('case_')) body.id = caseRef; else body.studentId = caseRef;
  const res = await api(base, { method:'POST', body: JSON.stringify(body) });
  if (res.ok) { await refreshCurrentView(); } else { alert('تعذر الإضافة: ' + (res.error||res.status)); }
}

function openPanel(type) {
  const panel = document.getElementById('panel');
  const overlay = document.getElementById('panel-overlay');
  const title = document.getElementById('panel-title');
  const body = document.getElementById('panel-body');
  overlay.classList.remove('hidden');
  panel.classList.remove('hidden');
  if (type === 'info') {
    title.textContent = 'معلومات المؤسسة';
    body.innerHTML = `
      <div class="info-block"><strong>${institution.name}</strong><div class="muted">${institution.group}</div></div>
      <div class="info-block"><strong>العنوان</strong><div>${institution.address}</div></div>
      <div class="info-block"><strong>الهاتف</strong><div>${institution.phones.map(p=>`<a href="tel:${p.replace(/\s/g,'')}">${p}</a>`).join('<br>')}</div></div>
      <div class="info-block"><strong>واتساب</strong><div><a href="https://wa.me/212708230715">${institution.whatsapp}</a></div></div>
      <div class="info-block"><strong>البريد</strong><div><a href="mailto:${institution.email}">${institution.email}</a></div></div>
      <div class="info-block"><strong>أوقات العمل</strong><div>${institution.hours.join('<br>')}</div></div>`;
  } else {
    title.textContent = 'الإشعارات';
    body.innerHTML = `<ul class="list">
      ${listItem('واجب مستحق اليوم', 'رياضيات - الصف 4أ', tag('أكاديمي','warn'))}
      ${listItem('تعميم جديد', 'اجتماع أولياء الأمور الخميس', tag('إداري','info'))}
      ${listItem('تم رصد الحضور', 'تم تسجيل حضور اليوم بنجاح', tag('نظام','ok'))}
    </ul>`;
  }
}
function closePanel() {
  document.getElementById('panel').classList.add('hidden');
  document.getElementById('panel-overlay').classList.add('hidden');
}