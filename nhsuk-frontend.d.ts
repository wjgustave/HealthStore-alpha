/**
 * Minimal type shim for nhsuk-frontend (^9.3.0), which ships no TypeScript declarations.
 * Only the entry points we consume are declared.
 */
declare module 'nhsuk-frontend' {
  /** Initialise all NHS.UK frontend component JavaScript (accordions, details, etc.). */
  export function initAll(scope?: Element | Document): void
}
