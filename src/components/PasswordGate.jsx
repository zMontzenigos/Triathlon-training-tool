import { useState } from 'react'
import { CONFIG } from '../data/trainingData'

const STORAGE_KEY = 'tri_auth'

export function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEY) === btoa(CONFIG.password)
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated)
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (input === CONFIG.password) {
      localStorage.setItem(STORAGE_KEY, btoa(CONFIG.password))
      setAuthed(true)
    } else {
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  if (authed) return children

  return (
    <div className="min-h-dvh bg-navy-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-[#0f1729]" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-8 text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="text-lg font-bold text-white mb-1">Triathlon Training</h1>
          <p className="text-sm text-white/40 mb-6">Enter password to continue</p>

          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`
                w-full px-4 py-3 rounded-xl bg-white/[0.07] border text-white placeholder-white/25
                text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                transition-all duration-150
                ${shake ? 'border-red-500/60 animate-[shake_0.4s_ease-in-out]' : 'border-white/10'}
              `}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
