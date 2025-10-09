import { Highlight, themes } from 'prism-react-renderer'
import { SectionHeader } from '../components/SectionHeader.jsx'

const steps = [
  {
    title: 'Install packages',
    code: 'npm install @flexsurfer/reflex\n\nOptionally:\nnpm install --save-dev @flexsurfer/reflex-devtools',
    copy: 'Core runtime plus optional devtools for deep inspection.',
  },
  {
    title: 'Wire your first feature',
    code: "import { initAppDb, regEvent, regSub } from '@flexsurfer/reflex'\n\ninitAppDb({ counter: 0 })\nregEvent('increment', ({ draftDb }) => {\n  draftDb.counter += 1\n})\nregSub('counter')\n\n// In your React component\nimport { useSubscription, dispatch } from '@flexsurfer/reflex'\n\nfunction Counter() {\n  const count = useSubscription([\"counter\"])\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => dispatch([\"increment\"])}>\n        Increment\n      </button>\n    </div>\n  )\n}",
    copy: 'Create events and queries once, then consume them from React or React Native.',
  },
  {
    title: 'Enable tracing & devtools [Optional]',
    code: "import { enableTracing } from '@flexsurfer/reflex'\nimport { enableDevtools } from '@flexsurfer/reflex-devtools'\n\nenableTracing()\nenableDevtools()\n\n// Then run the devtools UI\nnpx reflex-devtools\n",
    copy: 'Visualize event flow and subscription graphs in development.',
  },
]

export function QuickStart() {
  return (
    <section className="section" id="quickstart">
      <SectionHeader
        eyebrow="Get started"
        title="Spin up Reflex in minutes."
        subtitle="Install the runtime, bootstrap your app database, then register events and subscriptions. Add devtools when you want time-travel and tracing."
      />

      <div className="quickstart-grid">
        {steps.map(({ title, copy, code }) => (
          <article key={title} className="quickstart-card">
            <h3>{title}</h3>
            <p>{copy}</p>
            <div className="code-block">
              <Highlight
                theme={themes.vsDark}
                code={code}
                language={title === 'Install packages' ? 'bash' : 'typescript'}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre style={{ ...style, background: 'transparent', padding: '0', margin: '0', fontSize: '0.95rem' }} className={className}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
