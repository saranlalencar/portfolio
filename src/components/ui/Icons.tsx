import type { SVGProps } from 'react'

/**
 * Icones em SVG inline.
 *
 * Escolha deliberada: uma biblioteca de icones adicionaria uma dependencia e
 * peso de bundle para meia duzia de glifos. Aqui eles herdam `currentColor`,
 * escalam com o texto e custam alguns bytes.
 */
type IconProps = SVGProps<SVGSVGElement>

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ArrowRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Stroke>
  )
}

/** Lua crescente — indica que o tema noturno esta ativo. */
export function MoonIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.6 6.6 0 0 0 9.2 9.2Z" />
    </Stroke>
  )
}

/** Sol — indica que o tema diurno esta ativo. */
export function SunIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
    </Stroke>
  )
}

export function ArrowDown(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Stroke>
  )
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Stroke>
  )
}

export function Download(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
    </Stroke>
  )
}

export function Mail(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 7.6 5.3a1.6 1.6 0 0 0 1.8 0L20.5 7" />
    </Stroke>
  )
}

export function Close(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Stroke>
  )
}

export function Menu(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Stroke>
  )
}

export function Check(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Stroke>
  )
}

export function Image(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.75" cy="10" r="1.5" />
      <path d="m3.5 17 4.8-4.4a2 2 0 0 1 2.7 0L20.5 21" />
    </Stroke>
  )
}

export function Layers(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.8 8.5 4.5 8.5-4.5" />
    </Stroke>
  )
}

export function Terminal(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="m7 10 3 2.5L7 15M13 15.5h4" />
    </Stroke>
  )
}

export function Sparkles(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 3.5v3M20 5h-3" />
    </Stroke>
  )
}

export function LinkedIn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.2 8.75 22 11.1 22 14.16V21h-4v-6.06c0-1.45-.03-3.3-2.06-3.3-2.06 0-2.37 1.56-2.37 3.2V21h-4V9Z" />
    </svg>
  )
}

export function GitHub(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.1.7-.22.7-.49l-.01-1.9c-2.6.5-3.28-.63-3.5-1.22-.12-.3-.63-1.23-1.08-1.48-.37-.2-.9-.68-.02-.7.83-.01 1.42.77 1.62 1.08.95 1.6 2.46 1.15 3.07.88.09-.69.37-1.15.67-1.42-2.3-.26-4.72-1.15-4.72-5.12 0-1.13.4-2.06 1.06-2.79-.1-.26-.46-1.32.1-2.74 0 0 .87-.28 2.85 1.06a9.6 9.6 0 0 1 5.18 0c1.98-1.34 2.85-1.06 2.85-1.06.56 1.42.2 2.48.1 2.74.66.73 1.06 1.65 1.06 2.79 0 3.98-2.43 4.86-4.73 5.12.37.32.7.95.7 1.92l-.01 2.85c0 .27.19.6.7.49A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  )
}
