import { handlePreflight, setCORS } from '../../lib/cors.js';
import { connectDB } from '../../lib/db.js';
import { Note } from '../../lib/models.js';
import { requireAuth } from '../../lib/auth.js';

async function core(req, res) {
  const id = req.query.id;
  const tenantSlug = req.user.tenantSlug;

  if (req.method === 'GET') {
    const note = await Note.findOne({ _id: id, tenantSlug });
    if (!note) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(note);
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body || {};
    const note = await Note.findOneAndUpdate(
      { _id: id, tenantSlug },
      { $set: { ...(title ? { title } : {}), ...(content !== undefined ? { content } : {}) } },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(note);
  }

  if (req.method === 'DELETE') {
    const del = await Note.findOneAndDelete({ _id: id, tenantSlug });
    if (!del) return res.status(404).json({ error: 'Not found' });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORS(res);
  await connectDB();
  return requireAuth(core)(req, res);
}
