import { ArrowRightIcon, GitHubIcon, LightningIcon, DocsIcon } from '../components/icons.jsx'

export function Hero() {
  return (
    <section className="hero section">
      <div className="section--tight">
        <span className="section__eyebrow">State management for ambitious teams</span>
        <div className="hero__headline">
          <img className="hero__headline-logo" src="/reflex_logo_trimmed.png" alt="Reflex logo" />
          <h1 className="hero__headline-text">The wait is over. Re-frame’s power, now in JavaScript.</h1>
        </div>
        <p className="hero__copy">
        In 2014, re-frame set a new standard for state management: events, effects, subscriptions, and architectural clarity. For years, JavaScript developers tried to recreate it with Redux, Immutable.js, and endless middleware - but never quite got there. Now the day has come. Reflex brings the full strength of a battle-tested architecture to React and TypeScript - complete, cohesive, and ready for real-world apps.
        </p>
      </div>

      <div className="cta-row">
        <a className="primary-button" href="https://github.com/flexsurfer/reflex" target="_blank" rel="noreferrer">
          <GitHubIcon size={18} />
          View on GitHub
        </a>
        <a className="secondary-button" href="#quickstart">
          <LightningIcon size={18} />
          Quick start
        </a>
        <a className="secondary-button" href="#architecture">
          <ArrowRightIcon size={18} />
          Understand the pattern
        </a>
        <a className="secondary-button" href="/docs/">
          <DocsIcon size={18} />
          Read the docs
        </a>
      </div>
    </section>
  )
}

