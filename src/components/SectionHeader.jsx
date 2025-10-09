export function SectionHeader({ eyebrow, title, subtitle, align = 'start' }) {
  const classes = ['section', 'section--tight']

  if (align === 'center') {
    classes.push('section--center')
  }

  return (
    <header className={classes.join(' ')}>
      {eyebrow ? <span className="section__eyebrow">{eyebrow}</span> : null}
      <h2 className="section__title">{title}</h2>
      {subtitle ? <p className="section__subtitle">{subtitle}</p> : null}
    </header>
  )
}

