import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'wa-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string
          family?: string
          variant?: string
          label?: string
          library?: string
        },
        HTMLElement
      >
    }
  }
}

export {}
