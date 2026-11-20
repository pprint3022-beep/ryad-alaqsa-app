/**
 * Enrich the prototype JSON store with demonstrative two-way message threads.
 *
 * - 5 threads between demo parent u_p1 and teacher u_t1, scoped to the
 *   parent's children (s_sara, s_yassine) and the teacher's classes.
 * - Optional links to an existing case and/or feedback card whose studentId
 *   matches the thread's studentId.
 * - Every thread has a linked, already-approved 'parent_message' in_app
 *   communication: parent initiation is explicit consent (no approval gate).
 * - One thread is closed; at least one is card-linked; several carry both a
 *   parent and a teacher message.
 * - Human-only and audited at runtime; this script only writes demo fixtures.
 *
 * Idempotent: guarded by `demoMessageThreadsSeed`.
 *
 * Run once: node scripts/seed-message-threads-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const threads = [
  {
    id: 'mt_demo_1',
    studentId: 's_sara',
    classId: 'c_p4a',
    caseId: 'case_sara',
    cardId: 'fc2',
    subject: 'Arabic subject',
    status: 'open',
    createdAt: '2026-11-12T09:15:00.000Z',
    createdBy: 'u_p1',
    createdByRole: 'parent',
    lastActivityAt: '2026-11-14T11:40:00.000Z',
    communicationId: 'com_thread_1',
    governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: '2026-11-12T09:15:00.000Z' },
    messages: [
      { id: 'msg_demo_1a', from: 'u_p1', fromRole: 'parent', body: 'Arabic', at: '2026-11-12T09:15:00.000Z' },
      { id: 'msg_demo_1b', from: 'u_t1', fromRole: 'teacher', body: 'Arabic', at: '2026-11-14T11:40:00.000Z' },
    ],
  },
  {
    id: 'mt_demo_2',
    studentId: 's_adam',
    classId: 'c_p4a',
    caseId: 'case_adam',
    cardId: 'fc1',
    subject: 'Arabic subject',
    status: 'closed',
    createdAt: '2026-11-10T08:30:00.000Z',
    createdBy: 'u_p1',
    createdByRole: 'parent',
    lastActivityAt: '2026-11-13T14:05:00.000Z',
    communicationId: 'com_thread_2',
    governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: '2026-11-10T08:30:00.000Z' },
    messages: [
      { id: 'msg_demo_2a', from: 'u_p1', fromRole: 'parent', body: 'Arabic', at: '2026-11-10T08:30:00.000Z' },
      { id: 'msg_demo_2b', from: 'u_t1', fromRole: 'teacher', body: 'Arabic', at: '2026-11-13T14:05:00.000Z' },
    ],
  },
  {
    id: 'mt_demo_3',
    studentId: 's_stu4',
    classId: 'c_p2b',
    caseId: 'case_s_stu4',
    cardId: 'fc3',
    subject: 'Arabic subject',
    status: 'open',
    createdAt: '2026-11-15T10:00:00.000Z',
    createdBy: 'u_p1',
    createdByRole: 'parent',
    lastActivityAt: '2026-11-16T09:20:00.000Z',
    communicationId: 'com_thread_3',
    governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: '2026-11-15T10:00:00.000Z' },
    messages: [
      { id: 'msg_demo_3a', from: 'u_p1', fromRole: 'parent', body: 'Arabic', at: '2026-11-15T10:00:00.000Z' },
      { id: 'msg_demo_3b', from: 'u_t1', fromRole: 'teacher', body: 'Arabic', at: '2026-11-16T09:20:00.000Z' },
    ],
  },
  {
    id: 'mt_demo_4',
    studentId: 's_sara',
    classId: 'c_p4a',
    caseId: 'case_sara',
    cardId: null,
    subject: 'Arabic subject',
    status: 'open',
    createdAt: '2026-11-17T12:45:00.000Z',
    createdBy: 'u_p1',
    createdByRole: 'parent',
    lastActivityAt: '2026-11-17T12:45:00.000Z',
    communicationId: 'com_thread_4',
    governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: '2026-11-17T12:45:00.000Z' },
    messages: [
      { id: 'msg_demo_4a', from: 'u_p1', fromRole: 'parent', body: 'Arabic', at: '2026-11-17T12:45:00.000Z' },
    ],
  },
  {
    id: 'mt_demo_5',
    studentId: 's_yassine',
    classId: 'c_pre_a',
    caseId: null,
    cardId: null,
    subject: 'Arabic subject',
    status: 'open',
    createdAt: '2026-11-18T08:10:00.000Z',
    createdBy: 'u_p1',
    createdByRole: 'parent',
    lastActivityAt: '2026-11-18T13:30:00.000Z',
    communicationId: 'com_thread_5',
    governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: '2026-11-18T08:10:00.000Z' },
    messages: [
      { id: 'msg_demo_5a', from: 'u_p1', fromRole: 'parent', body: 'Arabic', at: '2026-11-18T08:10:00.000Z' },
      { id: 'msg_demo_5b', from: 'u_t1', fromRole: 'teacher', body: 'Arabic', at: '2026-11-18T13:30:00.000Z' },
    ],
  },
]

const communications = threads.map((thread) => ({
  id: thread.communicationId,
  studentId: thread.studentId,
  type: 'parent_message',
  channel: 'in_app',
  status: 'approved',
  governance: { requiresApproval: false, consent: 'granted', initiator: 'parent' },
  notes: thread.subject,
}))

function writeStore() {
  const json = JSON.stringify(db, null, 2)
  fs.writeFileSync(file, json, 'utf8')
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, json, 'utf8')
    console.log(`synced seeded backup: ${backupFile}`)
  }
}

if (db.demoMessageThreadsSeed === 'v1') {
  console.log('message threads demo data already seeded')
} else {
  db.messageThreads = threads
  db.communications = db.communications || []
  db.communications.push(...communications)
  db.demoMessageThreadsSeed = 'v1'
  writeStore()
  console.log(`seeded ${threads.length} message threads across ${new Set(threads.map((t) => t.studentId)).size} students with ${communications.length} linked communications`)
}
