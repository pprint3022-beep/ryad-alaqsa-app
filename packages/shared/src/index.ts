// Shared types for Ryad Al Aqsa (frontend + backend)

export type Role = 'director' | 'deputy' | 'supervisor' | 'clerk' | 'admin' | 'teacher' | 'parent' | 'student';
export type Portal = 'admin_portal' | 'private';
export type CardStatus = 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
export type CaseStatus = 'active' | 'paused' | 'closed';
export type Language = 'ar' | 'fr' | 'en' | 'amz';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  portal: Portal;
  scope: Record<string, any>;
  isActive: boolean;
}

export interface Student {
  id: string;
  name: string;
  levelId: string;
  classId: string;
  guardianId?: string;
  profile: {
    strengths: string[];
    interests: string[];
    needsSupport?: boolean;
  };
}

export interface CompetencyReference {
  id: string;
  level: string;
  subject: string;
  skill: string;
  description: string;
  indicators: string[];
  targetMastery: number;
}

export interface FeedbackCard {
  id: string;
  studentId: string;
  agent: string;
  term: string;
  year: string;
  priority: 'low' | 'medium' | 'high';
  status: CardStatus;
  summary: string;
  evidenceIds: string[];
  recommendations: string[];
  resources: string[];
  assignee?: string;
  reviewNotes: string;
  actions: string[];
  nextReview: string;
  history: { at: string; by: string; action: string; note: string }[];
}

export interface Case {
  id: string;
  studentId: string;
  year: string;
  status: CaseStatus;
  ownerRole: string;
  ownerId?: string;
  focus: string;
  openedAt: string;
  nextReview: string;
  timeline: { term: string; date: string; event: string; by: string; type?: string }[];
}

export interface Assessment {
  id: string;
  studentId: string;
  refSkill: string;
  subject: string;
  level: string;
  type: 'diagnostic' | 'formative' | 'summative' | 'intake';
  score: number;
  term: string;
  date: string;
  evidence?: string;
  notes?: string;
}

export interface Communication {
  id: string;
  studentId?: string;
  type: string;
  channel: string;
  status: 'draft' | 'approved' | 'sent' | 'cancelled';
  draftId?: string;
  by: string;
  governance: { requiresApproval: boolean; approvedBy?: string; consent: string };
  notes?: string;
  sentAt?: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}