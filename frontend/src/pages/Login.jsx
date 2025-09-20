import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

export default function Login() {
  const [email, setEmail] = useState('admin@acme.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const text = await res.text()
      let data = null; try { data = text ? JSON.parse(text) : null } catch {}
      if (!res.ok) throw new Error(data?.error || `Login failed (HTTP ${res.status})`)
      if (!data?.token) throw new Error('Malformed response from server')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="container-page">
      {/* center the card on the page */}
      <div className="min-h-[70vh] flex items-center justify-center">
        <section className="card w-full max-w-md">
          <div className="card-padding">
            {/* header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
              <p className="text-slate-600 mt-1">Sign in to continue to <span className="font-semibold">SaaS Notes</span></p>
            </div>

            {/* form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button className="btn btn-primary w-full py-3" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* error / help */}
            {error && (
              <div className="mt-4 text-sm bg-red-100 border border-red-200 text-red-900 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="mt-5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="font-semibold mb-1">Test accounts</div>
              <div>admin@acme.test • user@acme.test</div>
              <div>admin@globex.test • user@globex.test</div>
              <div>password: <b>password</b></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
