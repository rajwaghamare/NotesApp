import bcrypt from 'bcryptjs';
import { Tenant, User } from './models.js';

export async function ensureSeed() {
  const seed = process.env.SEED_ON_BOOT ?? 'true';
  if (String(seed).toLowerCase() !== 'true') return;

  const NOTE_LIMIT_FREE = Number(process.env.NOTE_LIMIT_FREE || 3);

  const tenants = [
    { name: 'Acme', slug: 'acme', plan: 'free', noteLimit: NOTE_LIMIT_FREE },
    { name: 'Globex', slug: 'globex', plan: 'free', noteLimit: NOTE_LIMIT_FREE },
  ];
  for (const t of tenants) {
    await Tenant.findOneAndUpdate({ slug: t.slug }, t, { upsert: true, new: true });
  }

  const passwordHash = bcrypt.hashSync('password', 10);
  const users = [
    { email: 'admin@acme.test', role: 'admin', tenantSlug: 'acme' },
    { email: 'user@acme.test', role: 'member', tenantSlug: 'acme' },
    { email: 'admin@globex.test', role: 'admin', tenantSlug: 'globex' },
    { email: 'user@globex.test', role: 'member', tenantSlug: 'globex' },
  ];
  for (const u of users) {
    await User.findOneAndUpdate(
      { email: u.email },
      { ...u, passwordHash },
      { upsert: true, new: true }
    );
  }
}
