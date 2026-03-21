import SplitsView from './SplitsView'

const TYPE_STYLES = {
  swim:     { border: 'border-l-swim',     badge: 'bg-swim/20 text-swim border border-swim/30',     label: 'Swim' },
  bike:     { border: 'border-l-bike',     badge: 'bg-bike/20 text-bike border border-bike/30',     label: 'Bike' },
  run:      { border: 'border-l-run',      badge: 'bg-run/20 text-run border border-run/30',        label: 'Run' },
  brick:    { border: 'border-l-brick',    badge: 'bg-brick/20 text-brick border border-brick/30',  label: 'Brick' },
  climbing: { border: 'border-l-climbing', badge: 'bg-climbing/20 text-climbing border border-climbing/30', label: 'Climbing' },
  rest:     { border: 'border-l-white/20', badge: 'bg-white/10 text-white/50 border border-white/10', label: 'Rest' },
}

export default function DayCard({ day, id }) {
  const style = TYPE_STYLES[day.type] || TYPE_STYLES.rest

  return (
    <div
      id={id}
      data-date={day.date}
      className={`
        relative rounded-xl border-l-4 ${style.border}
        ${day.completed
          ? 'bg-white/[0.06] border border-l-0 border-white/10'
          : 'bg-white/[0.03] border border-l-0 border-white/5'
        }
        p-4 transition-shadow duration-200
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-white/90 leading-tight">
            {day.date}
          </h3>
          {day.completed && (
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Completed">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${style.badge}`}>
          {style.label}
        </span>
      </div>

      {/* Workout title */}
      <p className="text-sm font-semibold text-white/80 mb-2 leading-snug">{day.title}</p>

      {/* Details (HTML) */}
      <div
        className="text-sm text-white/60 leading-relaxed [&_strong]:text-white/80 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: day.details }}
      />

      {/* Stats row */}
      {(day.avgHR || day.calories > 0) && (
        <div className="flex gap-4 mt-3 text-xs text-white/40">
          {day.avgHR && (
            <span>
              <span className="text-red-400 font-semibold">{day.avgHR}</span> avg bpm
              {day.maxHR && <span> · <span className="text-red-400">{day.maxHR}</span> max</span>}
            </span>
          )}
          {day.calories > 0 && (
            <span><span className="text-orange-400 font-semibold">{day.calories.toLocaleString()}</span> cal</span>
          )}
        </div>
      )}

      {/* Notes */}
      {day.notes && (
        <div className="mt-3 pl-3 border-l-2 border-white/15 text-xs text-white/50 italic leading-relaxed">
          {day.notes}
        </div>
      )}

      {/* Splits */}
      {day.completed && day.splits && <SplitsView splits={day.splits} />}
    </div>
  )
}
