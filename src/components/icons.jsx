
function createIcon(path, viewBox = '0 0 24 24') {
  return function Icon({ size = 20 }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {path}
      </svg>
    )
  }
}

export const GitHubIcon = createIcon(
  <path
    fill="currentColor"
    d="M12 .5C5.648.5.5 5.647.5 12.009c0 5.087 3.292 9.399 7.867 10.926.575.108.786-.25.786-.555 0-.274-.01-1.002-.015-1.967-3.2.695-3.876-1.543-3.876-1.543-.523-1.328-1.277-1.682-1.277-1.682-1.043-.713.079-.699.079-.699 1.152.081 1.758 1.183 1.758 1.183 1.026 1.757 2.693 1.251 3.35.957.103-.744.402-1.251.732-1.538-2.553-.29-5.236-1.277-5.236-5.686 0-1.257.45-2.285 1.184-3.09-.119-.29-.512-1.457.112-3.04 0 0 .964-.308 3.16 1.18a10.96 10.96 0 0 1 2.878-.387 10.92 10.92 0 0 1 2.878.387c2.195-1.488 3.158-1.18 3.158-1.18.625 1.583.232 2.75.113 3.04.736.805 1.183 1.833 1.183 3.09 0 4.42-2.688 5.392-5.252 5.675.414.356.783 1.057.783 2.131 0 1.538-.014 2.776-.014 3.156 0 .307.208.667.792.553C20.212 21.404 23.5 17.093 23.5 12.009 23.5 5.647 18.352.5 12 .5Z"
  />,
  '0 0 24 24'
)

export const LightningIcon = createIcon(
  <path
    d="M13.28 1.1a.75.75 0 0 1 .58.74l-.18 5.65h5.07a.75.75 0 0 1 .55 1.25l-9.56 10.52a.75.75 0 0 1-1.3-.54l.18-5.65H3.53a.75.75 0 0 1-.55-1.25L12.54 1.3a.75.75 0 0 1 .74-.2Z"
    fill="currentColor"
  />
)

export const LayersIcon = createIcon(
  <path
    d="M3.2 8.4 12 3.5l8.8 4.9-8.8 4.9-8.8-4.9Zm0 7.2L12 18.5l8.8-2.9M3.2 12.9 12 17.8l8.8-4.9"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

export const PuzzleIcon = createIcon(
  <path
    d="M9.25 3.5a2.25 2.25 0 1 1 4.5 0v1.25h2.5A2.75 2.75 0 0 1 19 7.5v2.5h-1.25a1.75 1.75 0 1 0 0 3.5H19v2.5a2.75 2.75 0 0 1-2.75 2.75h-2.5V19a2.25 2.25 0 1 0-4.5 0v1.25h-2.5A2.75 2.75 0 0 1 4 17.5v-2.5h1.25a1.75 1.75 0 1 0 0-3.5H4V7.5A2.75 2.75 0 0 1 6.75 4.75h2.5Z"
    fill="currentColor"
  />
)

export const AIIcon = createIcon(
  <>
    <path
      d="M12 2.5v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect
      x="5"
      y="6"
      width="14"
      height="12"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="9.5" cy="12" r="1.25" fill="currentColor" />
    <circle cx="14.5" cy="12" r="1.25" fill="currentColor" />
    <path
      d="M9 15.5c.6.9 1.54 1.5 3 1.5s2.4-.6 3-1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M5 10H3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19 10h1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </>
)

export const ArrowRightIcon = createIcon(
  <path
    d="M4.5 12a.75.75 0 0 1 .75-.75h10.14l-3.47-3.47a.75.75 0 0 1 1.06-1.06l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 0 1-1.06-1.06l3.47-3.47H5.25A.75.75 0 0 1 4.5 12Z"
    fill="currentColor"
  />
)

export const DocsIcon = createIcon(
  <>
    <path
      d="M7 3.5h10a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M9 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
)

