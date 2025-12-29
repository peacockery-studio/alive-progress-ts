# AI Agent Instructions

This document provides context for AI agents (Claude, Copilot, Cursor, etc.) working on this codebase.

## Project Overview

**alive-progress** is a TypeScript port of the Python [alive-progress](https://github.com/rsalmei/alive-progress) library. It provides animated CLI progress bars with spinners, themes, and ETA calculation.

## Quick Commands

```bash
bun install          # Install dependencies
bun test             # Run tests (231 tests)
bun run build        # Build to dist/
bun run typecheck    # Type check
bun run lint         # Lint with Ultracite/Biome
bun run lint:fix     # Auto-fix lint issues
bun run demo         # Run demo
```

## Project Structure

```
src/
├── index.ts              # Main exports (aliveBar, aliveIt, etc.)
├── demo.ts               # Demo script
├── core/
│   ├── progress.ts       # Main progress bar logic
│   ├── configuration.ts  # Config validation
│   ├── calibration.ts    # FPS/timing calibration
│   └── hook-manager.ts   # Console interception
├── animations/
│   ├── spinners.ts       # Spinner factories
│   └── bars.ts           # Bar factories
├── styles/
│   └── internal.ts       # Built-in spinners, bars, themes
└── utils/
    ├── cells.ts          # Unicode cell width handling
    ├── colors.ts         # ANSI color utilities
    ├── timing.ts         # ETA/rate calculation
    └── terminal/         # TTY detection and output
```

## Key Concepts

- **Spinners**: Animated characters (dots, arrows, moon phases, etc.)
- **Bars**: Progress bar styles (smooth, blocks, bubbles, etc.)
- **Themes**: Presets combining spinner + bar + unknown style
- **Cells**: Unicode-aware character width calculation

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `fix: <msg>` → Patch release
- `feat: <msg>` → Minor release
- `feat!: <msg>` → Major release
- `docs:`, `chore:`, `refactor:`, `test:`, `ci:` → No release

Releases are automatic via semantic-release on push to main.

## Code Style

- TypeScript with strict mode
- Ultracite/Biome for linting and formatting
- Pre-commit hooks enforce tests + formatting
- No semicolons (Biome default)

## Testing

Tests use Bun's built-in test runner:

```bash
bun test                    # Run all tests
bun test --watch            # Watch mode
bun test tests/bars.test.ts # Single file
```

## Important Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Public API exports |
| `src/core/progress.ts` | Core progress bar implementation |
| `src/styles/internal.ts` | All built-in spinners/bars/themes |
| `.releaserc.json` | Semantic-release config |
| `biome.jsonc` | Linter/formatter config |

## Dependencies

- **grapheme-splitter**: Unicode grapheme cluster handling
- **Dev**: TypeScript, Biome, Ultracite, Husky, semantic-release

## Attribution

This is a TypeScript port. Credit to [@rsalmei](https://github.com/rsalmei) for the original Python implementation.
