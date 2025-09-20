import { handlePreflight, setCORS } from '../../../lib/cors.js';
import { connectDB } from '../../../lib/db.js';
import { Tenant } from '../../../lib/models.js';
import { requireAdmin } from '../../../lib/auth.js';

async function core(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (slug !== req.user.tenantSlug) {
    return res.status(403).json({ error: 'Cannot upgrade another tenant' });
  }

  const t = await Tenant.findOneAndUpdate(
    { slug },
    { $set: { plan: 'pro', noteLimit: null } },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: 'Tenant not found' });
  return res.status(200).json({ message: 'Upgraded to Pro', tenant: t });
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORS(res);
  await connectDB();
  return requireAdmin(core)(req, res);
}
