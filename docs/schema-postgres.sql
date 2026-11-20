-- Ryad Al Aqsa: foundational PostgreSQL schema draft (production-oriented)
-- Encoding: UTF-8, Arabic content supported

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL, -- director,deputy,supervisor,clerk,admin,teacher,parent,student
  portal TEXT NOT NULL, -- admin_portal, private
  scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  refresh_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  rotated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id),
  role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_at ON audit_logs(at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

CREATE TABLE levels (id TEXT PRIMARY KEY, name TEXT NOT NULL, ord INT NOT NULL);
CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT NOT NULL, level_id TEXT NOT NULL REFERENCES levels(id));
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level_id TEXT NOT NULL REFERENCES levels(id),
  class_id TEXT NOT NULL REFERENCES classes(id),
  guardian_user_id TEXT REFERENCES users(id),
  profile JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL -- core_language, optional_language, other, arts, sport
);

CREATE TABLE competency_references (
  id TEXT PRIMARY KEY,
  level_id TEXT REFERENCES levels(id),
  level_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  skill TEXT NOT NULL,
  description TEXT,
  indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_mastery NUMERIC(4,3) NOT NULL DEFAULT 0.700
);
CREATE INDEX idx_cref_level_subject ON competency_references(level_name, subject);

CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  ref_id TEXT REFERENCES competency_references(id),
  ref_skill TEXT,
  subject TEXT,
  level_name TEXT,
  type TEXT NOT NULL, -- diagnostic, formative, summative, intake
  score NUMERIC(4,3),
  term TEXT,
  assessed_at DATE NOT NULL,
  evidence_ref TEXT,
  notes TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assess_student ON assessments(student_id, assessed_at DESC);

CREATE TABLE student_competencies (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  subject TEXT NOT NULL,
  skill TEXT NOT NULL,
  mastery NUMERIC(4,3) NOT NULL,
  status TEXT NOT NULL, -- gap, needs_support, in_progress, mastered
  last_assessed DATE,
  ref_id TEXT REFERENCES competency_references(id)
);

CREATE TABLE learning_paths (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  type TEXT NOT NULL, -- support, standard, enrichment
  focus TEXT,
  next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  reassess_date DATE,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE feedback_cards (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  agent TEXT,
  term TEXT,
  year TEXT,
  priority TEXT, -- low, medium, high
  status TEXT NOT NULL, -- proposed, approved, rejected, in_progress, completed
  summary TEXT NOT NULL,
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  assignee TEXT REFERENCES users(id),
  review_notes TEXT,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  next_review DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  updated_by TEXT REFERENCES users(id)
);
CREATE INDEX idx_cards_status_review ON feedback_cards(status, next_review);

CREATE TABLE feedback_card_history (
  id BIGSERIAL PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES feedback_cards(id),
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  by_user TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  note TEXT
);

CREATE TABLE cases (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  year TEXT,
  status TEXT NOT NULL, -- active, paused, closed
  owner_role TEXT,
  owner_id TEXT REFERENCES users(id),
  focus TEXT,
  opened_at DATE,
  next_review DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE case_timeline (
  id BIGSERIAL PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id),
  term TEXT,
  event_date DATE NOT NULL,
  event TEXT NOT NULL,
  type TEXT, -- note, meeting, intervention, communication, review
  by_user TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_case_timeline ON case_timeline(case_id, event_date DESC);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  type TEXT, -- club, competition, event
  audience TEXT,
  schedule TEXT,
  outreach BOOLEAN DEFAULT FALSE,
  publish BOOLEAN DEFAULT FALSE
);

CREATE TABLE impact_log (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id),
  card_id TEXT REFERENCES feedback_cards(id),
  indicator TEXT NOT NULL,
  baseline NUMERIC(6,3),
  target NUMERIC(6,3),
  current NUMERIC(6,3),
  term TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE communications (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id),
  type TEXT NOT NULL, -- parent_message, meeting, report_share
  channel TEXT, -- in_app, whatsapp, sms, email
  status TEXT NOT NULL, -- draft, approved, sent, cancelled
  draft_id TEXT,
  by_user TEXT REFERENCES users(id),
  governance JSONB NOT NULL DEFAULT '{}'::jsonb, -- requiresApproval, approvedBy, consent
  notes TEXT,
  sent_at TIMESTAMPTZ,
  sent_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Retention/anonymization to be enforced by scheduled jobs per policy.