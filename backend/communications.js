// Communication channels service: mock providers (WhatsApp/SMS/Email) with governance
// Production: replace mock providers with real API integrations (Twilio, WhatsApp Business API, SMTP)

const crypto = require('crypto');

const providers = {
  whatsapp: {
    name: 'WhatsApp Business API',
    send: async (to, body, meta) => {
      // Production: POST to WhatsApp Business API
      // const res = await fetch('https://graph.facebook.com/v18.0/PHONE_ID/messages', { ... });
      return { ok: true, provider: 'whatsapp', messageId: 'wa_' + crypto.randomBytes(8).toString('hex'), to, preview: body.slice(0, 80), simulated: true };
    }
  },
  sms: {
    name: 'SMS Gateway',
    send: async (to, body, meta) => {
      return { ok: true, provider: 'sms', messageId: 'sms_' + crypto.randomBytes(8).toString('hex'), to, preview: body.slice(0, 80), simulated: true };
    }
  },
  email: {
    name: 'SMTP Email',
    send: async (to, body, meta) => {
      return { ok: true, provider: 'email', messageId: 'em_' + crypto.randomBytes(8).toString('hex'), to, preview: body.slice(0, 80), simulated: true };
    }
  },
  in_app: {
    name: 'In-App Notification',
    send: async (to, body, meta) => {
      return { ok: true, provider: 'in_app', messageId: 'ia_' + crypto.randomBytes(8).toString('hex'), to, preview: body.slice(0, 80), simulated: true };
    }
  }
};

function canSend(communication) {
  const g = communication.governance || {};
  if (g.requiresApproval && !g.approvedBy) return { ok: false, reason: 'requires_approval' };
  if (g.consent === 'pending' && communication.type === 'parent_message') return { ok: false, reason: 'consent_pending' };
  if (g.consent === 'declined') return { ok: false, reason: 'consent_declined' };
  return { ok: true };
}

async function sendCommunication(communication, recipientAddress, body) {
  const gate = canSend(communication);
  if (!gate.ok) return { ok: false, ...gate };
  const channel = communication.channel || 'in_app';
  const provider = providers[channel];
  if (!provider) return { ok: false, reason: 'unknown_channel' };
  const result = await provider.send(recipientAddress, body, { communicationId: communication.id });
  return { ok: true, ...result };
}

// Build a new communication draft (governed by default). Kept here so the
// teacher create route and any future provider share the same defaults.
function createDraft(input, actorId) {
  if (!input || typeof input !== 'object') return { ok: false, error: 'invalid_row' };
  const type = isNonEmptyString(input.type) ? input.type.trim() : 'parent_message';
  const channel = isNonEmptyString(input.channel) ? input.channel : 'in_app';
  if (!providers[channel]) return { ok: false, error: 'unknown_channel' };
  const stamp = Date.now();
  const suffix = crypto.randomBytes(4).toString('hex');
  const id = `com_${stamp}_${suffix}`;
  const draftId = `dr_${stamp}_${suffix}`;
  const at = new Date().toISOString();
  const communication = {
    id,
    studentId: isNonEmptyString(input.studentId) ? input.studentId : null,
    type,
    channel,
    status: 'draft',
    draftId: null,
    by: actorId,
    at,
    governance: { requiresApproval: true, consent: type === 'parent_message' ? 'pending' : 'granted' },
    notes: typeof input.notes === 'string' ? input.notes : '',
    createdAt: at,
    createdBy: actorId
  };
  let draft = null;
  if (isNonEmptyString(input.body) || isNonEmptyString(input.subject)) {
    draft = {
      id: draftId,
      type,
      studentId: communication.studentId,
      tone: isNonEmptyString(input.tone) ? input.tone : '',
      subject: isNonEmptyString(input.subject) ? input.subject : '',
      body: typeof input.body === 'string' ? input.body : '',
      createdAt: at,
      createdBy: actorId
    };
    communication.draftId = draftId;
  }
  return { ok: true, communication, draft };
}
function isNonEmptyString(value) { return typeof value === 'string' && value.trim().length > 0; }

module.exports = { providers, canSend, sendCommunication, createDraft };
