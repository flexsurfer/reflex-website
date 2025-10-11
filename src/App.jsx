import './styles.css'

import { Architecture } from './sections/Architecture.jsx'
import { CallToAction } from './sections/CallToAction.jsx'
import { CodeShowcase } from './sections/CodeShowcase.jsx'
import { ComparisonTable } from './sections/ComparisonTable.jsx'
import { Footer } from './sections/Footer.jsx'
import { Hero } from './sections/Hero.jsx'
import { QuickStart } from './sections/QuickStart.jsx'
import { ValueProps } from './sections/ValueProps.jsx'

function App() {
  return (
    <div className="page">
      <Hero />
      <ValueProps />
      <ComparisonTable />
      <Architecture />
      <QuickStart />
      <CodeShowcase />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default App
