# Default recipe - show available commands
default:
    @just --list

# Install dependencies
install:
    bun install

# Build the project
build:
    bun run build

# Run tests
test:
    bun test

# Run tests with coverage
coverage:
    bun test --coverage

# Run tests in watch mode
test-watch:
    bun test --watch

# Type check without emitting
typecheck:
    bun run tsc --noEmit

# Lint the codebase
lint:
    bun x ultracite check

# Fix lint issues
lint-fix:
    bun x ultracite fix

# Run the demo
demo:
    bun run demo

# Build and run demo
run-demo: build
    bun run dist/demo.js

# Clean build artifacts
clean:
    rm -rf dist coverage

# Full check (typecheck + lint + test)
check: typecheck lint test

# Prepare for release (clean + install + check + build)
prepare: clean install check build
