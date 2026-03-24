import { useState, useMemo } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { trainingData, CONFIG } from '../data/trainingData'

// ─── Aggression score ─────────────────────────────────────────────────────────
// For each sport: aggression = distance × avg_speed (km/h)
//   = distance² / (time_min / 60)
// This captures both volume (more km) AND intensity (faster pace) in one number.
// A harder, longer session scores higher than an easy short one.
// ─────────────────────────────────────────────────────────────────────────────

function aggression(distKm, timeMin) {
  if (!distKm || !timeMin) return 0
  const speedKmh = distKm / (timeMin / 60)
  return +(distKm * speedKmh).toFixed(2) // km²/h
}

function speed(distKm, timeMin) {
  if (!distKm || !timeMin) return 0
  return +(distKm / (timeMin / 60)).toFixed(2)
}

// ─── Sport palette (matches existing DayCard colour tokens) ──────────────────
const SPORTS = [
  {
    key: 'overall',
    label: 'Overall',
    color: '#a78bfa',  // violet
    barColor: '#7c3aed',
  },
  {
    key: 'swim',
    label: 'Swim',
    color: '#38bdf8',  // sky-400
    barColor: '#0369a1',
  },
  {
    key: 'bike',
    label: 'Bike',
    color: '#4ade80',  // green-400
    barColor: '#15803d',
  },
  {
    key: 'run',
    label: 'Run',
    color: '#f87171',  // red-400
    barColor: '#b91c1c',
  },
]

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, sport }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-white/10 bg-navy-900/95 p-3 text-xs shadow-xl backdrop-blur">
      <p className="mb-2 font-semibold text-white/80">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-white/60">{entry.name}:</span>
          <span className="font-mono font-semibold text-white">
            {entry.value}
            {entry.name.includes('km') ? ' km' : ''}
            {entry.name.includes('Speed') ? ' km/h' : ''}
            {entry.name.includes('Time') ? ' min' : ''}
            {entry.name.includes('Aggression') ? '' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProgressionChart() {
  const [activeSport, setActiveSport] = useState('overall')

  // Build per-week aggregated data (only completed workouts)
  const weeklyData = useMemo(() => {
    return trainingData.weeks.map((week) => {
      const done = week.days.filter((d) => d.completed)

      const sD = done.reduce((s, d) => s + (d.swim?.distance || 0), 0)
      const sT = done.reduce((s, d) => s + (d.swim?.time || 0), 0)
      const bD = done.reduce((s, d) => s + (d.bike?.distance || 0), 0)
      const bT = done.reduce((s, d) => s + (d.bike?.time || 0), 0)
      const rD = done.reduce((s, d) => s + (d.run?.distance || 0), 0)
      const rT = done.reduce((s, d) => s + (d.run?.time || 0), 0)

      const totalDist = +(sD + bD + rD).toFixed(1)
      const totalTime = sT + bT + rT

      return {
        week: `W${week.weekNumber}`,
        dateRange: week.dateRange,
        hasData: done.length > 0,
        // per-sport metrics
        swim: {
          dist: +sD.toFixed(2),
          time: sT,
          speed: speed(sD, sT),
          aggression: aggression(sD, sT),
        },
        bike: {
          dist: +bD.toFixed(1),
          time: bT,
          speed: speed(bD, bT),
          aggression: aggression(bD, bT),
        },
        run: {
          dist: +rD.toFixed(2),
          time: rT,
          speed: speed(rD, rT),
          aggression: aggression(rD, rT),
        },
        overall: {
          dist: totalDist,
          time: totalTime,
          speed: speed(totalDist, totalTime),
          aggression: +(
            aggression(sD, sT) +
            aggression(bD, bT) +
            aggression(rD, rT)
          ).toFixed(1),
        },
      }
    })
  }, [])

  // Only show weeks that have at least some completed data
  const chartData = useMemo(
    () =>
      weeklyData
        .filter((w) => w.hasData)
        .map((w) => {
          const s = w[activeSport]
          return {
            week: w.week,
            label: `${w.week} · ${w.dateRange}`,
            Distance: s.dist,
            Speed: s.speed,
            Aggression: s.aggression,
          }
        }),
    [weeklyData, activeSport]
  )

  const sport = SPORTS.find((s) => s.key === activeSport)

  // Race target distances for reference line label
  const targetDist = {
    swim: CONFIG.raceDistances.swim,
    bike: CONFIG.raceDistances.bike,
    run: CONFIG.raceDistances.run,
    overall:
      CONFIG.raceDistances.swim +
      CONFIG.raceDistances.bike +
      CONFIG.raceDistances.run,
  }[activeSport]

  const maxAggression = Math.max(...chartData.map((d) => d.Aggression), 1)

  return (
    <section className="rounded-2xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          Progression
        </h2>
        <p className="mt-0.5 text-base font-bold text-white">
          Training Intensity Over Time
        </p>
        <p className="mt-1 text-xs text-white/40">
          Bars = distance · Line = avg speed (km/h) · Shaded = aggression score
          (dist × speed)
        </p>
      </div>

      {/* Sport tabs */}
      <div className="mb-4 flex gap-1.5">
        {SPORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSport(s.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeSport === s.key
                ? 'text-navy-950'
                : 'text-white/50 hover:bg-white/8 hover:text-white/80'
            }`}
            style={
              activeSport === s.key
                ? { background: s.color }
                : {}
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-white/30">
          No completed workouts yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            {/* Left axis: distance */}
            <YAxis
              yAxisId="dist"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}km`}
              width={42}
            />
            {/* Right axis: speed */}
            <YAxis
              yAxisId="speed"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
              width={36}
            />
            <Tooltip
              content={<CustomTooltip sport={activeSport} />}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}
              iconSize={8}
            />

            {/* Distance bars */}
            <Bar
              yAxisId="dist"
              dataKey="Distance"
              name="Distance (km)"
              fill={sport.barColor}
              radius={[3, 3, 0, 0]}
              maxBarSize={36}
              opacity={0.85}
            />

            {/* Aggression area under speed line */}
            <Bar
              yAxisId="dist"
              dataKey="Aggression"
              name="Aggression Score"
              fill={sport.color}
              radius={[3, 3, 0, 0]}
              maxBarSize={36}
              opacity={0.25}
              hide={false}
            />

            {/* Speed trend line */}
            <Line
              yAxisId="speed"
              dataKey="Speed"
              name="Avg Speed (km/h)"
              stroke={sport.color}
              strokeWidth={2}
              dot={{ r: 3, fill: sport.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: sport.color }}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {/* Legend explainer */}
      <div className="mt-3 flex flex-wrap gap-3 border-t border-white/6 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: sport.barColor, opacity: 0.85 }}
          />
          Distance (km) per week
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: sport.color, opacity: 0.25 }}
          />
          Aggression score (dist × speed)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <span
            className="inline-block h-0.5 w-4 rounded-full"
            style={{ background: sport.color }}
          />
          Avg speed (km/h)
        </div>
        <div className="ml-auto text-xs text-white/25">
          Race target:{' '}
          <span className="font-mono text-white/40">{targetDist} km</span>
        </div>
      </div>
    </section>
  )
}
