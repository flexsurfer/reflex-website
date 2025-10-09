import { SectionHeader } from '../components/SectionHeader.jsx'

const steps = [
  {
    title: '1. Initialize your app db',
    copy: 'Define the single source of truth once via initAppDb. Everything else queries or transforms the db.',
  },
  {
    title: '2. Register events',
    copy: 'Events are pure reducers that optionally return side effects. They run through interceptors before mutating the draft db.',
  },
  {
    title: '3. Register and use subscriptions',
    copy: 'Subscriptions describe the data graph. Components use a hook useSubscription to react to changes.',
  },
  {
    title: '4. Dispatch and render',
    copy: 'Dispatch events from anywhere in your app. React Native or web consume the same state layer.',
  },
]

const pillars = [
  {
    title: 'Interceptors',
    copy: 'Compose cross-cutting concerns like logging, tracing, permissions, or async coordination around events.',
  },
  {
    title: 'Effects & Co-effects',
    copy: 'Isolate side effects so reducers remain pure. Inject anything from HTTP to device APIs without polluting event logic.',
  },
  {
    title: 'Devtools',
    copy: 'Time-travel, event history, and subscription graphs. Reflex Devtools gives end-to-end visibility.',
  },
]

export function Architecture() {
  return (
    <section className="section" id="architecture">
      <SectionHeader
        eyebrow="How it works"
        title="A unidirectional event loop you can trust."
        subtitle="Reflex keeps your mental model simple: dispatch events, intercept them, update state, and let subscriptions feed your UI."
      />

      <div className="architecture-diagram">
        <h3>Core loop</h3>
        <div className="architecture-diagram__grid">
          {steps.map(({ title, copy }) => (
            <article key={title} className="architecture-card">
              <h4 className="architecture-card__title">{title}</h4>
              <p className="architecture-card__copy">{copy}</p>
            </article>
          ))}
        </div>

        <h3>Architecture pillars</h3>
        <div className="architecture-diagram__grid">
          {pillars.map(({ title, copy }) => (
            <article key={title} className="architecture-card">
              <h4 className="architecture-card__title">{title}</h4>
              <p className="architecture-card__copy">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

