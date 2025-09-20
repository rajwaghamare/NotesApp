import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container-page py-4 flex items-center justify-between">
          <Link to="/" className="h1">SaaS Notes</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="badge">{user.email} — {user.role} @ {user.tenantSlug}</span>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : <Link className="btn" to="/login">Login</Link>}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  )
}
