# Contributing to CoachDoku

Thanks for considering a contribution. CoachDoku is community-driven and we appreciate help.

## Ways to contribute

- **Add a new technique**: implement a Sudoku solving technique we don't have yet. See [adding-techniques.md](./adding-techniques.md).
- **Improve an existing technique**: better detection, better explanation, more test coverage.
- **Translate**: add a new language to `src/i18n/`.
- **Improve the UI**: design fixes, accessibility, animations, mobile polish.
- **Fix bugs**: see open issues tagged "bug" or "good first issue".
- **Documentation**: anywhere you got stuck reading the docs, that's an opportunity to fix.

## Before you start

For non-trivial changes, open an issue first. We may already be working on it, or have opinions on the approach.

## Conventions

- TypeScript strict mode. Comments and identifiers in English.
- Prefer pure functions over classes in the core. Immutable data in the solver.
- Descriptive names: `candidates` not `cands`, `eliminations` not `elims`.
- No em-dashes or en-dashes anywhere. Use commas, hyphens, or parentheses.
- One technique per file under `src/core/techniques/`, one test file per technique under `tests/techniques/`.
- Coordinate notation: `R1C1` through `R9C9` in user-facing text, 0-indexed integers internally.

## Pull request process

1. Fork the repo, create a feature branch.
2. Make your changes following the conventions.
3. Add or update tests. All existing tests must still pass.
4. Run `npm run test` and `npm run lint` locally.
5. Open a PR with a clear description: what changes, why, and how to verify.
6. Address review comments. Be patient; this is volunteer work.

## Code of Conduct

We follow the Contributor Covenant. Be respectful, assume good faith, focus on the work. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree your contributions are licensed under Apache 2.0.
