# CoachDoku Roadmap

Milestones in delivery order. Each phase should ship something demoable.

## Phase 0: Foundation (week 1)

Goal: working dev environment, empty app boots, CI runs tests.

- [x] Vite + React + TypeScript + Tailwind scaffolding
- [x] Vitest configured, one trivial passing test
- [x] ESLint + Prettier configured
- [x] GitHub Actions: lint, test, build on PR
- [x] Apache 2.0 LICENSE, CODE_OF_CONDUCT, CONTRIBUTING stubs
- [x] Issue templates and PR template
- [x] Docker support: Dockerfile.dev for local dev, multi-stage Dockerfile for nginx-served prod, docker-compose for dev hot-reload

**Phase 0 status: complete (2026-05-10).** Docker support added on top of the original ROADMAP items.

Deliverable: deployable empty shell at coachdoku.dev (or chosen domain).

## Phase 1: Solver core, easy techniques (weeks 2-5)

Goal: solve any easy or medium Sudoku using human techniques.

- [ ] Board representation with bitmask candidates
- [ ] House and peer helpers
- [ ] Technique interface and registry
- [ ] DLX brute force fallback (for unique-solution checks)
- [ ] Techniques implemented:
  - [ ] Naked Single
  - [ ] Hidden Single
  - [ ] Locked Candidates (Pointing, Claiming)
  - [ ] Naked Pair / Triple / Quad
  - [ ] Hidden Pair / Triple / Quad
- [ ] Solver orchestrator that applies techniques in order until stuck
- [ ] Test suite: 500 plus easy and medium puzzles solved without brute force

Deliverable: CLI tool that solves a puzzle and prints the step list.

## Phase 2: First UI (weeks 6-8)

Goal: playable Sudoku in the browser with basic hints.

- [ ] Board component with cells, candidates display, selection
- [ ] Number pad, undo, redo, candidate mode toggle
- [ ] Puzzle library (50 hand-curated puzzles for testing)
- [ ] Basic hint button: shows next technique with simple highlighting
- [ ] Mobile-responsive layout
- [ ] PWA manifest, installable on mobile

Deliverable: usable Sudoku web app, no fancy explanations yet.

## Phase 3: Intermediate techniques (weeks 9-12)

Goal: solve hard puzzles, expand technique coverage.

- [ ] Techniques implemented:
  - [ ] X-Wing
  - [ ] Swordfish
  - [ ] Jellyfish
  - [ ] Skyscraper
  - [ ] Two-String Kite
  - [ ] Empty Rectangle
  - [ ] XY-Wing
  - [ ] XYZ-Wing
  - [ ] W-Wing
  - [ ] Simple Coloring
  - [ ] Remote Pairs
- [ ] Difficulty rating per puzzle based on hardest technique required
- [ ] Solver path visualization (step through solution)

Deliverable: solves 95 percent of human-solvable puzzles, displays the path.

## Phase 4: Coach engine (weeks 13-16)

The differentiator. Build the move evaluator and explanation system.

- [ ] Move evaluator with multi-criteria scoring
- [ ] Comparison engine: when multiple techniques apply, rank them
- [ ] Rationale generator: produce "why X over Y" text
- [ ] Progressive hint system (4 levels: focus zone, pattern type, full pattern, application)
- [ ] Explanation templates per technique (English)
- [ ] Visual hint renderer (cells, candidates, links highlighted)
- [ ] Cascade lookahead: detect when a move unlocks easier moves
- [ ] User profile: track which techniques the user has been shown vs. mastered

Deliverable: the coaching experience that distinguishes CoachDoku.

## Phase 5: Generator and tutorials (weeks 17-20)

- [ ] Random valid grid generator
- [ ] Clue removal with unique-solution preservation
- [ ] Calibrated generation: produce puzzle requiring exactly technique X
- [ ] Tutorial mode: interactive lesson per technique with crafted examples
- [ ] Practice mode: drill technique X on generated boards
- [ ] Mastery tracking visible to user

Deliverable: tutorial campaign covering all phase 1-3 techniques.

## Phase 6: Advanced techniques (weeks 21-28)

The long tail. Each one adds more solvable puzzles.

- [ ] Coloring (multi-coloring)
- [ ] Almost Locked Sets (ALS)
- [ ] Sue de Coq
- [ ] AIC (Alternating Inference Chains)
- [ ] Forcing Chains (cell, region, digit)
- [ ] Nice Loops
- [ ] Death Blossom
- [ ] SK Loops, MSLS

Each technique adds: detector, explanation templates EN+RO, visual hint, tutorial.

Deliverable: solver covers 99 plus percent of valid 9x9 puzzles without brute force.

## Phase 7: Polish and launch (weeks 29-32)

- [ ] Design pass on entire UI
- [ ] Animations for technique application
- [ ] Onboarding flow for new users
- [ ] Performance audit and optimization
- [ ] Accessibility audit (keyboard, screen reader)
- [ ] Settings: theme, font size, candidate display style
- [ ] Stats: puzzles solved, average time, technique usage
- [ ] Documentation: user guide, technique encyclopedia

Deliverable: v1.0 launch on Product Hunt, Hacker News, r/sudoku, Romanian dev communities.

## Post-1.0 ideas

- Sudoku variants: Killer, X-Sudoku, Hyper, Jigsaw
- Larger grids: 16x16, 25x25
- Optional LLM-augmented "elaborate" explanations
- User accounts and cross-device sync
- Daily puzzle with global leaderboard
- Mobile native apps via Capacitor
- Public REST API for solver
- More languages

## Open questions

1. Domain name and branding
2. Hosting choice (Vercel, Cloudflare Pages, self-hosted)
3. Whether to support a "build your own puzzle" mode early or post-launch
4. Whether to include classic puzzle-pack ports (newspaper puzzles, etc.)
