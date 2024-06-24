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

export function brightenColor(color: string, percent = 25): string {
  if (!color) return color;
  if (!getContrastingTextColor(color)) return color;
  return tinycolor(color).brighten(percent).toString();
}

const getContrastingTextColor = (color: string) => {
  // Calculate luminance of the background color
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Choose contrasting text color based on luminance
  return luminance < 100
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));