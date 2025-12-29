/**
 * FPS calibration for dynamic refresh rates.
 *
 * The refresh rate scales logarithmically with throughput:
 * - Slow operations: ~2-10 FPS (visible spinner changes)
 * - Fast operations: up to 60 FPS (smooth animation)
 *
 * Formula: fps = log10(rate * adjust + 1) * factor + minFps
 */

const MIN_FPS = 2;
const MAX_FPS = 60;
const _FACTOR = 10;

/**
 * Calculate the ideal FPS based on current throughput.
 *
 * @param rate - Current items per second
 * @param calibrate - Calibration value (items/sec that equals MAX_FPS)
 * @returns Target FPS
 */
export function calculateFps(rate: number, calibrate = 1_000_000): number {
  if (rate <= 0) {
    return MIN_FPS;
  }

  // Adjust rate relative to calibration target
  const adjust = MAX_FPS / Math.log10(calibrate + 1);
  const fps = Math.log10(rate + 1) * adjust;

  // Clamp to valid range
  return Math.min(MAX_FPS, Math.max(MIN_FPS, fps));
}

/**
 * Calculate the refresh interval in milliseconds.
 *
 * @param rate - Current items per second
 * @param calibrate - Calibration value
 * @returns Interval in milliseconds
 */
export function calculateRefreshInterval(
  rate: number,
  calibrate = 1_000_000
): number {
  const fps = calculateFps(rate, calibrate);
  return 1000 / fps;
}

/**
 * Calculate fixed refresh interval if specified.
 *
 * @param refreshSecs - Fixed refresh rate in seconds (0 for auto)
 * @returns Interval in milliseconds, or null for auto
 */
export function getFixedInterval(refreshSecs: number): number | null {
  if (refreshSecs <= 0) {
    return null;
  }
  return refreshSecs * 1000;
}

/**
 * Calibration helper for testing different rates.
 */
export function calibrationInfo(calibrate = 1_000_000): Record<number, number> {
  const rates = [1, 10, 100, 1000, 10_000, 100_000, 1_000_000, 10_000_000];
  const result: Record<number, number> = {};

  for (const rate of rates) {
    result[rate] = Math.round(calculateFps(rate, calibrate) * 10) / 10;
  }

  return result;
}
