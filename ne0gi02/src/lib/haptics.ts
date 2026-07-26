/**
 * The one thing a web phone cannot fake convincingly, so it is used
 * sparingly: entering edit mode, picking an icon up, putting it down,
 * and creating a page. Silently absent on hardware without it.
 */
export function haptic(pattern: number | number[] = 8) {
  if (typeof navigator === 'undefined') return
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* some browsers expose vibrate and then refuse to run it */
  }
}
