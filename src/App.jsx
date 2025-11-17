import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { api, setToken, getToken, API_BASE } from './utils/api'

function App() {
  const [email, setEmail] = useState('')
  const [magicUrl, setMagicUrl] = useState('')
  const [me, setMe] = useState(null)
  const token = getToken()

  useEffect(() => {
    if (!token) return
    api('/me', { auth: true })
      .then(setMe)
      .catch(() => {})
  }, [token])

  const requestLink = async (e) => {
    e.preventDefault()
    const res = await api('/auth/magic-link/request', { method: 'POST', body: { email } })
    setMagicUrl(res.login_url)
  }

  const handleDemoLogin = async () => {
    const url = new URL(magicUrl)
    const tokenParam = url.searchParams.get('token')
    if (!tokenParam) return
    const res = await api(`/auth/magic-link/verify?token=${tokenParam}`)
    setToken(res.token)
    window.location.reload()
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-70">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-16">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">HoloID SaaS Starter</h1>
          <div className="text-sm opacity-80">Backend: {API_BASE}</div>
        </header>
        <main className="mt-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Build a modern SaaS with auth, billing, and a gorgeous 3D hero</h2>
            <p className="mt-4 text-slate-300">Email-based magic link login, a protected dashboard, profile editing, and Stripe subscriptions.</p>
            {!me ? (
              <form onSubmit={requestLink} className="mt-8 max-w-md bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <label className="block text-sm mb-2">Sign in with your email</label>
                <div className="flex gap-2">
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-transparent border border-white/20 rounded px-3 py-2 outline-none focus:border-white/40" />
                  <button className="bg-indigo-500 hover:bg-indigo-600 rounded px-4">Send Link</button>
                </div>
                {magicUrl && (
                  <div className="mt-4 text-xs text-slate-300">
                    Dev shortcut: magic link generated. Use the button to auto-complete login.
                    <div className="mt-2 flex gap-2">
                      <a href={magicUrl} className="underline break-all">{magicUrl}</a>
                      <button type="button" onClick={handleDemoLogin} className="px-2 py-1 bg-emerald-500/80 rounded">Complete Login</button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-sm text-slate-300">Signed in as</div>
                <div className="text-lg">{me.email}</div>
                <a href="/dashboard" className="inline-block mt-4 bg-indigo-500 hover:bg-indigo-600 rounded px-4 py-2">Go to dashboard</a>
              </div>
            )}
          </div>
          <div className="hidden md:block" />
        </main>
      </div>
    </div>
  )
}

export default App