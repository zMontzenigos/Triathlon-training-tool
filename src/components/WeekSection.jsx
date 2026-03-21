import { useState } from 'react'
import DayCard from './DayCard'
import { useWeekMetrics } from '../hooks/useTrainingMetrics'

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function MetricPill({ emoji, label, dist, time, color }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`font-bold ${color}`}>{dist}km</span>
      <span className="text-white/30">/</span>
      <span className="text-white/50">{time}min</span>
    </div>
  )
}

export default function WeekSection({ week, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const metrics = useWeekMetrics(week)
  const isComplete = week.days.every((d) => d.completed)

  const headerBg = isComplete
    ? 'bg-emerald-900/40 hover:bg-emerald-900/50 border-emerald-700/40'
    : 'bg-white/[0.06] hover:bg-white/[0.09] border-white/10'

  const headerText = isComplete ? 'text-emerald-300' : 'text-white/90'

  return (
    <section className="rounded-2xl overflow-hidden border border-white/[0.08] backdrop-blur-sm">
      {/* Week header — clickable */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 ${headerBg} border-b border-white/[0.06] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 text-left">
          <ChevronIcon open={open} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-bold ${headerText}`}>
                Week {week.weekNumber} · {week.dateRange}
              </span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
                  Complete
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">{week.focus}</p>
          </div>
        </div>

        {/* Compact metrics */}
        <div className="hidden sm:flex items-center gap-4 text-xs shrink-0 mr-2">
          {parseFloat(metrics.swim.dist) > 0 && (
            <MetricPill color="text-swim" dist={metrics.swim.dist} time={metrics.swim.time} />
          )}
          {parseFloat(metrics.bike.dist) === 0 && metrics.bike.time > 0 && (
            <span className="text-bike font-bold text-xs">{metrics.bike.time}min bike</span>
          )}
          {parseFloat(metrics.bike.dist) > 0 && (
            <MetricPill color="text-bike" dist={metrics.bike.dist} time={metrics.bike.time} />
          )}
          {parseFloat(metrics.run.dist) > 0 && (
            <MetricPill color="text-run" dist={metrics.run.dist} time={metrics.run.time} />
          )}
          {metrics.total > 0 && (
            <span className="text-white/30 text-xs">{metrics.total}min total</span>
          )}
        </div>
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="bg-navy-900/60">
          {/* Week metrics summary */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.04] border-b border-white/[0.06]">
            {[
              { label: 'Swim', dist: metrics.swim.dist, time: metrics.swim.time, color: 'text-swim' },
              { label: 'Bike', dist: metrics.bike.dist, time: metrics.bike.time, color: 'text-bike' },
              { label: 'Run', dist: metrics.run.dist, time: metrics.run.time, color: 'text-run' },
            ].map(({ label, dist, time, color }) => (
              <div key={label} className="bg-navy-900/80 px-4 py-3 text-center">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-lg font-bold ${color} font-mono`}>{dist} km</p>
                <p className="text-xs text-white/40">{time} min</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 bg-navy-900/40 border-b border-white/[0.06] flex gap-6 text-xs text-white/50">
            <span>
              Total: <span className="text-white/70 font-semibold">{metrics.total} min</span>
            </span>
            <span>
              Workouts: <span className="text-white/70 font-semibold">{metrics.workouts}</span>
            </span>
            {metrics.calories > 0 && (
              <span>
                Calories: <span className="text-orange-400 font-semibold">{metrics.calories.toLocaleString()}</span>
              </span>
            )}
          </div>

          {/* Day cards */}
          <div className="p-4 space-y-3">
            {week.days.map((day, i) => (
              <DayCard key={i} day={day} id={`w${week.weekNumber}d${i}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
