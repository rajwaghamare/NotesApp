import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { Note, Tenant } from '../lib/models.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// all routes here require auth
router.use(requireAuth);

// GET /notes
router.get('/', async (req, res) => {
  await connectDB();
  const { tenantSlug } = req.user;
  const notes = await Note.find({ tenantSlug }).sort({ createdAt: -1 });
  res.json(notes);
});

// POST /notes
router.post('/', async (req, res) => {
  await connectDB();
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
  res.status(201).json(note);
});

// GET /notes/:id
router.get('/:id', async (req, res) => {
  await connectDB();
  const { tenantSlug } = req.user;
  const { id } = req.params;
  const note = await Note.findOne({ _id: id, tenantSlug });
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

// PUT /notes/:id
router.put('/:id', async (req, res) => {
  await connectDB();
  const { tenantSlug } = req.user;
  const { id } = req.params;
  const { title, content } = req.body || {};
  const note = await Note.findOneAndUpdate(
    { _id: id, tenantSlug },
    { $set: { ...(title ? { title } : {}), ...(content !== undefined ? { content } : {}) } },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

// DELETE /notes/:id
router.delete('/:id', async (req, res) => {
  await connectDB();
  const { tenantSlug } = req.user;
  const { id } = req.params;
  const del = await Note.findOneAndDelete({ _id: id, tenantSlug });
  if (!del) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;
