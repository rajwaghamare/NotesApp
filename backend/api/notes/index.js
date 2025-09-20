import { handlePreflight, setCORS } from '../../lib/cors.js';
import { connectDB } from '../../lib/db.js';
import { Note, Tenant } from '../../lib/models.js';
import { requireAuth } from '../../lib/auth.js';

async function core(req, res) {
  if (req.method === 'GET') {
    const { tenantSlug } = req.user;
    const notes = await Note.find({ tenantSlug }).sort({ createdAt: -1 });
    return res.status(200).json(notes);
  }

  if (req.method === 'POST') {
    const { tenantSlug, sub: userId } = req.user;
    const { title, content } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    const t = await Tenant.findOne({ slug: tenantSlug });
    if (!t) return res.status(400).json({ error: 'Tenant not found' });

    if (t.plan === 'free') {
      const count = await Note.countDocuments({ tenantSlug });
      if (count >= (t.noteLimit ?? 3)) {
        return res.status(403).json({ code: 'LIMIT_REACHED', message: 'Free plan limit reached. Upgrade to Pro.' });
      }
    }

    const note = await Note.create({ tenantSlug, userId, title, content: content || '' });
    return res.status(201).json(note);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORS(res);
  await connectDB();
  return requireAuth(core)(req, res);
}
