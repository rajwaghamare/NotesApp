import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import { User } from '../lib/models.js';
import { ensureSeed } from '../lib/seed.js';

const router = Router();

// POST /auth/login
router.post('/login', async (req, res) => {
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

    res.json({ token, user: { email: user.email, role: user.role, tenantSlug: user.tenantSlug } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
