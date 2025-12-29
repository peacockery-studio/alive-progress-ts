/**
 * Built-in styles: spinners, bars, and themes.
 */

import {
  frameSpinner,
  scrollingSpinner,
  bouncingSpinner,
  pulsingSpinner,
  delayedSpinner,
  type SpinnerFactory
} from '../animations/spinners.js';

import {
  barFactory,
  smoothBar,
  classicBar,
  blocksBar,
  bubblesBar,
  fishBar,
  halloweenBar,
  arrowBar,
  type BarFactory
} from '../animations/bars.js';

// ============================================
// BUILT-IN SPINNERS
// ============================================

export const spinners: Record<string, SpinnerFactory> = {
  // Classic spinners
  classic: frameSpinner('|/-\\'),
  dots: frameSpinner(['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']),
  dots2: frameSpinner(['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']),
  dots3: frameSpinner(['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈']),
  line: frameSpinner(['-', '\\', '|', '/']),
  line2: frameSpinner(['⠂', '-', '–', '—', '–', '-']),

  // Bouncing
  bounce: bouncingSpinner('●'),
  bounce2: frameSpinner(['◐', '◓', '◑', '◒']),

  // Arrows
  arrows: frameSpinner(['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']),
  arrows2: frameSpinner(['⬆️ ', '↗️ ', '➡️ ', '↘️ ', '⬇️ ', '↙️ ', '⬅️ ', '↖️ ']),

  // Shapes
  circle: frameSpinner(['◜', '◠', '◝', '◞', '◡', '◟']),
  square: frameSpinner(['◰', '◳', '◲', '◱']),
  triangle: frameSpinner(['◢', '◣', '◤', '◥']),

  // Growing/shrinking
  grow: frameSpinner(['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃']),
  growHorizontal: frameSpinner(['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█', '▉', '▊', '▋', '▌', '▍', '▎']),

  // Pulse
  pulse: pulsingSpinner(['○', '◎', '●', '◉']),
  pulse2: pulsingSpinner(['.', 'o', 'O', '°', 'O', 'o']),

  // Stars
  star: frameSpinner(['✶', '✸', '✹', '✺', '✹', '✸']),
  star2: frameSpinner(['★', '☆']),

  // Flip
  flip: frameSpinner(['_', '_', '_', '-', '`', '`', '\'', '´', '-', '_', '_', '_']),

  // Scrolling
  waves: scrollingSpinner('≈≈≈', { background: ' ' }),
  waves2: scrollingSpinner('～～', { background: ' ' }),

  // Box animations
  boxBounce: frameSpinner(['▖', '▘', '▝', '▗']),
  boxBounce2: frameSpinner(['▌', '▀', '▐', '▄']),

  // Clock
  clock: frameSpinner(['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']),

  // Moon phases
  moon: frameSpinner(['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']),

  // Earth
  earth: frameSpinner(['🌍', '🌎', '🌏']),

  // Hearts
  hearts: frameSpinner(['💛', '💙', '💜', '💚', '❤️ ']),

  // Weather
  weather: frameSpinner(['☀️ ', '☀️ ', '☀️ ', '🌤 ', '⛅', '🌥 ', '☁️ ', '🌧 ', '🌨 ', '🌧 ', '🌥 ', '⛅', '🌤 ']),

  // Monkey
  monkey: frameSpinner(['🙈', '🙈', '🙉', '🙊']),

  // Aesthetic
  aesthetic: scrollingSpinner('▰▰▰', { background: '▱' }),

  // Point
  point: frameSpinner(['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙∙∙']),

  // Layer
  layer: frameSpinner(['—', '=', '≡', '=']),

  // Breathing
  breathing: pulsingSpinner(['  ∙  ', ' ∙∙∙ ', '∙∙∙∙∙', ' ∙∙∙ '], 3),

  // Toggle
  toggle: frameSpinner(['⊶', '⊷']),
  toggle2: frameSpinner(['▫', '▪']),
  toggle3: frameSpinner(['□', '■']),
  toggle4: frameSpinner(['■', '□', '▪', '▫']),

  // Arc
  arc: frameSpinner(['◜', '◝', '◞', '◟']),

  // Pipe
  pipe: frameSpinner(['┤', '┘', '┴', '└', '├', '┌', '┬', '┐']),

  // Simple dots
  simpleDots: frameSpinner(['.  ', '.. ', '...', '   ']),
  simpleDots2: frameSpinner(['.  ', '.. ', '...', ' ..', '  .', '   ']),

  // Balloon
  balloon: frameSpinner([' ', '.', 'o', 'O', '@', '*', ' ']),
  balloon2: frameSpinner(['.', 'o', 'O', '°', 'O', 'o', '.']),

  // Noise
  noise: frameSpinner(['▓', '▒', '░', '▒']),

  // Bounce ball
  bounceBall: frameSpinner(['( ●    )', '(  ●   )', '(   ●  )', '(    ● )', '(     ●)', '(    ● )', '(   ●  )', '(  ●   )', '( ●    )', '(●     )']),

  // Shark
  shark: scrollingSpinner('|\\‾‾‾/|', { background: '~' }),

  // Dqpb
  dqpb: frameSpinner(['d', 'q', 'p', 'b']),

  // Grenade
  grenade: frameSpinner(['،  ', '′  ', ' ´ ', ' ‾ ', '  ⸌', '  ⸊', '  |', '  ⁎', '  ⁕', ' ෴ ', '  ⁂', '   ', '   ', '   ']),

  // Default
  default: frameSpinner(['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']),
};

// Aliases
spinners.twirls = spinners.dots;
spinners.alive = spinners.dots2;
spinners.balls = spinners.bounce;
spinners.notes = spinners.toggle;

// ============================================
// BUILT-IN BARS
// ============================================

export const bars: Record<string, BarFactory> = {
  smooth: smoothBar(),
  classic: classicBar(),
  blocks: blocksBar(),
  bubbles: bubblesBar(),
  fish: fishBar(),
  halloween: halloweenBar(),
  arrow: arrowBar(),

  // Simple styles
  solid: barFactory({ chars: '█', background: '░', borders: ['│', '│'] }),
  squares: barFactory({ chars: '■', background: '□', borders: ['[', ']'] }),
  circles: barFactory({ chars: '●', background: '○', borders: ['(', ')'] }),

  // ASCII-only
  ascii: barFactory({ chars: '#', background: '.', borders: ['[', ']'] }),
  ascii2: barFactory({ chars: '=', background: ' ', borders: ['[', ']'] }),

  // Fancy
  fancy: barFactory({ chars: '▰', background: '▱', borders: ['⟨', '⟩'] }),
  fancy2: barFactory({ chars: '█', background: '▁', borders: ['▕', '▏'] }),

  // Minimal
  minimal: barFactory({ chars: '━', background: '─', borders: null }),
  minimal2: barFactory({ chars: '■', background: ' ', borders: null }),

  // Default
  default: smoothBar(),
};

// ============================================
// BUILT-IN THEMES
// ============================================

export interface Theme {
  spinner: string;
  bar: string;
  unknown: string;
}

export const themes: Record<string, Theme> = {
  smooth: {
    spinner: 'waves',
    bar: 'smooth',
    unknown: 'waves'
  },
  classic: {
    spinner: 'classic',
    bar: 'classic',
    unknown: 'classic'
  },
  ascii: {
    spinner: 'line',
    bar: 'ascii',
    unknown: 'line'
  },
  scuba: {
    spinner: 'shark',
    bar: 'fish',
    unknown: 'waves'
  },
  musical: {
    spinner: 'notes',
    bar: 'smooth',
    unknown: 'notes'
  },
  halloween: {
    spinner: 'moon',
    bar: 'halloween',
    unknown: 'moon'
  },
  minimal: {
    spinner: 'dots',
    bar: 'minimal',
    unknown: 'dots'
  },
  modern: {
    spinner: 'dots2',
    bar: 'blocks',
    unknown: 'dots2'
  },
  default: {
    spinner: 'dots',
    bar: 'smooth',
    unknown: 'dots'
  }
};

// ============================================
// ACCESSORS
// ============================================

/**
 * Get a spinner by name, or return the default.
 */
export function getSpinner(name: string | SpinnerFactory): SpinnerFactory {
  if (typeof name === 'function') {
    return name;
  }
  return spinners[name] || spinners.default;
}

/**
 * Get a bar by name, or return the default.
 */
export function getBar(name: string | BarFactory): BarFactory {
  if (typeof name === 'function') {
    return name;
  }
  return bars[name] || bars.default;
}

/**
 * Get a theme by name, or return the default.
 */
export function getTheme(name: string): Theme {
  return themes[name] || themes.default;
}

/**
 * List all available spinner names.
 */
export function listSpinners(): string[] {
  return Object.keys(spinners);
}

/**
 * List all available bar names.
 */
export function listBars(): string[] {
  return Object.keys(bars);
}

/**
 * List all available theme names.
 */
export function listThemes(): string[] {
  return Object.keys(themes);
}
