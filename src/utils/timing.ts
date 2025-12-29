/**
 * Timing utilities for ETA calculation with exponential smoothing.
 */

/**
 * Format a duration in seconds to a human-readable string.
 */
export function formatDuration(seconds: number, short = false): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return short ? "?" : "?";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);

  if (short) {
    // Short format for display
    if (hours > 0) {
      return `${hours}h${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m${secs}s`;
    }
    if (secs > 0) {
      return `${secs}.${ms}s`;
    }
    return `0.${ms}s`;
  }

  // Long format
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  if (minutes > 0) {
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  }
  return `${secs}.${ms}s`;
}

/**
 * Format a rate (items per second) to a human-readable string.
 */
export function formatRate(rate: number, unit = ""): string {
  if (!Number.isFinite(rate) || rate < 0) {
    return "?/s";
  }

  const unitStr = unit ? ` ${unit}` : "";

  if (rate >= 1_000_000) {
    return `${(rate / 1_000_000).toFixed(1)}M${unitStr}/s`;
  }
  if (rate >= 1000) {
    return `${(rate / 1000).toFixed(1)}k${unitStr}/s`;
  }
  if (rate >= 100) {
    return `${Math.round(rate)}${unitStr}/s`;
  }
  if (rate >= 1) {
    return `${rate.toFixed(1)}${unitStr}/s`;
  }
  return `${rate.toFixed(2)}${unitStr}/s`;
}

/**
 * Exponential smoothing for rate calculation.
 * Uses the formula: y_hat = alpha * y + (1 - alpha) * y_hat
 */
export class RateSmoother {
  private smoothedRate = 0;
  private readonly alpha: number;
  private initialized = false;

  constructor(alpha = 0.1) {
    this.alpha = alpha;
  }

  /**
   * Update the smoothed rate with a new sample.
   */
  update(rate: number): number {
    if (this.initialized) {
      this.smoothedRate =
        this.alpha * rate + (1 - this.alpha) * this.smoothedRate;
    } else {
      this.smoothedRate = rate;
      this.initialized = true;
    }
    return this.smoothedRate;
  }

  /**
   * Get the current smoothed rate.
   */
  get(): number {
    return this.smoothedRate;
  }

  /**
   * Reset the smoother.
   */
  reset(): void {
    this.smoothedRate = 0;
    this.initialized = false;
  }
}

/**
 * Timer class for tracking elapsed time.
 */
export class Timer {
  private startTime: number;
  private pausedTime = 0;
  private pauseStart: number | null = null;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get elapsed time in seconds.
   */
  elapsed(): number {
    const now = Date.now();
    const pausedDuration = this.pauseStart ? now - this.pauseStart : 0;
    return (now - this.startTime - this.pausedTime - pausedDuration) / 1000;
  }

  /**
   * Pause the timer.
   */
  pause(): void {
    if (this.pauseStart === null) {
      this.pauseStart = Date.now();
    }
  }

  /**
   * Resume the timer.
   */
  resume(): void {
    if (this.pauseStart !== null) {
      this.pausedTime += Date.now() - this.pauseStart;
      this.pauseStart = null;
    }
  }

  /**
   * Check if timer is paused.
   */
  isPaused(): boolean {
    return this.pauseStart !== null;
  }

  /**
   * Reset the timer.
   */
  reset(): void {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.pauseStart = null;
  }
}

/**
 * ETA calculator using exponential smoothing.
 */
export class ETACalculator {
  private readonly rateSmoother: RateSmoother;
  private lastCount = 0;
  private lastTime = 0;

  constructor(alpha = 0.1) {
    this.rateSmoother = new RateSmoother(alpha);
    this.lastTime = Date.now();
  }

  /**
   * Update with current progress and get ETA.
   * @param current Current progress count
   * @param total Total items
   * @returns ETA in seconds, or Infinity if cannot calculate
   */
  update(current: number, total: number): number {
    const now = Date.now();
    const timeDelta = (now - this.lastTime) / 1000;

    if (timeDelta > 0) {
      const countDelta = current - this.lastCount;
      if (countDelta > 0) {
        const instantRate = countDelta / timeDelta;
        this.rateSmoother.update(instantRate);
      }
      this.lastTime = now;
      this.lastCount = current;
    }

    const rate = this.rateSmoother.get();
    if (rate <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    const remaining = total - current;
    return remaining / rate;
  }

  /**
   * Get current rate (items per second).
   */
  getRate(): number {
    return this.rateSmoother.get();
  }

  /**
   * Reset the calculator.
   */
  reset(): void {
    this.rateSmoother.reset();
    this.lastCount = 0;
    this.lastTime = Date.now();
  }
}
