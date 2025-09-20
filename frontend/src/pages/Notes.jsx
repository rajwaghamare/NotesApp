import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function Notes() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function load() {
    setError(''); setInfo('')
    const res = await fetch(`${API}/notes`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) return setError(data?.error || 'Failed to load')
    setNotes(data)
  }
  useEffect(() => { load() }, [])

  async function createNote(e) {
    e.preventDefault()
    setError(''); setInfo('')
    const res = await fetch(`${API}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content })
    })
    if (res.status === 403) {
      const data = await res.json()
      if (data?.code === 'LIMIT_REACHED') {
        setInfo('Free plan limit reached. ' + (user.role === 'admin' ? 'You can upgrade to Pro.' : 'Ask your admin to upgrade.'))
        return
      }
    }
    const data = await res.json()
    if (!res.ok) return setError(data?.error || 'Failed to create')
    setTitle(''); setContent(''); await load()
  }

  async function del(id) {
    setError(''); setInfo('')
    const res = await fetch(`${API}/notes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 204) return load()
    const data = await res.json()
    setError(data?.error || 'Failed to delete')
  }

  async function upgrade() {
    setError(''); setInfo('')
    if (user.role !== 'admin') return setError('Only admin can upgrade')
    const res = await fetch(`${API}/tenants/${user.tenantSlug}/upgrade`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (!res.ok) return setError(data?.error || 'Upgrade failed')
    setInfo('Tenant upgraded to Pro. You can create unlimited notes now.')
  }

  return (
    <div className="stack">
      {/* Composer */}
      <section className="card">
        <div className="card-padding space-y-4">
          <h3 className="h2">New Note</h3>
          <form onSubmit={createNote} className="space-y-3">
            <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea className="textarea" rows={6} placeholder="Content (optional)" value={content} onChange={e=>setContent(e.target.value)} />
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" type="submit">Create</button>
              {info.includes('Free plan') && user.role === 'admin' && (
                <button className="btn" type="button" onClick={upgrade}>Upgrade to Pro</button>
              )}
            </div>
          </form>
          {error && <div className="text-sm bg-red-100 border border-red-200 text-red-900 rounded-xl px-3 py-2">{error}</div>}
          {info && <div className="text-sm bg-blue-100 border border-blue-200 text-blue-900 rounded-xl px-3 py-2">{info}</div>}
        </div>
      </section>

      {/* Notes grid */}
      <section className="notes-grid">
        {notes.map(n => (
          <article key={n._id} className="note-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="note-title">{n.title}</div>
                {n.content && <div className="note-body mt-1">{n.content}</div>}
              </div>
              <button className="btn btn-danger" onClick={()=>del(n._id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
