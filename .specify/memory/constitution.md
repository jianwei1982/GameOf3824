# 24 Game - Project Constitution
<!-- Online 24-point card game -->

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)
All code MUST be clean, readable, and maintainable. Functions MUST have a single responsibility. Code SHOULD be self-documenting with clear naming; comments only explain *why*, not *what*. No code duplication - extract to shared utilities. All code MUST pass linting before commit.

### II. Testing Standards (NON-NEGOTIABLE)
Core game logic MUST have unit tests with 80% minimum coverage. Every bug fix MUST include a regression test. Tests MUST run automatically on every commit via CI. Integration tests MUST verify the complete game flow works end-to-end. Test files MUST live alongside source files (e.g., `game.js` and `game.test.js`).

### III. User Experience Consistency
All UI components MUST follow consistent design patterns. Color schemes, typography, and spacing MUST be defined in a shared design system. All interactive elements MUST provide visual feedback (hover, active, disabled states). The game MUST behave identically across all supported browsers. User-facing text MUST be centralized in message files for consistency.

### IV. Performance Requirements (NON-NEGOTIABLE)
The game MUST load in under 2 seconds on standard 3G connections. All interactions MUST respond within 100ms. Memory footprint MUST stay under 50MB. Animations MUST run at 60fps. The game MUST work offline after initial load. Performance budgets MUST be defined and tracked in CI.

## Technology Constraints

**Platform**: Web-based (browser)
- MUST support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- MUST be responsive: works on desktop, tablet, and mobile
- Target: Progressive Web App (PWA) for offline capability

**Stack**: Vanilla JavaScript preferred for simplicity, or lightweight framework if needed
- Minimal dependencies to reduce bundle size
- No server required for core gameplay

## Development Workflow

**Code Review**:
- All changes MUST be reviewed before merge
- Reviewer MUST verify tests pass and performance is acceptable
- Code MUST meet all constitutional principles before approval

**Testing Gates**:
- Unit tests MUST pass before PR can merge
- Integration tests MUST pass before release
- Performance tests MUST meet budgets before release

## Governance

**Version**: 1.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22

**Amendment Procedure**:
- Any principle change requires a PR with justification
- Breaking changes to testing or performance standards are MAJOR version bumps
- Non-breaking additions are MINOR version bumps
- Clarifications and typo fixes are PATCH version bumps