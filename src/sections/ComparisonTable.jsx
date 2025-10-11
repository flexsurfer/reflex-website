import { SectionHeader } from '../components/SectionHeader.jsx'

export function ComparisonTable() {
  return (
    <section className="section" id="comparison">
      <SectionHeader
        eyebrow="Why choose Reflex"
        title="Designed for scale, built for simplicity."
        subtitle="Reflex provides a complete, battle-tested architecture that scales predictably while keeping your code maintainable and testable."
      />

      <div className="comparison-container">
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>Redux / Zustand</th>
                <th>Reflex</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Type / Role</strong></td>
                <td>Libraries providing low-level primitives for state management — architecture must be assembled manually</td>
                <td>Complete framework with opinionated patterns and conventions</td>
                <td><strong>Framework:</strong> predefined architecture eliminates decision fatigue, enforces consistency, and provides scalable, battle-tested patterns</td>
              </tr>
              <tr>
                <td><strong>Architecture Clarity</strong></td>
                <td>Redux: Complex action/reducer/middleware layers. Zustand: Simple but unstructured for large apps</td>
                <td>Event-driven architecture with explicit separation of events, state updates, and effects</td>
                <td><strong>Unified mental model:</strong> single event→effect→subscription pipeline simplifies reasoning and maintenance in large systems</td>
              </tr>
              <tr>
                <td><strong>State Derivation / Selectors</strong></td>
                <td>Redux: Reselect for memoized selectors. Zustand: Manual selector functions</td>
                <td>Reactive subscriptions with automatic dependency tracking</td>
                <td><strong>Declarative data flow:</strong> dependencies tracked automatically; no manual selector logic or stale closure issues common in hook-based stores</td>
              </tr>
              <tr>
                <td><strong>Side-effects Handling</strong></td>
                <td>Redux: Middleware (thunks/sagas) mixes effects with business logic. Zustand: Inline or custom middleware</td>
                <td>Pure events return effects as declarative data structures</td>
                <td><strong>Pure business logic:</strong> events stay pure, effects are explicit and testable; tooling can visualize and validate effect flow</td>
              </tr>
              <tr>
                <td><strong>Reactive Updates</strong></td>
                <td>Redux: connect/selectors trigger re-renders. Zustand: Manual subscription control</td>
                <td>Built-in reactive subscription system</td>
                <td><strong>Automatic granularity:</strong> reactivity graph ensures updates only when subscribed data changes — no manual optimization required</td>
              </tr>
              <tr>
                <td><strong>Debuggability / Traceability</strong></td>
                <td>Redux: DevTools track actions/state diffs. Zustand: Limited devtools</td>
                <td>Built-in event tracing, db snapshots, and live dependency visualization (via Reflex DevTools)</td>
                <td><strong>Full-system X-ray:</strong> Reflex DevTools expose every event, effect, and reactive subscription in real time — allowing total control over application behavior, state flow, and even performance profiling</td>
              </tr>
              <tr>
                <td><strong>Testing / Reproducibility</strong></td>
                <td>Redux: Reducers are testable, but async and effects complicate tests. Zustand: unit tests only</td>
                <td>Pure events and declarative effects allow full replay and snapshot testing</td>
                <td><strong>Deterministic replay:</strong> event logs reproduce complete app state, simplifying regression and snapshot testing</td>
              </tr>
              <tr>
                <td><strong>Scalability of Architecture</strong></td>
                <td>Redux: Scales with conventions and discipline. Zustand: Not structured for large teams</td>
                <td>Composable interceptors and modular event/effect layers scale predictably</td>
                <td><strong>Team scaling:</strong> consistent patterns and guardrails reduce cognitive load and architectural drift in large teams</td>
              </tr>
              <tr>
                <td><strong>Language Safety / Immutability</strong></td>
                <td>Redux: Optional Immer or Immutable.js; mutable risk in plain JS. Zustand: Mutable by default</td>
                <td>Immer ensures structural sharing and type-safe mutations</td>
                <td><strong>Type-safe immutability:</strong> compile-time safety with ergonomic mutation syntax and performance-efficient state updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
