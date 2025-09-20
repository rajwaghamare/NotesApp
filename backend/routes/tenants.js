import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { Tenant } from '../lib/models.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /tenants/:slug/upgrade (admin only)
router.post('/:slug/upgrade', requireAuth, requireAdmin, async (req, res) => {
  await connectDB();
  const { slug } = req.params;

  if (slug !== req.user.tenantSlug) {
    return res.status(403).json({ error: 'Cannot upgrade another tenant' });
  }

  const t = await Tenant.findOneAndUpdate(
    { slug },
    { $set: { plan: 'pro', noteLimit: null } },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: 'Tenant not found' });

  res.json({ message: 'Upgraded to Pro', tenant: t });
});

export default router;
