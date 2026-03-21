import { useOverallMetrics } from '../hooks/useTrainingMetrics'

function DisciplineCard({ label, dist, time, color, bgColor, icon }) {
  return (
    <div className={`rounded-xl p-4 border ${bgColor} text-center`}>
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          {icon}
        </svg>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</p>
      </div>
      <p className={`text-3xl font-bold font-mono ${color}`}>{dist} km</p>
      <p className="text-sm text-white/40 mt-1">{time} min</p>
    </div>
  )
}

const SwimIcon = <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
const BikeIcon = <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
const RunIcon = <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />

export default function OverallSummary() {
  const m = useOverallMetrics()

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
        Overall Training Summary
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <DisciplineCard
          label="Swim"
          dist={m.swim.dist}
          time={m.swim.time}
          color="text-swim"
          bgColor="bg-swim/10 border-swim/20"
          icon={SwimIcon}
        />
        <DisciplineCard
          label="Bike"
          dist={m.bike.dist}
          time={m.bike.time}
          color="text-bike"
          bgColor="bg-bike/10 border-bike/20"
          icon={BikeIcon}
        />
        <DisciplineCard
          label="Run"
          dist={m.run.dist}
          time={m.run.time}
          color="text-run"
          bgColor="bg-run/10 border-run/20"
          icon={RunIcon}
        />
      </div>

      <div className="flex flex-wrap gap-6 justify-center text-sm text-white/50 pt-3 border-t border-white/[0.08]">
        <span>
          Total time:{' '}
          <span className="text-white/80 font-semibold font-mono">{m.totalFormatted}</span>
        </span>
        <span>
          Calories:{' '}
          <span className="text-orange-400 font-semibold">{m.calories.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )
}
