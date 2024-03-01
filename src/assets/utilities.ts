import humanize from 'humanize-duration';
import tinycolor from 'tinycolor2';

/**
 * Converts milliseconds to a human-readable duration.
 * @param {number} ms - The duration in milliseconds.
 * @param {number} largest - The largest unit to display (default is 4).
 * @returns {string} The human-readable duration string.
 */
export function humanizeDuration(ms: number, largest?: number): string {
  const options = {
    language: 'shortEn',
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'm',
        s: () => 's',
        ms: () => 'ms'
      }
    },
    units: ['y', 'mo', 'd', 'h', 'm', 's'],
    largest: largest ?? 4,
    round: true,
    conjunction: ' and ',
    spacer: ''
  };
  return humanize(ms, options);
}

export function brightenColor(color: string, percent: number): string {
  if (!color) return;
  percent = Math.max(-100, Math.min(100, percent));
  let hsl = tinycolor(color).toHsl();
  hsl.l += (percent / 100);
  return tinycolor(hsl).toString();
}