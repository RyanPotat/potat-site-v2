/* eslint-disable no-bitwise */

import { ColorStop, Shadow } from '../types/misc';

export interface Paint {
  id: string;
  name: string;
  function: 'LINEAR_GRADIENT' | 'RADIAL_GRADIENT' | 'URL';
  stops?: ColorStop[];
  angle?: number;
  repeat?: boolean;
  image_url?: string;
  shadows?: Shadow[];
}

const convertColorStop = (stop: ColorStop): string => {
  const colorString = `#${(stop.color >>> 0).toString(16).padStart(8, '0')}`;
  return `${colorString} ${stop.at * 100}%`;
};

export function applyPaint(paint: Paint, cssClass: string): void {
  const editText = cssClass.includes('span')
    ? document.querySelector(cssClass) as HTMLElement
    : document.getElementById(cssClass) as HTMLElement;

  if (!editText) return;

  editText.style.color = 'transparent';
  editText.style.webkitBackgroundClip = 'text';
  editText.style.backgroundClip = 'text';

  if (paint.function === 'LINEAR_GRADIENT' && paint.stops && paint.stops.length > 0) {
    const gradientStops = paint.stops.map(convertColorStop);
    const gradientDirection = `${paint.angle}deg`;
    const gradient = paint.repeat
      ? `repeating-linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`
      : `linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`;
    editText.style.backgroundImage = gradient;
  } else if (paint.function === 'RADIAL_GRADIENT' && paint.stops && paint.stops.length > 0) {
    const gradientStops = paint.stops.map(convertColorStop);
    const gradientRepeat = paint.repeat ? 'repeating-' : '';
    const gradient = `${gradientRepeat}radial-gradient(circle, ${gradientStops.join(', ')})`;
    editText.style.backgroundImage = gradient;
    editText.style.backgroundSize = '100% auto';
  } else if (paint.function === 'URL' && paint.image_url) {
    editText.style.backgroundImage = `url('${paint.image_url}')`;
    editText.style.backgroundSize = '100% auto';
  }

  if (paint.shadows && paint.shadows.length > 0) {
    const dropShadows = paint.shadows.map((shadow) => {
      const colorString = `#${(shadow.color >>> 0).toString(16).padStart(8, '0')}`;
      return `drop-shadow(${colorString} ${shadow.x_offset}px ${shadow.y_offset}px ${shadow.radius}px)`;
    });
    editText.style.filter = dropShadows.join(' ');
  } else {
    editText.style.filter = '';
  }
}

export const computePaintStyle = (p: Paint): string => {
  if (!p) {
    console.warn('No paint provided');
    return '';
  }
  let style = 'color: transparent; -webkit-background-clip: text; background-clip: text;';
  if (p.function === 'LINEAR_GRADIENT' && p.stops && p.stops.length > 0) {
    const gradientStops = p.stops.map(convertColorStop);
    const gradientDirection = `${p.angle}deg`;
    const gradient = p.repeat
      ? `repeating-linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`
      : `linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`;
    style += ` background-image: ${gradient};`;
  } else if (p.function === 'RADIAL_GRADIENT' && p.stops && p.stops.length > 0) {
    const gradientStops = p.stops.map(convertColorStop);
    const gradientRepeat = p.repeat ? 'repeating-' : '';
    const gradient = `${gradientRepeat}radial-gradient(circle, ${gradientStops.join(', ')})`;
    style += ` background-image: ${gradient}; background-size: 100% auto;`;
  } else if (p.function === 'URL' && p.image_url) {
    style += ` background-image: url('${p.image_url}'); background-size: 100% auto;`;
  }

  if (p.shadows && p.shadows.length > 0) {
    const dropShadows = p.shadows.map((shadow) => {
      const colorString = `#${(shadow.color >>> 0).toString(16).padStart(8, '0')}`;
      return `drop-shadow(${colorString} ${shadow.x_offset}px ${shadow.y_offset}px ${shadow.radius}px)`;
    });
    style += ` filter: ${dropShadows.join(' ')};`;
  } else {
    style += ' filter: none;';
  }
  return style;
};
