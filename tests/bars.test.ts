import { describe, expect, test } from "bun:test";
import {
  arrowBar,
  type BarFactory,
  barFactory,
  blocksBar,
  bubblesBar,
  classicBar,
  fishBar,
  halloweenBar,
  smoothBar,
  tipOnlyBar,
} from "../src/animations/bars";

describe("barFactory", () => {
  test("creates a bar with default options", () => {
    const factory = barFactory();
    const bar = factory(20);

    expect(typeof bar).toBe("function");

    const frame = bar(0.5);
    expect(frame.width).toBe(20);
    expect(frame.content).toBeDefined();
  });

  test("renders empty bar at 0%", () => {
    const factory = barFactory({
      chars: "#",
      background: "-",
      borders: ["[", "]"],
    });
    const bar = factory(12);

    const frame = bar(0);
    expect(frame.content).toBe("[----------]");
  });

  test("renders full bar at 100%", () => {
    const factory = barFactory({
      chars: "#",
      background: "-",
      borders: ["[", "]"],
    });
    const bar = factory(12);

    const frame = bar(1);
    expect(frame.content).toBe("[##########]");
  });

  test("renders partial bar", () => {
    const factory = barFactory({
      chars: "#",
      background: "-",
      borders: ["[", "]"],
    });
    const bar = factory(12);

    const frame = bar(0.5);
    // Should be approximately half filled
    expect(frame.content).toMatch(/\[#+-+\]/);
  });

  test("supports gradient chars", () => {
    const factory = barFactory({
      chars: "▏▎▍▌▋▊▉█",
      background: " ",
      borders: ["|", "|"],
    });
    const bar = factory(10);

    const frame = bar(0.5);
    expect(frame.content.length).toBe(10);
  });

  test("supports custom borders", () => {
    const factory = barFactory({
      chars: "█",
      background: " ",
      borders: ["<", ">"],
    });
    const bar = factory(10);

    const frame = bar(0.5);
    expect(frame.content.startsWith("<")).toBe(true);
    expect(frame.content.endsWith(">")).toBe(true);
  });

  test("supports no borders", () => {
    const factory = barFactory({ chars: "█", background: "-", borders: null });
    const bar = factory(10);

    const frame = bar(0.5);
    expect(frame.content.length).toBe(10);
    expect(frame.content).not.toContain("[");
    expect(frame.content).not.toContain("]");
  });

  test("shows overflow indicator", () => {
    const factory = barFactory({
      chars: "#",
      background: "-",
      borders: ["[", "]"],
      errors: ["⚠", "✗"],
    });
    const bar = factory(12);

    const frame = bar(1.5, true, false);
    expect(frame.content.endsWith("✗")).toBe(true);
  });

  test("shows underflow indicator", () => {
    const factory = barFactory({
      chars: "#",
      background: "-",
      borders: ["[", "]"],
      errors: ["⚠", "✗"],
    });
    const bar = factory(12);

    const frame = bar(0.5, false, true);
    expect(frame.content.endsWith("⚠")).toBe(true);
  });
});

describe("built-in bars", () => {
  const barFactories: [string, BarFactory][] = [
    ["smooth", smoothBar()],
    ["classic", classicBar()],
    ["blocks", blocksBar()],
    ["bubbles", bubblesBar()],
    ["fish", fishBar()],
    ["halloween", halloweenBar()],
    ["arrow", arrowBar()],
    ["tipOnly", tipOnlyBar(">")],
  ];

  for (const [name, factory] of barFactories) {
    describe(`${name} bar`, () => {
      test("creates bar with correct width", () => {
        const bar = factory(20);
        const frame = bar(0.5);
        expect(frame.width).toBe(20);
      });

      test("handles 0% progress", () => {
        const bar = factory(20);
        const frame = bar(0);
        expect(frame.content).toBeDefined();
      });

      test("handles 100% progress", () => {
        const bar = factory(20);
        const frame = bar(1);
        expect(frame.content).toBeDefined();
      });

      test("handles 50% progress", () => {
        const bar = factory(20);
        const frame = bar(0.5);
        expect(frame.content).toBeDefined();
      });

      test("handles overflow", () => {
        const bar = factory(20);
        const frame = bar(1.5, true);
        expect(frame.content).toBeDefined();
      });
    });
  }
});

describe("bar progress accuracy", () => {
  test("fill increases with progress", () => {
    const factory = barFactory({ chars: "█", background: " ", borders: null });
    const bar = factory(20);

    const frame25 = bar(0.25);
    const frame50 = bar(0.5);
    const frame75 = bar(0.75);

    // Count filled characters
    const count25 = (frame25.content.match(/█/g) || []).length;
    const count50 = (frame50.content.match(/█/g) || []).length;
    const count75 = (frame75.content.match(/█/g) || []).length;

    expect(count50).toBeGreaterThan(count25);
    expect(count75).toBeGreaterThan(count50);
  });

  test("empty at 0%", () => {
    const factory = barFactory({ chars: "█", background: "-", borders: null });
    const bar = factory(10);

    const frame = bar(0);
    expect(frame.content).toBe("----------");
  });

  test("full at 100%", () => {
    const factory = barFactory({ chars: "█", background: "-", borders: null });
    const bar = factory(10);

    const frame = bar(1);
    expect(frame.content).toBe("██████████");
  });
});

describe("bar with tip", () => {
  test("shows tip at progress edge", () => {
    const factory = barFactory({
      chars: "=",
      tip: ">",
      background: " ",
      borders: ["[", "]"],
    });
    const bar = factory(12);

    const frame = bar(0.5);
    // Tip should be visible somewhere in the middle
    expect(frame.content).toContain(">");
  });
});

describe("bar clamps percent", () => {
  test("clamps negative percent to 0", () => {
    const factory = barFactory({ chars: "█", background: "-", borders: null });
    const bar = factory(10);

    const frame = bar(-0.5);
    // Should render as 0%
    expect(frame.content).toBe("----------");
  });

  test("clamps percent > 1 to 1 for display", () => {
    const factory = barFactory({ chars: "█", background: "-", borders: null });
    const bar = factory(10);

    const frame = bar(1.5);
    // Should render as 100% (all filled)
    expect(frame.content).toBe("██████████");
  });
});
