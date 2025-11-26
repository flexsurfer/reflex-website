import { ArrowRightIcon, GitHubIcon, LightningIcon, DocsIcon } from '../components/icons.jsx'

export function Hero() {
  return (
    <section className="hero section">
      <div className="section--tight">
        <span className="section__eyebrow">State management for ambitious teams</span>
        <div className="hero__headline">
          <img className="hero__headline-logo" src={`${import.meta.env.BASE_URL}reflex_logo_trimmed.png`} alt="Reflex logo" />
          <h1 className="hero__headline-text">The Architecture for Complex React & React Native Apps.</h1>
        </div>
        <p className="hero__copy">
        Stop fighting with state management libraries that don't scale. Reflex brings the battle-tested re-frame architecture to JavaScript and TypeScript, providing a complete, cohesive system for predictable state, isolated side effects, and reactive data flow. Built for teams that need predictability, robust debugging, and architectural clarity in their most ambitious applications.
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

