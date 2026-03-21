import Header from './components/Header'
import OverallSummary from './components/OverallSummary'
import WeekSection from './components/WeekSection'
import { trainingData } from './data/trainingData'

export default function App() {
  // Find the first week that has incomplete days (the current week)
  const currentWeekIndex = trainingData.weeks.findIndex((w) =>
    w.days.some((d) => !d.completed)
  )
  const activeIdx = currentWeekIndex === -1 ? trainingData.weeks.length - 1 : currentWeekIndex

  return (
    <div className="min-h-dvh bg-navy-950 font-sans">
      {/* Page background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-[#0f1729] pointer-events-none" aria-hidden="true" />

      <main className="relative max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Header />
        <OverallSummary />

        <section aria-label="Training weeks" className="space-y-3">
          {trainingData.weeks.map((week, idx) => (
            <WeekSection
              key={week.weekNumber}
              week={week}
              // Open current week and all future weeks; collapse completed past weeks
              defaultOpen={idx >= activeIdx}
            />
          ))}
        </section>

        <footer className="text-center text-xs text-white/20 pt-4 pb-8">
          Data lives in <code className="font-mono text-white/30">src/data/trainingData.js</code>
        </footer>
      </main>
    </div>
  )
}
