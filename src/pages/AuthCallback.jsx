import { useEffect, useState } from 'react'
import { api, setToken } from '../utils/api'

export default function AuthCallback(){
  const [status, setStatus] = useState('Verifying magic link...')

  useEffect(()=>{
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    if(!token){ setStatus('Missing token'); return }
    api(`/auth/magic-link/verify?token=${encodeURIComponent(token)}`)
      .then(res=>{
        setToken(res.token)
        setStatus('Success! Redirecting...')
        setTimeout(()=>{ window.location.href = '/dashboard' }, 600)
      })
      .catch(e=> setStatus(e.message || 'Verification failed'))
  },[])

  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
      <div className="text-slate-300">{status}</div>
    </div>
  )
}