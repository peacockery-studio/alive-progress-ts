import { describe, test, expect } from 'bun:test';
import {
  spinners,
  bars,
  themes,
  getSpinner,
  getBar,
  getTheme,
  listSpinners,
  listBars,
  listThemes
} from '../src/styles/internal';
import { frameSpinner } from '../src/animations/spinners';
import { barFactory } from '../src/animations/bars';

describe('built-in spinners', () => {
  test('spinners object contains multiple spinners', () => {
    expect(Object.keys(spinners).length).toBeGreaterThan(20);
  });

  test('all spinners are functions', () => {
    for (const [name, spinner] of Object.entries(spinners)) {
      expect(typeof spinner).toBe('function');
    }
  });

  test('common spinners exist', () => {
    expect(spinners.classic).toBeDefined();
    expect(spinners.dots).toBeDefined();
    expect(spinners.dots2).toBeDefined();
    expect(spinners.bounce).toBeDefined();
    expect(spinners.arrows).toBeDefined();
    expect(spinners.pulse).toBeDefined();
  });

  test('all spinners produce valid frames', () => {
    for (const [name, factory] of Object.entries(spinners)) {
      const spinner = factory(10);
      const frame = spinner();

      expect(frame.content).toBeDefined();
      expect(frame.width).toBe(10);
    }
  });
});

describe('built-in bars', () => {
  test('bars object contains multiple bars', () => {
    expect(Object.keys(bars).length).toBeGreaterThan(5);
  });

  test('all bars are functions', () => {
    for (const [name, bar] of Object.entries(bars)) {
      expect(typeof bar).toBe('function');
    }
  });

  test('common bars exist', () => {
    expect(bars.smooth).toBeDefined();
    expect(bars.classic).toBeDefined();
    expect(bars.blocks).toBeDefined();
    expect(bars.bubbles).toBeDefined();
  });

  test('all bars produce valid frames', () => {
    for (const [name, factory] of Object.entries(bars)) {
      const bar = factory(20);
      const frame = bar(0.5);

      expect(frame.content).toBeDefined();
      expect(frame.width).toBe(20);
    }
  });
});

describe('built-in themes', () => {
  test('themes object contains multiple themes', () => {
    expect(Object.keys(themes).length).toBeGreaterThan(3);
  });

  test('all themes have required properties', () => {
    for (const [name, theme] of Object.entries(themes)) {
      expect(theme.spinner).toBeDefined();
      expect(theme.bar).toBeDefined();
      expect(theme.unknown).toBeDefined();
    }
  });

  test('common themes exist', () => {
    expect(themes.smooth).toBeDefined();
    expect(themes.classic).toBeDefined();
    expect(themes.minimal).toBeDefined();
  });

  test('theme references valid spinners and bars', () => {
    for (const [name, theme] of Object.entries(themes)) {
      expect(spinners[theme.spinner]).toBeDefined();
      expect(bars[theme.bar]).toBeDefined();
      expect(spinners[theme.unknown]).toBeDefined();
    }
  });
});

describe('getSpinner', () => {
  test('returns spinner by name', () => {
    const spinner = getSpinner('dots');
    expect(typeof spinner).toBe('function');
  });

  test('returns default for unknown name', () => {
    const spinner = getSpinner('nonexistent');
    expect(typeof spinner).toBe('function');
    expect(spinner).toBe(spinners.default);
  });

  test('returns factory if passed directly', () => {
    const customSpinner = frameSpinner(['A', 'B']);
    const result = getSpinner(customSpinner);
    expect(result).toBe(customSpinner);
  });
});

describe('getBar', () => {
  test('returns bar by name', () => {
    const bar = getBar('classic');
    expect(typeof bar).toBe('function');
  });

  test('returns default for unknown name', () => {
    const bar = getBar('nonexistent');
    expect(typeof bar).toBe('function');
    expect(bar).toBe(bars.default);
  });

  test('returns factory if passed directly', () => {
    const customBar = barFactory({ chars: '#' });
    const result = getBar(customBar);
    expect(result).toBe(customBar);
  });
});

describe('getTheme', () => {
  test('returns theme by name', () => {
    const theme = getTheme('classic');
    expect(theme.spinner).toBe('classic');
    expect(theme.bar).toBe('classic');
  });

  test('returns default for unknown name', () => {
    const theme = getTheme('nonexistent');
    expect(theme).toBe(themes.default);
  });
});

describe('list functions', () => {
  test('listSpinners returns array of names', () => {
    const names = listSpinners();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(20);
    expect(names).toContain('dots');
    expect(names).toContain('classic');
  });

  test('listBars returns array of names', () => {
    const names = listBars();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(5);
    expect(names).toContain('smooth');
    expect(names).toContain('classic');
  });

  test('listThemes returns array of names', () => {
    const names = listThemes();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(3);
    expect(names).toContain('smooth');
    expect(names).toContain('classic');
  });
});

describe('spinner aliases', () => {
  test('twirls is an alias for dots', () => {
    expect(spinners.twirls).toBe(spinners.dots);
  });

  test('alive is an alias for dots2', () => {
    expect(spinners.alive).toBe(spinners.dots2);
  });
});
