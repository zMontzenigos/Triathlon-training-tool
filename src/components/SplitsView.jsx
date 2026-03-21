import { useState } from 'react'

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

function SwimSplits({ swim }) {
  return (
    <div className="space-y-3">
      {swim.setBreakdown && (
        <div>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sets</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left pb-1 font-medium">#</th>
                <th className="text-left pb-1 font-medium">Distance</th>
                <th className="text-left pb-1 font-medium">Time</th>
                {swim.setAvgHR && <th className="text-left pb-1 font-medium">Avg HR</th>}
              </tr>
            </thead>
            <tbody>
              {swim.setBreakdown.map((set, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-1 pr-3 text-white/40 font-mono text-xs">{i + 1}</td>
                  <td className="py-1 pr-3 text-white/80 font-medium">{set}</td>
                  <td className="py-1 pr-3 font-mono text-white/70">{swim.setTimes?.[i] || '—'}</td>
                  {swim.setAvgHR && (
                    <td className="py-1 text-red-400 font-mono text-xs">
                      {swim.setAvgHR[i] ? `${swim.setAvgHR[i]} bpm` : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {swim.lapTimes && swim.lapTimes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Lap Times ({swim.lapLength})
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1">
            {swim.lapTimes.map((t, i) => (
              <div
                key={i}
                className="bg-white/5 rounded px-1 py-1 text-center font-mono text-xs text-white/60"
                title={swim.lapStrokes?.[i] ? `${swim.lapStrokes[i]} strokes` : undefined}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RunSplits({ run }) {
  return (
    <div>
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Km Splits</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-xs uppercase tracking-wider">
            <th className="text-left pb-1 font-medium">Km</th>
            <th className="text-left pb-1 font-medium">Split</th>
            <th className="text-left pb-1 font-medium">HR</th>
          </tr>
        </thead>
        <tbody>
          {run.kmSplits.map((split, i) => (
            <tr key={i} className="border-t border-white/5">
              <td className="py-1 pr-3 text-white/40 font-mono text-xs">{i + 1}km</td>
              <td className="py-1 pr-3 font-mono text-white/80">{split}</td>
              <td className="py-1 font-mono text-red-400 text-xs">
                {run.kmSplitHR?.[i] ? `${run.kmSplitHR[i]}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {run.avgPace && (
        <p className="mt-2 text-xs text-white/50">
          <span className="text-white/70 font-semibold">Avg Pace:</span> {run.avgPace}
        </p>
      )}
    </div>
  )
}

function BikeSplits({ bike }) {
  return (
    <div className="flex gap-6 text-sm">
      <div>
        <span className="text-white/50 text-xs uppercase tracking-wider">Avg HR</span>
        <p className="font-mono text-red-400 font-semibold">{bike.avgHR} bpm</p>
      </div>
      {bike.maxHR && (
        <div>
          <span className="text-white/50 text-xs uppercase tracking-wider">Max HR</span>
          <p className="font-mono text-red-400 font-semibold">{bike.maxHR} bpm</p>
        </div>
      )}
    </div>
  )
}

export default function SplitsView({ splits }) {
  const [open, setOpen] = useState(false)
  if (!splits) return null

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-expanded={open}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        View Splits
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 space-y-4">
          {splits.swim && <SwimSplits swim={splits.swim} />}
          {splits.run && <RunSplits run={splits.run} />}
          {splits.bike && <BikeSplits bike={splits.bike} />}
        </div>
      )}
    </div>
  )
}
