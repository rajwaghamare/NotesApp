import jwt from 'jsonwebtoken';
import { setCORS } from './cors.js';

export function requireAuth(handler) {
  return async (req, res) => {
    setCORS(res);
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      req.user = payload;
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    return handler(req, res);
  });
}
