/**
 * Hook manager for intercepting console.log and enriching output.
 *
 * When enabled, console.log() calls are captured, enriched with the
 * current progress position, and printed correctly without disrupting
 * the progress bar display.
 */

type ConsoleLogFn = typeof console.log;

interface HookContext {
  originalLog: ConsoleLogFn;
  originalError: ConsoleLogFn;
  originalWarn: ConsoleLogFn;
  isActive: boolean;
  position: number;
  enrichPrint: boolean;
  enrichOffset: number;
  printFn: (text: string) => void;
}

let hookContext: HookContext | null = null;

/**
 * Format a message with position enrichment.
 */
function enrichMessage(
  message: string,
  position: number,
  offset: number
): string {
  const pos = position + offset;
  const prefix = `on ${pos}: `;
  const indent = " ".repeat(prefix.length);

  // Handle multiline messages
  const lines = message.split("\n");
  if (lines.length === 1) {
    return prefix + message;
  }

  return lines.map((line, i) => (i === 0 ? prefix : indent) + line).join("\n");
}

/**
 * Create an intercepting log function.
 */
function createInterceptor(
  context: HookContext,
  original: ConsoleLogFn
): ConsoleLogFn {
  return (...args: Parameters<ConsoleLogFn>) => {
    if (!context.isActive) {
      original.apply(console, args);
      return;
    }

    // Format the message
    const message = args
      .map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        if (arg === null) {
          return "null";
        }
        if (arg === undefined) {
          return "undefined";
        }
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      })
      .join(" ");

    // Enrich with position if enabled
    const enriched = context.enrichPrint
      ? enrichMessage(message, context.position, context.enrichOffset)
      : message;

    // Output through the progress bar's print function
    context.printFn(enriched);
  };
}

/**
 * Install hooks to intercept console output.
 */
export function installHooks(options: {
  enrichPrint: boolean;
  enrichOffset: number;
  printFn: (text: string) => void;
}): void {
  if (hookContext) {
    // Already installed
    return;
  }

  hookContext = {
    originalLog: console.log,
    originalError: console.error,
    originalWarn: console.warn,
    isActive: true,
    position: 0,
    enrichPrint: options.enrichPrint,
    enrichOffset: options.enrichOffset,
    printFn: options.printFn,
  };

  console.log = createInterceptor(hookContext, hookContext.originalLog);
  console.error = createInterceptor(hookContext, hookContext.originalError);
  console.warn = createInterceptor(hookContext, hookContext.originalWarn);
}

/**
 * Uninstall hooks and restore original console functions.
 */
export function uninstallHooks(): void {
  if (!hookContext) {
    return;
  }

  console.log = hookContext.originalLog;
  console.error = hookContext.originalError;
  console.warn = hookContext.originalWarn;
  hookContext = null;
}

/**
 * Update the current position for enrichment.
 */
export function updatePosition(position: number): void {
  if (hookContext) {
    hookContext.position = position;
  }
}

/**
 * Temporarily pause hooks (for printing the bar itself).
 */
export function pauseHooks(): void {
  if (hookContext) {
    hookContext.isActive = false;
  }
}

/**
 * Resume hooks after pause.
 */
export function resumeHooks(): void {
  if (hookContext) {
    hookContext.isActive = true;
  }
}

/**
 * Check if hooks are currently installed.
 */
export function hooksInstalled(): boolean {
  return hookContext !== null;
}

/**
 * Direct print that bypasses hooks.
 */
export function directPrint(message: string): void {
  if (hookContext) {
    hookContext.originalLog.call(console, message);
  } else {
    console.log(message);
  }
}
