export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Reflex</strong>
        <p>A reactive, functional state management library for React and TypeScript.</p>
      </div>
      <div className="footer__links">
        <a className="footer__link" href="/reflex-website/docs/" rel="noreferrer">
          Documentation
        </a>
        <a className="footer__link" href="https://github.com/flexsurfer/reflex" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="footer__link" href="https://github.com/flexsurfer/reflex#-quick-start" target="_blank" rel="noreferrer">
          README
        </a>
        <a className="footer__link" href="https://github.com/flexsurfer/reflex/blob/main/LICENSE" target="_blank" rel="noreferrer">
          MIT License
        </a>
      </div>
      <small>© {new Date().getFullYear()} Reflex. Built with love by flexsurfer.</small>
    </footer>
  )
}
