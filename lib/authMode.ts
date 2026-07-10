/**
 * Open-access mode: visitors are treated as signed-in guests and login/org
 * selection is skipped. Default is on for this alpha; set
 * NEXT_PUBLIC_DISABLE_AUTH=false to re-enable authentication later.
 */
export const AUTH_DISABLED = process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'false'
