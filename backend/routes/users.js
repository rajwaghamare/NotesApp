import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { connectDB } from '../lib/db.js'
import { User } from '../lib/models.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// POST /users/invite  { email, role }  (role = 'member' | 'admin')
router.post('/invite', requireAuth, requireAdmin, async (req, res) => {
  await connectDB()
  const { email, role = 'member' } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  if (!['member','admin'].includes(role)) return res.status(400).json({ error: 'invalid role' })

  const tenantSlug = req.user.tenantSlug
  const passwordHash = bcrypt.hashSync('password', 10) // assignment says fixed password ok

  // do not allow cross-tenant creation
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ error: 'user already exists' })

  const user = await User.create({ email, role, tenantSlug, passwordHash })
  res.status(201).json({ message: 'invited', user: { email: user.email, role: user.role, tenantSlug: user.tenantSlug } })
})

export default router
