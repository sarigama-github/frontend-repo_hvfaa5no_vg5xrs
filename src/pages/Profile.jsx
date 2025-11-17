import { useEffect, useState } from 'react'
import { api, getToken } from '../utils/api'

export default function Profile(){
  const [me, setMe] = useState(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  useEffect(()=>{
    const t = getToken()
    if(!t){ window.location.href = '/'; return }
    api('/me', {auth:true}).then((u)=>{ setMe(u); setName(u.name || '') })
  },[])

  const save = async ()=>{
    try{
      const u = await api('/me', { method:'PUT', auth:true, body:{ name } })
      setMe(u)
      setStatus('Saved!')
      setTimeout(()=>setStatus(''), 1500)
    }catch(e){ alert(e.message) }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-10">
        <a href="/dashboard" className="text-sm underline">← Back</a>
        <h1 className="mt-4 text-2xl font-bold">Your Profile</h1>
        <div className="mt-6 max-w-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-sm text-slate-300">Email</div>
          <div className="mt-1">{me?.email}</div>
          <div className="mt-6 text-sm text-slate-300">Name</div>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full bg-transparent border border-white/20 rounded px-3 py-2 outline-none focus:border-white/40" />
          <button onClick={save} className="mt-4 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600">Save</button>
          {status && <div className="mt-2 text-emerald-400 text-sm">{status}</div>}
        </div>
      </div>
    </div>
  )
}