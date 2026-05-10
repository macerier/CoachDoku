# CoachDoku Architecture

## Design principles

1. **Deterministic core**: solver and evaluator are pure functions. No randomness in the solving path, no AI calls. Same board, same recommendation, every time.
2. **Modular techniques**: each technique is a self-contained module implementing a common interface. Adding a new technique should not require changes to the core engine.
3. **Separation of detection and explanation**: the detector finds the pattern. The explainer renders it as human language. They are independent so we can swap explainers (template-based now, optionally LLM-augmented later) without touching detection logic.
4. **Test-first**: every technique ships with a curated set of test boards demonstrating its application. The test suite is the spec.
5. **TypeScript end to end**: solver core and UI share types. No serialization boundary between them in v1.

## Layered architecture

```
+------------------------------------------------------+
|                    UI Layer (React)                  |
|   Board, Cell, HintPanel, ExplanationPanel, Tutorial |
+------------------------------------------------------+
|                Coach Engine (orchestrator)           |
|   - getBestMove(board, userProfile): RankedMove[]    |
|   - getProgressiveHint(board, level): Hint           |
|   - explain(move, level): Explanation                |
+------------------------------------------------------+
|              Move Evaluator (ranker)                 |
|   - scoreMove(move, board, profile): MoveScore       |
|   - compareMoves(moves[]): RankedMove[]              |
+------------------------------------------------------+
|             Technique Detectors (plugins)            |
|   NakedSingle, HiddenSingle, LockedCandidates,       |
|   NakedPair, XWing, XYWing, Coloring, AIC, ...       |
+------------------------------------------------------+
|                 Board Core (data)                    |
|   Board, Cell, Candidates, House (row/col/box)       |
+------------------------------------------------------+
|        Brute Force Fallback (DLX, isolated)          |
|   - solve(board): Solution | null                    |
|   - hasUniqueSolution(board): boolean                |
+------------------------------------------------------+
```

## Core data model

### Board representation

Use bitmasks for candidates. Each cell has a 9-bit mask where bit `i` set means digit `i+1` is still a candidate.

```typescript
type CellIndex = number; // 0 to 80
type Digit = number; // 1 to 9
type Candidates = number; // 9-bit mask
type HouseIndex = number; // 0 to 26 (9 rows + 9 cols + 9 boxes)

interface Cell {
  index: CellIndex;
  value: Digit | 0; // 0 means empty
  candidates: Candidates;
  given: boolean; // part of the original puzzle
}

interface Board {
  cells: Cell[]; // length 81
  // Derived views are computed lazily
}
```

Helper functions provide row/col/box lookups, peer sets, and candidate manipulation. Keep `Board` immutable: every modification returns a new board. This makes undo and what-if analysis trivial.

### Technique interface

Every technique implements:

```typescript
interface Technique {
  id: TechniqueId;
  name: { en: string; ro: string };
  difficulty: number; // standardized rating, e.g. HoDoKu scale
  category: TechniqueCategory; // single, subset, fish, wing, chain, coloring, als

  detect(board: Board): Move[]; // all instances found, not just one
  explain(move: Move, level: ExplanationLevel): Explanation;
  visualHint(move: Move): VisualHint; // cells, candidates, links to highlight
}
```

A `Move` is the technique's finding: which cells, which candidates, what eliminations or placements. The solver applies moves; techniques only describe them.

```typescript
interface Move {
  techniqueId: TechniqueId;
  placements: Placement[]; // cell -> digit assignments
  eliminations: Elimination[]; // cell -> candidate removals
  evidence: Evidence; // cells that prove the move
  metadata: Record<string, unknown>; // technique-specific details
}
```

## The move evaluator (the differentiator)

The core innovation. Given a board state and all applicable moves from every technique, produce a ranked list with explanations of why each ranks where it does.

```typescript
interface MoveScore {
  simplicityScore: number; // inverse of technique difficulty
  eliminationScore: number; // candidates removed
  cascadeScore: number; // lookahead 1-2 moves: does it unlock simpler moves?
  pedagogicalScore: number; // matches user's learning level
  visualScore: number; // how easy a human can spot it
  totalScore: number;
  rationale: string[]; // human-readable factors
}
```

Scoring strategies are pluggable. v1 uses weighted linear combination. Future versions can experiment with learned weights from user behavior.

The evaluator must also identify when multiple techniques are simultaneously applicable, and produce the comparison narrative that no existing tool offers.

## Explanation system

Two channels:

1. **Structured facts**: machine-readable description of the move (technique, cells, candidates, eliminations, evidence). Used by tests, API consumers, and the visual highlighter.
2. **Natural language**: rendered from English templates. Templates are parameterized strings stored per technique. Three levels: hint, explanation, deep-dive. (v1 is English-only; multi-language support may come post-launch.)

Template example for Naked Pair:

```
hint: "Look at {house}. There is a Naked Pair."
explanation: "Cells {cellA} and {cellB} contain only the candidates {digitA} and {digitB}. These two digits must occupy those two cells, so {digitA} and {digitB} can be eliminated from the other cells in {house}."
deepDive: "Naked Pair is a subset technique. When n cells in a house contain exactly n candidates shared between them, those candidates cannot appear in any other cell of that house. Here n=2, and the candidates {digitA},{digitB} are confined to {cellA},{cellB}."
```

LLM-augmented explanations are explicitly out of scope for v1 core. They can be added as an optional layer that consumes structured facts and produces freeform text, gated behind a user setting.

## User profile and progression

```typescript
interface UserProfile {
  skillLevel: Map<TechniqueId, MasteryLevel>;
  preferredHintVerbosity: 'minimal' | 'standard' | 'verbose';
}

type MasteryLevel = 'unknown' | 'learning' | 'practicing' | 'mastered';
```

The coach engine consults the profile when ranking moves and when generating practice puzzles. A user "learning" Naked Pairs should be steered toward boards where Naked Pair is the key technique, not boards where AIC chains are needed.

## Puzzle generator

Calibrated generation: given a target difficulty and a required technique, produce a puzzle with a unique solution that requires exactly that technique tier to solve.

Algorithm sketch:

1. Generate a complete valid grid (Las Vegas with backtracking)
2. Remove clues in random order, keeping unique-solution property (verified via DLX)
3. After each removal, check the solving path with the human solver. If it now requires techniques above the target tier, reject the removal.
4. Continue until no more clues can be removed without exceeding the target tier.

This is slower than naive generation but produces puzzles calibrated to the user's level.

## Brute force fallback

When human techniques exhaust without solving, fall back to DLX (Dancing Links). Used for:

- Verifying unique solution during generation
- Confirming the user's path is valid
- Solving puzzles that exceed implemented techniques

The brute force solver is intentionally isolated so the human-style solver never accidentally depends on it.

## Frontend architecture

React component tree:

```
App
├── Header (logo, language switcher, settings)
├── GameView
│   ├── Board
│   │   └── Cell × 81
│   ├── ControlPanel (number pad, undo, hint button, candidate mode)
│   └── HintPanel (progressive hint disclosure)
│       └── ExplanationPanel (renders structured + template explanation)
├── TutorialView (per-technique interactive lessons)
└── ProfileView (mastery tracking, stats)
```

State managed by Zustand stores:

- `gameStore`: current board, history, hint state
- `profileStore`: user mastery, preferences, persisted to localStorage
- `puzzleStore`: puzzle library, generator settings

## Testing strategy

Three layers:

1. **Unit tests per technique**: each technique has a `tests/techniques/<name>.test.ts` with hand-crafted boards demonstrating the pattern. Goldens include the expected Move output as JSON.
2. **Integration tests**: full solve runs on benchmark puzzles (Sudopedia collections, HoDoKu library, Arto Inkala hardest puzzles). Compare technique sequence against reference solvers.
3. **Property tests**: random valid boards, random move sequences, verify invariants (no duplicate digits in houses, candidates always consistent with placed digits, undo always restores exact state).

## Folder structure

```
coachdoku/
├── src/
│   ├── core/
│   │   ├── board.ts              // Board, Cell, Candidates
│   │   ├── houses.ts             // row/col/box helpers
│   │   ├── peers.ts              // peer set computation
│   │   ├── candidates.ts         // bitmask operations
│   │   ├── solver.ts             // orchestrator
│   │   ├── evaluator.ts          // move ranking
│   │   ├── generator.ts          // puzzle generation
│   │   ├── dlx.ts                // brute force fallback
│   │   └── techniques/
│   │       ├── index.ts          // registry
│   │       ├── base.ts           // shared types and helpers
│   │       ├── nakedSingle.ts
│   │       ├── hiddenSingle.ts
│   │       ├── lockedCandidates.ts
│   │       ├── nakedPair.ts
│   │       ├── ... (one file per technique)
│   ├── components/               // React UI
│   ├── stores/                   // Zustand state
│   ├── i18n/
│   │   └── en.ts
│   ├── data/                     // puzzle libraries, technique metadata
│   └── types/                    // shared type definitions
├── tests/
│   ├── techniques/               // per-technique unit tests
│   ├── integration/              // full-solve tests
│   └── fixtures/                 // benchmark puzzles
├── adding-techniques.md          // technique authoring guide
├── algorithms/                   // notes on each algorithm
└── public/                       // PWA assets
```

## Performance budget

- Detect all techniques on a board: under 50ms on mid-range hardware
- Full solve of hard puzzle (requires AIC): under 500ms
- Generate easy puzzle: under 200ms
- Generate hard puzzle (calibrated): under 5s

These are budgets for v1, not hard limits. Optimization comes after correctness.

## Open architectural questions

1. Should `Board` be immutable (functional style) or mutable with explicit clone? Immutable is cleaner, mutable is faster for hot paths. Recommendation: immutable for v1, profile if it becomes a bottleneck.
2. How to represent links for chain techniques (AIC, Nice Loops)? Graph data structure with strong and weak links. Defer until reaching the chain phase.
3. Should the evaluator have access to lookahead (try a move, see what unlocks) or be purely local? Recommendation: local in v1, add lookahead as a separate scoring component when needed.
