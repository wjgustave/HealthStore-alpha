/** Explanatory copy for regulated SaMD device classes (PDP Quick facts). */

export const DEVICE_CLASS_IIA_EXPLAINER =
  'Software that actively informs clinical decision-making: such as diagnostic algorithms. Because misperformance could lead to patient harm, a UK approved body must assess the product before market placement, requiring clinical evidence and ongoing post-market surveillance.'

export const DEVICE_CLASS_I_EXPLAINER =
  "Software that supports clinical decisions but doesn't directly drive them: for example, a tool that records or displays patient data. It's low-risk, so manufacturer can self-certify compliance. No UK approved body assessment is required, though MHRA registration and technical documentation are still mandatory."

/**
 * Returns explainer body for Class IIa or Class I device_class strings; null otherwise.
 * Class IIa must be checked before Class I — "Class IIa" shares a prefix with "Class I".
 */
export function getDeviceClassExplainerBody(deviceClass: string): string | null {
  const s = deviceClass.trim()
  if (!s) return null

  if (/class\s*iia/i.test(s)) return DEVICE_CLASS_IIA_EXPLAINER
  if (/\bclass\s+i\b/i.test(s)) return DEVICE_CLASS_I_EXPLAINER

  return null
}
