import { SectionHeader } from '../components/SectionHeader.jsx'

export function CallToAction() {

  return (
    <section className="section" id="cta">
      <SectionHeader
        align="center"
        title="Ready to explore the documentation?"
        subtitle="Dive deep into Reflex with comprehensive guides, API references, and examples to build amazing applications."
      />

      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <button className="primary-button" onClick={() => window.location.href = '/docs/'}>
          Read the Docs
        </button>
        <a
          className="secondary-button"
          href="https://github.com/flexsurfer/reflex"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </section>
  )
}
