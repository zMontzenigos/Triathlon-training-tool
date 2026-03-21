import { useMemo } from 'react'
import { trainingData } from '../data/trainingData'

function calcMetrics(days) {
  return days
    .filter((d) => d.completed)
    .reduce(
      (acc, d) => ({
        swimDist: acc.swimDist + (d.swim?.distance || 0),
        swimTime: acc.swimTime + (d.swim?.time || 0),
        bikeDist: acc.bikeDist + (d.bike?.distance || 0),
        bikeTime: acc.bikeTime + (d.bike?.time || 0),
        runDist: acc.runDist + (d.run?.distance || 0),
        runTime: acc.runTime + (d.run?.time || 0),
        calories: acc.calories + (d.calories || 0),
        workouts: acc.workouts + (d.workouts || 0),
      }),
      { swimDist: 0, swimTime: 0, bikeDist: 0, bikeTime: 0, runDist: 0, runTime: 0, calories: 0, workouts: 0 }
    )
}

export function useWeekMetrics(week) {
  return useMemo(() => {
    const m = calcMetrics(week.days)
    const total = m.swimTime + m.bikeTime + m.runTime
    return {
      swim: { dist: m.swimDist.toFixed(1), time: m.swimTime },
      bike: { dist: m.bikeDist.toFixed(1), time: m.bikeTime },
      run: { dist: m.runDist.toFixed(1), time: m.runTime },
      total,
      calories: m.calories,
      workouts: m.workouts,
    }
  }, [week])
}

export function useOverallMetrics() {
  return useMemo(() => {
    const allDays = trainingData.weeks.flatMap((w) => w.days)
    const m = calcMetrics(allDays)
    const total = m.swimTime + m.bikeTime + m.runTime
    const hours = Math.floor(total / 60)
    const mins = total % 60
    return {
      swim: { dist: m.swimDist.toFixed(1), time: m.swimTime },
      bike: { dist: m.bikeDist.toFixed(1), time: m.bikeTime },
      run: { dist: m.runDist.toFixed(1), time: m.runTime },
      total,
      totalFormatted: `${hours}h ${mins}min`,
      calories: m.calories,
    }
  }, [])
}
