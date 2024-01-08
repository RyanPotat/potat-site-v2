/* eslint-disable no-bitwise */

interface ColorStop {
  color: number;
  at: number;
}

interface Shadow {
  color: number;
  x_offset: number;
  y_offset: number;
  radius: number;
}

export interface Paint {
  function: 'LINEAR_GRADIENT' | 'RADIAL_GRADIENT' | 'URL';
  stops?: ColorStop[];
  angle?: number;
  repeat?: boolean;
  image_url?: string;
  shadows?: Shadow[];
}

export function applyPaint(paint: Paint, cssClass: string): void {
  const editText = cssClass.includes('span')
    ? document.querySelector(cssClass) as HTMLElement
    : document.getElementById(cssClass) as HTMLElement;

  if (!editText) return;

  editText.style.color = 'transparent';
  editText.style.webkitBackgroundClip = 'text';
  editText.style.backgroundClip = 'text';

  function convertColorStop(stop: ColorStop): string {
    const colorString = `#${(stop.color >>> 0).toString(16).padStart(8, '0')}`;
    return `${colorString} ${stop.at * 100}%`;
  }

  if (paint.function === 'LINEAR_GRADIENT' && paint.stops && paint.stops.length > 0) {
    const gradientStops = paint.stops.map(convertColorStop);
    const gradientDirection = `${paint.angle}deg`;
    const gradient = paint.repeat
      ? `repeating-linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`
      : `linear-gradient(${gradientDirection}, ${gradientStops.join(', ')})`;
    editText.style.backgroundImage = gradient;
  } else if (paint.function === 'RADIAL_GRADIENT' && paint.stops && paint.stops.length > 0) {
    const gradientStops = paint.stops.map(convertColorStop);
    const gradient = `radial-gradient(circle, ${gradientStops.join(', ')})`;
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
