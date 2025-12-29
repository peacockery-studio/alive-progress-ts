#!/usr/bin/env node
/**
 * Demo showcasing the alive-progress library features.
 */

import {
  aliveBar,
  aliveIt,
  listBars,
  listSpinners,
  listThemes,
} from "./index.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function basicDemo() {
  console.log("\n🚀 Basic Progress Bar Demo\n");
  console.log("─".repeat(50));

  const { bar, done } = aliveBar(50, { title: "Processing" });

  for (let i = 0; i < 50; i++) {
    await sleep(50);
    bar();
  }

  done();
  console.log("\n");
}

async function spinnerShowcase() {
  console.log("\n✨ Spinner Showcase\n");
  console.log("─".repeat(50));

  const spinnerNames = [
    "dots",
    "dots2",
    "classic",
    "bounce",
    "arrows",
    "circle",
    "pulse",
    "star",
    "moon",
    "hearts",
  ];

  for (const name of spinnerNames) {
    const { bar, done } = aliveBar(20, {
      title: `${name.padEnd(12)}`,
      spinner: name,
      bar: "smooth",
    });

    for (let i = 0; i < 20; i++) {
      await sleep(40);
      bar();
    }

    done();
  }

  console.log("\n");
}

async function barShowcase() {
  console.log("\n📊 Bar Style Showcase\n");
  console.log("─".repeat(50));

  const barNames = [
    "smooth",
    "classic",
    "blocks",
    "bubbles",
    "ascii",
    "solid",
    "fancy",
    "minimal",
  ];

  for (const name of barNames) {
    const { bar, done } = aliveBar(20, {
      title: `${name.padEnd(12)}`,
      bar: name,
      spinner: "dots",
    });

    for (let i = 0; i < 20; i++) {
      await sleep(40);
      bar();
    }

    done();
  }

  console.log("\n");
}

async function themeShowcase() {
  console.log("\n🎨 Theme Showcase\n");
  console.log("─".repeat(50));

  const themeNames = listThemes().filter((t) => t !== "default");

  for (const name of themeNames) {
    const { bar, done } = aliveBar(20, {
      title: `${name.padEnd(12)}`,
      theme: name,
    });

    for (let i = 0; i < 20; i++) {
      await sleep(40);
      bar();
    }

    done();
  }

  console.log("\n");
}

async function manualModeDemo() {
  console.log("\n🎛️  Manual Mode Demo\n");
  console.log("─".repeat(50));

  const { bar, done } = aliveBar(100, {
    title: "Downloading",
    manual: true,
    bar: "smooth",
  });

  // Simulate variable progress
  const stages = [0.1, 0.25, 0.3, 0.5, 0.6, 0.75, 0.9, 1.0];

  for (const progress of stages) {
    await sleep(300);
    bar(progress);
    bar.text = `${Math.round(progress * 100)}% complete`;
  }

  done();
  console.log("\n");
}

async function unknownModeDemo() {
  console.log("\n❓ Unknown Total Demo\n");
  console.log("─".repeat(50));

  const { bar, done } = aliveBar(null, {
    title: "Scanning",
    spinner: "dots2",
  });

  // Simulate unknown duration
  for (let i = 0; i < 30; i++) {
    await sleep(100);
    bar();
    if (i === 10) {
      bar.text = "Found 100 files...";
    }
    if (i === 20) {
      bar.text = "Found 250 files...";
    }
  }

  done();
  console.log("\n");
}

async function iteratorDemo() {
  console.log("\n🔄 Iterator Demo (aliveIt)\n");
  console.log("─".repeat(50));

  const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

  for await (const _item of aliveIt(items, { title: "Processing items" })) {
    await sleep(60);
    // Just iterate through items
  }

  console.log("\n");
}

async function dualLineDemo() {
  console.log("\n📝 Dual Line Mode Demo\n");
  console.log("─".repeat(50));

  const { bar, done } = aliveBar(10, {
    title: "Tasks",
    dualLine: true,
    bar: "smooth",
  });

  const tasks = [
    "Initializing environment...",
    "Loading configuration...",
    "Connecting to database...",
    "Fetching user data...",
    "Processing records...",
    "Generating reports...",
    "Optimizing results...",
    "Saving to cache...",
    "Cleaning up...",
    "Finalizing...",
  ];

  for (const task of tasks) {
    bar.text = task;
    await sleep(400);
    bar();
  }

  done();
  console.log("\n");
}

async function consolePrintDemo() {
  console.log("\n🖨️  Console Print Demo (with enrichment)\n");
  console.log("─".repeat(50));

  const { bar, done } = aliveBar(20, {
    title: "Working",
    enrichPrint: true,
  });

  for (let i = 0; i < 20; i++) {
    await sleep(150);
    bar();

    // Print messages that will be enriched with position
    if (i === 5) {
      console.log("Found something interesting!");
    }
    if (i === 10) {
      console.log("Halfway there...");
    }
    if (i === 15) {
      console.log("Almost done!");
    }
  }

  done();
  console.log("\n");
}

function showAvailableStyles() {
  console.log("\n📋 Available Styles\n");
  console.log("─".repeat(50));

  console.log("\nSpinners:");
  const spinnerList = listSpinners();
  for (let i = 0; i < spinnerList.length; i += 6) {
    console.log(
      "  " +
        spinnerList
          .slice(i, i + 6)
          .map((s) => s.padEnd(14))
          .join("")
    );
  }

  console.log("\nBars:");
  const barList = listBars();
  for (let i = 0; i < barList.length; i += 6) {
    console.log(
      "  " +
        barList
          .slice(i, i + 6)
          .map((s) => s.padEnd(14))
          .join("")
    );
  }

  console.log("\nThemes:");
  const themeList = listThemes();
  console.log(`  ${themeList.join(", ")}`);

  console.log("\n");
}

async function main() {
  console.log(`\n${"═".repeat(50)}`);
  console.log("   🌟 alive-progress TypeScript Demo 🌟");
  console.log("═".repeat(50));

  await basicDemo();
  await spinnerShowcase();
  await barShowcase();
  await themeShowcase();
  await manualModeDemo();
  await unknownModeDemo();
  await iteratorDemo();
  await dualLineDemo();
  await consolePrintDemo();
  await showAvailableStyles();

  console.log("═".repeat(50));
  console.log("   Demo complete! 🎉");
  console.log("═".repeat(50));
  console.log("\n");
}

main().catch(console.error);
