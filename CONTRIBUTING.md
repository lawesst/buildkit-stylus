# Contributing to BuildKit (Stylus Edition)

Thank you for your interest in contributing to BuildKit! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/buildkit-stylus.git`
3. Install dependencies: `pnpm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust (latest stable)
- cargo-stylus installed
- WASM target: `rustup target add wasm32-unknown-unknown`

### Running the Project

```bash
# Install dependencies
pnpm install

# Build Stylus contracts
pnpm stylus:build

# Start frontend
pnpm dev

# Start indexer
pnpm indexer:start

# Start dashboard
pnpm dashboard:dev
```

### Code Style

- **TypeScript/JavaScript**: Follow existing code style, use TypeScript for type safety
- **Rust**: Follow Rust standard formatting (`cargo fmt`)
- **Comments**: Write clear, concise comments explaining "why" not "what"
- **Naming**: Use descriptive names, follow existing conventions

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(contracts): add gasless message posting`
- `fix(frontend): resolve wallet connection issue`
- `docs(readme): update deployment instructions`

## Pull Request Process

1. **Update Documentation**: Ensure README and relevant docs are updated
2. **Add Tests**: Include tests for new features when applicable
3. **Check Linting**: Run `pnpm lint` and fix any issues
4. **Test Locally**: Verify your changes work as expected
5. **Write Clear PR Description**: Explain what changes you made and why

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Documentation updated (if needed)
- [ ] Tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Changes tested locally

## Project Structure

```
buildkit-stylus/
├── packages/
│   ├── stylus-contracts/    # Rust smart contracts
│   ├── frontend/            # Next.js frontend
│   ├── indexer/             # Event indexing service
│   ├── dashboard/           # Analytics dashboard
│   └── cli/                 # CLI tools
├── docs/                    # Additional documentation
└── scripts/                 # Utility scripts
```

## Areas for Contribution

- **Stylus Contracts**: New contract archetypes, optimizations
- **Frontend**: UI improvements, new features
- **Indexer**: Performance improvements, new event types
- **Documentation**: Tutorials, guides, examples
- **Testing**: Unit tests, integration tests
- **Tooling**: Developer experience improvements

## Questions?

Open an issue with the `question` label, or reach out to the maintainers.

Thank you for contributing! 🚀
