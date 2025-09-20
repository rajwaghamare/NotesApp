import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { setCORS, handlePreflight } from '../lib/cors.js';
import { connectDB } from '../lib/db.js';
import { User } from '../lib/models.js';
import { ensureSeed } from '../lib/seed.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORS(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    await ensureSeed();

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: String(user._id), email: user.email, role: user.role, tenantSlug: user.tenantSlug },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: { email: user.email, role: user.role, tenantSlug: user.tenantSlug }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
