# Contributing to alive-progress

Thanks for your interest in contributing!

## Development Setup

```bash
# Clone the repo

git clone [github.com/peacockery-studio](https://github.com/peacockery-studio/alive-progress-ts.git)
cd alive-progress-ts

# Install dependencies

bun install

# Run tests

bun test

# Build

bun run build

# Run demo

bun run demo

```text

## Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run tests |
| `bun test --watch` | Run tests in watch mode |
| `bun test --coverage` | Run tests with coverage |
| `bun run build` | Build to dist/ |
| `bun run typecheck` | Type check without emitting |
| `bun run lint` | Lint the codebase |
| `bun run lint:fix` | Fix lint issues |
| `bun run demo` | Run the demo |

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic releases.

### Format

```text
<type>: <description>

[optional body]

```text

### Types

| Type | Description | Release |
|------|-------------|---------|
| `feat:` | New feature | Minor (0.x.0) |
| `fix:` | Bug fix | Patch (0.0.x) |
| `feat!:` | Breaking change | Major (x.0.0) |
| `docs:` | Documentation only | No release |
| `chore:` | Maintenance | No release |
| `refactor:` | Code refactoring | No release |
| `test:` | Adding tests | No release |
| `ci:` | CI/CD changes | No release |

### Examples

```bash
# Patch release (1.0.0 → 1.0.1)

git commit -m "fix: handle empty arrays correctly"

# Minor release (1.0.0 → 1.1.0)

git commit -m "feat: add new moon spinner"

# Major release (1.0.0 → 2.0.0)

git commit -m "feat!: change aliveBar API signature"

# No release

git commit -m "docs: update README examples"
git commit -m "chore: update dependencies"

```text

## Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run tests (`bun test`)
5. Run lint (`bun run lint`)
6. Commit with conventional commit message
7. Push and open a PR

## Code Style

- We use [Ultracite](https://github.com/haydenbleasel/ultracite) (Biome) for linting/formatting
- Pre-commit hooks run automatically (tests + formatting)
- TypeScript strict mode is enabled

## Project Structure

```text
src/
├── index.ts          # Main exports
├── demo.ts           # Demo script
├── core/             # Core progress bar logic
├── animations/       # Spinners and bars
├── styles/           # Built-in themes
└── utils/            # Utilities (cells, colors, timing)

tests/                # Test files (*.test.ts)

```text

## Attribution

This is a TypeScript port of the Python [alive-progress](https://github.com/rsalmei/alive-progress) library by [@rsalmei](https://github.com/rsalmei).
