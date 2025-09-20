import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRouter from './routes/auth.js'
import notesRouter from './routes/notes.js'
import tenantsRouter from './routes/tenants.js'

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

import usersRouter from './routes/users.js'
// ...
app.use('/users', usersRouter)


// connect once on boot (optional — the route files also connect as needed)
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => {
  console.error('MongoDB connect error:', err.message)
})

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// routes
app.use('/auth', authRouter)
app.use('/notes', notesRouter)
app.use('/tenants', tenantsRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
