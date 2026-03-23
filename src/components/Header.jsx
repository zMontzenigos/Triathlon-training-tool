import { useState, useEffect } from 'react'
import { CONFIG } from '../data/trainingData'

function useCountdown(raceDate) {
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    function calc() {
      const now = new Date()
      const race = new Date(raceDate)
      const diffMs = race - now
      if (diffMs <= 0) return setCountdown({ weeks: 0, days: 0, display: 'Race Day!' })
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)
      const days = diffDays % 7
      setCountdown({ weeks, days, display: days > 0 ? `${weeks}w ${days}d` : `${weeks}w` })
    }
    calc()
    const t = setInterval(calc, 60_000)
    return () => clearInterval(t)
  }, [raceDate])

  return countdown
}

function formatRaceDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Header() {
  const countdown = useCountdown(CONFIG.raceDate)
  const { swim, bike, run } = CONFIG.raceDistances

  function jumpToToday() {
    const today = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`

    const target = document.querySelector(`[data-date="${dateStr}"]`)
    if (target) {
      // Expand parent week section if needed
      const weekContent = target.closest('[data-week-content]')
      if (weekContent && weekContent.dataset.collapsed === 'true') {
        weekContent.querySelector('[data-week-toggle]')?.click()
      }
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        target.classList.add('ring-2', 'ring-emerald-400/60')
        setTimeout(() => target.classList.remove('ring-2', 'ring-emerald-400/60'), 2500)
      }, 150)
    }
  }

  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 border border-white/10 px-6 py-8 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" aria-hidden="true" />

      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
        {CONFIG.raceName}
      </p>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 leading-tight">
        Training Dashboard
      </h1>
      <p className="text-white/40 text-sm mb-6">{CONFIG.raceLocation}</p>

      {/* Race stats */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
        <div className="text-center">
          {countdown ? (
            <p className="text-3xl font-extrabold font-mono text-emerald-400">{countdown.display}</p>
          ) : (
            <p className="text-3xl font-extrabold font-mono text-white/20 animate-pulse">—</p>
          )}
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wide">to Race</p>
        </div>

        <div className="w-px bg-white/10 hidden sm:block self-stretch" aria-hidden="true" />

        <div className="text-center">
          <p className="text-xl font-bold text-white/80">{formatRaceDate(CONFIG.raceDate)}</p>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wide">Race Day</p>
        </div>

        <div className="w-px bg-white/10 hidden sm:block self-stretch" aria-hidden="true" />

        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-mono font-bold text-swim">{swim}</span>
            <span className="text-white/20 text-sm">/</span>
            <span className="font-mono font-bold text-bike">{bike}</span>
            <span className="text-white/20 text-sm">/</span>
            <span className="font-mono font-bold text-run">{run}</span>
          </div>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wide">Swim / Bike / Run km</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={jumpToToday}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold text-sm transition-colors duration-150 shadow-lg shadow-emerald-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Jump to Today
        </button>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/5 text-white font-semibold text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          aria-label="Refresh"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </header>
  )
}
