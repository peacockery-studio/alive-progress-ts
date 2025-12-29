/**
 * Progress bar animation factories.
 *
 * Bars show the actual progress as a filled/unfilled visual.
 */

/**
 * A rendered bar frame ready for display.
 */
export interface BarFrame {
  content: string;
  width: number;
}

/**
 * A bar renderer function that creates a bar at a specific percentage.
 */
export type Bar = (
  percent: number,
  overflow?: boolean,
  underflow?: boolean
) => BarFrame;

/**
 * A bar factory creates a bar renderer with a specific length.
 */
export type BarFactory = (length: number) => Bar;

/**
 * Options for creating a bar.
 */
export interface BarOptions {
  /** Characters to use for the filled portion (gradient from empty to full) */
  chars?: string;
  /** Character(s) to use for the tip of the bar */
  tip?: string;
  /** Character to use for the unfilled background */
  background?: string;
  /** Border characters [left, right] or null for no borders */
  borders?: [string, string] | null;
  /** Error indicator characters [underflow, overflow] */
  errors?: [string, string];
}

const DEFAULT_OPTIONS: Required<BarOptions> = {
  chars: "█",
  tip: "",
  background: " ",
  borders: ["|", "|"],
  errors: ["⚠", "✗"],
};

/**
 * Create a progress bar factory.
 *
 * @example
 * // Simple bar
 * barFactory()
 *
 * // Smooth gradient bar
 * barFactory({ chars: '▏▎▍▌▋▊▉█' })
 *
 * // Bar with custom tip
 * barFactory({ chars: '█', tip: '>' })
 *
 * // Bar with themed borders
 * barFactory({ borders: ['[', ']'], background: '-' })
 */
export function barFactory(options: BarOptions = {}): BarFactory {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (length: number): Bar => {
    const borderLeft = opts.borders ? opts.borders[0] : "";
    const borderRight = opts.borders ? opts.borders[1] : "";
    const borderWidth = borderLeft.length + borderRight.length;
    const innerLength = length - borderWidth;

    // Parse fill characters (gradient from empty to full)
    const fillChars = [...opts.chars];
    const hasGradient = fillChars.length > 1;
    // fillChars always has at least one char due to DEFAULT_OPTIONS
    const fullChar = fillChars[fillChars.length - 1];
    const bgChar = opts.background;
    const tipChars = opts.tip ? [...opts.tip] : [];
    const tipWidth = tipChars.length;

    return (percent: number, overflow = false, underflow = false): BarFrame => {
      // Clamp percent to 0-1 for display
      const clampedPercent = Math.max(0, Math.min(1, percent));
      const fillWidth = clampedPercent * innerLength;
      const fullCells = Math.floor(fillWidth);
      const partialFill = fillWidth - fullCells;

      let content = "";

      // Add left border
      content += borderLeft;

      // Build the bar content
      const barCells: string[] = [];

      // Full cells
      for (let i = 0; i < fullCells && i < innerLength; i++) {
        barCells.push(fullChar);
      }

      // Partial cell (gradient)
      if (hasGradient && fullCells < innerLength && partialFill > 0) {
        const gradientIndex = Math.floor(partialFill * (fillChars.length - 1));
        barCells.push(fillChars[gradientIndex]);
      } else if (tipWidth > 0 && fullCells < innerLength && fullCells > 0) {
        // Show tip at the progress edge
        barCells.pop(); // Remove last full cell
        for (const tipChar of tipChars) {
          if (barCells.length < innerLength) {
            barCells.push(tipChar);
          }
        }
      }

      // Fill remaining with background
      while (barCells.length < innerLength) {
        barCells.push(bgChar);
      }

      content += barCells.slice(0, innerLength).join("");

      // Add right border with error indicators
      if (overflow) {
        content += opts.errors[1];
      } else if (underflow) {
        content += opts.errors[0];
      } else {
        content += borderRight;
      }

      return {
        content,
        width: length,
      };
    };
  };
}

/**
 * Create a smooth bar with sub-character precision.
 */
export function smoothBar(): BarFactory {
  return barFactory({
    chars: "▏▎▍▌▋▊▉█",
    background: " ",
    borders: ["|", "|"],
  });
}

/**
 * Create a classic block-style bar.
 */
export function classicBar(): BarFactory {
  return barFactory({
    chars: "#",
    background: "-",
    borders: ["[", "]"],
  });
}

/**
 * Create a bar with blocks of increasing fill.
 */
export function blocksBar(): BarFactory {
  return barFactory({
    chars: "░▒▓█",
    background: " ",
    borders: ["│", "│"],
  });
}

/**
 * Create a bubbles-style bar.
 */
export function bubblesBar(): BarFactory {
  return barFactory({
    chars: "∙○⦿●",
    background: " ",
    borders: ["<", ">"],
  });
}

/**
 * Create a fish-themed bar.
 */
export function fishBar(): BarFactory {
  return barFactory({
    chars: "░",
    tip: "><>",
    background: "~",
    borders: ["|", "|"],
  });
}

/**
 * Create a Halloween-themed bar.
 */
export function halloweenBar(): BarFactory {
  return barFactory({
    chars: "█",
    tip: "🎃",
    background: " ",
    borders: ["🦇", "🦇"],
    errors: ["😱", "🗡"],
  });
}

/**
 * Create a bar with no visible characters (tip only).
 */
export function tipOnlyBar(tip = ">"): BarFactory {
  return barFactory({
    chars: " ",
    tip,
    background: "·",
    borders: ["[", "]"],
  });
}

/**
 * Create a custom bar with arrows.
 */
export function arrowBar(): BarFactory {
  return barFactory({
    chars: "=",
    tip: ">",
    background: " ",
    borders: ["[", "]"],
  });
}
