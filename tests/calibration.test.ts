import { describe, test, expect } from 'bun:test';
import {
  calculateFps,
  calculateRefreshInterval,
  getFixedInterval,
  calibrationInfo
} from '../src/core/calibration';

describe('calculateFps', () => {
  test('returns minimum FPS for zero rate', () => {
    expect(calculateFps(0)).toBe(2);
  });

  test('returns minimum FPS for negative rate', () => {
    expect(calculateFps(-5)).toBe(2);
  });

  test('returns higher FPS for higher rates', () => {
    const lowFps = calculateFps(10);
    const highFps = calculateFps(10000);
    expect(highFps).toBeGreaterThan(lowFps);
  });

  test('FPS is capped at maximum (60)', () => {
    const fps = calculateFps(100000000);
    expect(fps).toBeLessThanOrEqual(60);
  });

  test('FPS is at least minimum (2)', () => {
    const fps = calculateFps(0.001);
    expect(fps).toBeGreaterThanOrEqual(2);
  });

  test('calibration parameter affects FPS calculation', () => {
    // With higher calibration value, same rate gives lower FPS
    const fpsLowCal = calculateFps(1000, 1000);
    const fpsHighCal = calculateFps(1000, 1000000);
    expect(fpsLowCal).toBeGreaterThan(fpsHighCal);
  });

  test('at calibration rate, FPS approaches maximum', () => {
    const fps = calculateFps(1000000, 1000000);
    expect(fps).toBeCloseTo(60, 0);
  });
});

describe('calculateRefreshInterval', () => {
  test('returns interval in milliseconds', () => {
    const interval = calculateRefreshInterval(1000);
    expect(interval).toBeGreaterThan(0);
    expect(interval).toBeLessThan(1000);
  });

  test('higher rate gives shorter interval', () => {
    const slowInterval = calculateRefreshInterval(10);
    const fastInterval = calculateRefreshInterval(100000);
    expect(fastInterval).toBeLessThan(slowInterval);
  });

  test('zero rate gives maximum interval', () => {
    const interval = calculateRefreshInterval(0);
    expect(interval).toBe(500); // 1000 / 2 FPS
  });
});

describe('getFixedInterval', () => {
  test('returns null for zero refresh rate', () => {
    expect(getFixedInterval(0)).toBeNull();
  });

  test('returns null for negative refresh rate', () => {
    expect(getFixedInterval(-1)).toBeNull();
  });

  test('converts seconds to milliseconds', () => {
    expect(getFixedInterval(1)).toBe(1000);
    expect(getFixedInterval(0.1)).toBe(100);
    expect(getFixedInterval(0.5)).toBe(500);
  });
});

describe('calibrationInfo', () => {
  test('returns FPS values for various rates', () => {
    const info = calibrationInfo();

    // Should have entries for standard rates
    expect(info[1]).toBeDefined();
    expect(info[10]).toBeDefined();
    expect(info[100]).toBeDefined();
    expect(info[1000]).toBeDefined();
    expect(info[10000]).toBeDefined();
    expect(info[100000]).toBeDefined();
    expect(info[1000000]).toBeDefined();
    expect(info[10000000]).toBeDefined();
  });

  test('FPS increases with rate', () => {
    const info = calibrationInfo();

    expect(info[10]).toBeGreaterThan(info[1]);
    expect(info[100]).toBeGreaterThan(info[10]);
    expect(info[1000]).toBeGreaterThan(info[100]);
  });

  test('respects calibration parameter', () => {
    const info1 = calibrationInfo(1000);
    const info2 = calibrationInfo(1000000);

    // At rate 1000, lower calibration gives higher FPS
    expect(info1[1000]).toBeGreaterThan(info2[1000]);
  });
});
