/**
 * Minimal type shim for nhsuk-frontend (^9.3.0), which ships no TypeScript declarations.
 * Only the entry points we consume are declared.
 */
declare module 'nhsuk-frontend' {
  type InitOptions = { scope?: Element | Document }

  /** Initialise all NHS.UK frontend component JavaScript (accordions, details, etc.). */
  export function initAll(scope?: Element | Document): void
  export function initHeader(options?: InitOptions): void
  export function initSkipLink(options?: InitOptions): void
  export function initButton(options?: InitOptions): void
  export function initCharacterCount(options?: InitOptions): void
  export function initCheckboxes(options?: InitOptions): void
  export function initDetails(options?: InitOptions): void
  export function initErrorSummary(options?: InitOptions): void
  export function initRadios(options?: InitOptions): void
  export function initTabs(options?: InitOptions): void
}
