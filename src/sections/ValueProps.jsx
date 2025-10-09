import { PuzzleIcon, LayersIcon, LightningIcon, AIIcon } from '../components/icons.jsx'
import { SectionHeader } from '../components/SectionHeader.jsx'

const values = [
  {
    icon: <LightningIcon size={22} />,
    title: 'Predictable events',
    copy: 'All state transitions run through pure events and interceptors, giving you replayable, inspectable updates. Business logic stays pure; effects are explicit. That makes behavior auditable and testable at scale.',
  },
  {
    icon: <LayersIcon size={22} />,
    title: 'Composable architecture',
    copy: 'Grow features by composing events, subscriptions, and effects. Patterns stay local, predictable and scale gracefully as complexity rises.',
  },
  {
    icon: <PuzzleIcon size={22} />,
    title: 'Reactive subscriptions',
    copy: 'Express derived data declaratively. React components re-render only when their data changes.',
  },
  {
    icon: <AIIcon size={22} />,
    title: 'AI Friendly',
    copy: 'Reviewing AI-generated changes is easier because all logic is expressed through pure, isolated functions, making each change understandable, verifiable, and deterministic.',
  },
]
export function ValueProps() {
  return (
    <section className="section" id="why">
      <SectionHeader
        eyebrow="Why Reflex"
        title="Architect apps that stay effortless to reason about."
        subtitle="Reflex unifies a single store, an event pipeline, reactive subscriptions, and declarative effects into one cohesive model. The result: predictable code, fewer edge cases, and faster debugging."
      />

      <div className="value-grid">
        {values.map(({ icon, title, copy }) => (
          <article key={title} className="value-card">
            <div className="value-card__icon">{icon}</div>
            <h3 className="value-card__title">{title}</h3>
            <p className="value-card__copy">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

