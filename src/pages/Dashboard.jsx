import { useEffect, useState } from 'react'
import { api, getToken } from '../utils/api'

export default function Dashboard(){
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const t = getToken()
    if(!t){
      window.location.href = '/'
      return
    }
    api('/me', {auth:true}).then((u)=>{ setMe(u); setLoading(false) }).catch(e=>{ setError(e.message); setLoading(false) })
  }, [])

  const startCheckout = async (priceId) => {
    try{
      const success_url = window.location.origin + '/dashboard?status=success'
      const cancel_url = window.location.origin + '/dashboard?status=cancel'
      const res = await api('/billing/create-checkout-session', { method:'POST', auth:true, body:{ price_id: priceId, success_url, cancel_url }})
      window.location.href = res.url
    }catch(e){
      alert(e.message)
    }
  }

  const openPortal = async ()=>{
    try{
      const res = await api('/billing/portal', { method:'POST', auth:true })
      window.location.href = res.url
    }catch(e){ alert(e.message) }
  }

  if(loading) return <div className="min-h-screen grid place-items-center text-white">Loading...</div>
  if(error) return <div className="min-h-screen grid place-items-center text-red-400">{error}</div>

  const monthly = import.meta.env.VITE_STRIPE_PRICE_MONTHLY || ''
  const yearly = import.meta.env.VITE_STRIPE_PRICE_YEARLY || ''

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <a href="/profile" className="text-sm underline">Profile</a>
        </header>
        <section className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold">Welcome</h2>
            <div className="mt-2 text-slate-300">{me?.email}</div>
            <div className="mt-4 text-sm text-slate-400">Subscription status: {me?.subscriptionStatus || 'none'}</div>
            {me?.currentPeriodEnd && (
              <div className="text-sm text-slate-400">Renews: {new Date(me.currentPeriodEnd).toLocaleString()}</div>
            )}
            <div className="mt-6 flex gap-3">
              <button onClick={()=>openPortal()} className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600">Manage billing</button>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <p className="mt-1 text-slate-300">Choose a plan to unlock premium features.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 p-4">
                <div className="font-semibold">Monthly</div>
                <div className="text-sm text-slate-300">Billed monthly</div>
                <button disabled={!monthly} onClick={()=>startCheckout(monthly)} className="mt-4 w-full px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50">Start trial</button>
                {!monthly && <div className="mt-2 text-xs text-amber-400">Set VITE_STRIPE_PRICE_MONTHLY</div>}
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <div className="font-semibold">Yearly</div>
                <div className="text-sm text-slate-300">Billed annually</div>
                <button disabled={!yearly} onClick={()=>startCheckout(yearly)} className="mt-4 w-full px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50">Start trial</button>
                {!yearly && <div className="mt-2 text-xs text-amber-400">Set VITE_STRIPE_PRICE_YEARLY</div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}