# Adding a new technique

This guide walks through implementing a new Sudoku solving technique in CoachDoku.

## Checklist

- [ ] Read the canonical definition on [Sudopedia](https://www.sudopedia.org) or [HoDoKu](https://hodoku.sourceforge.net)
- [ ] Confirm the technique is not already implemented in `src/core/techniques/`
- [ ] Pick the file name: lowerCamelCase matching the technique name (e.g., `xWing.ts`, `xyChain.ts`)
- [ ] Implement the `Technique` interface
- [ ] Write at least 5 test boards demonstrating the pattern
- [ ] Add English explanation templates
- [ ] Register in the technique index
- [ ] Document the algorithm
- [ ] Update ROADMAP.md

## The Technique interface

Every technique exports a single object implementing:

```typescript
interface Technique {
  id: TechniqueId;
  name: { en: string; ro: string };
  difficulty: number;
  category: TechniqueCategory;

  detect(board: Board): Move[];
  explain(move: Move, level: ExplanationLevel): Explanation;
  visualHint(move: Move): VisualHint;
}
```

### `id`

A stable identifier, kebab-case. Used in URLs, persistence, and i18n keys. Never rename once published; it would break user profiles.

Examples: `naked-single`, `hidden-pair`, `x-wing`, `xy-wing`, `xy-chain`, `aic`, `als-xz`.

### `name`

Display names per language. Keep them short and recognizable. The "official" English name from Sudopedia is usually correct.

### `difficulty`

Numeric rating. Use the HoDoKu scale as reference:

- Naked Single: 4
- Hidden Single: 14
- Locked Candidates: 25 to 40
- Naked Pair: 60
- X-Wing: 140
- XY-Wing: 160
- Swordfish: 150
- Skyscraper: 130
- AIC: 280 to 400 (varies by length)

These ratings drive the evaluator. If you're adding a brand new technique not in HoDoKu, estimate based on adjacent techniques.

### `category`

One of: `single`, `subset`, `intersection`, `fish`, `wing`, `coloring`, `chain`, `als`, `uniqueness`.

### `detect(board)`

Return all moves of this pattern found on the board, not just the first one. The evaluator decides which to use. Return an empty array if no instance is found.

Performance: detection runs every time the board changes. Aim for fast paths that exit early when the pattern obviously cannot apply.

### `explain(move, level)`

Render an `Explanation` for a specific move. Three levels:

- `hint`: minimal nudge, points to a zone or pattern type
- `standard`: full description of the technique applied here
- `deep-dive`: educational, explains the underlying logic

Use the template strings from `src/i18n/`. Never hardcode user-facing text in the detector.

### `visualHint(move)`

Return a `VisualHint` describing what to highlight: which cells, which candidates, which links between cells (for chains). The UI translates this into colored overlays.

## Test board format

Test boards use a simple text representation: 81 characters, 1-9 for given digits, 0 or `.` for empty.

Example:

```typescript
const board = parseBoard(
  '530070000' +
    '600195000' +
    '098000060' +
    '800060003' +
    '400803001' +
    '700020006' +
    '060000280' +
    '000419005' +
    '000080079',
);
```

For pattern tests, you often want to set up candidate states, not just placements. Use `boardWithCandidates` helper.

## Test structure

Every technique test file follows this shape:

```typescript
import { describe, it, expect } from 'vitest';
import { xWing } from '@/core/techniques/xWing';
import { parseBoard } from '@/core/board';

describe('X-Wing', () => {
  it('detects basic row-based X-Wing', () => {
    const board = parseBoard(/* ... */);
    const moves = xWing.detect(board);

    expect(moves).toHaveLength(1);
    expect(moves[0].eliminations).toContainEqual({
      cell: /* index */,
      candidate: /* digit */,
    });
  });

  it('detects column-based X-Wing', () => { /* ... */ });
  it('returns empty when no X-Wing exists', () => { /* ... */ });
  it('finds multiple X-Wings on the same board', () => { /* ... */ });
  it('does not confuse X-Wing with Swordfish', () => { /* ... */ });
});
```

## Explanation templates

Add to `src/i18n/en.ts`:

```typescript
// en.ts
export const en = {
  techniques: {
    'x-wing': {
      hint: 'Look at rows {rowA} and {rowB}. There is an X-Wing pattern.',
      standard:
        'Digit {digit} appears as candidate in exactly two cells in row {rowA} (columns {colA}, {colB}) and exactly two cells in row {rowB} (same columns). This forms an X-Wing, so {digit} can be eliminated from columns {colA} and {colB} in all other rows.',
      deepDive:
        'X-Wing is a fish pattern of size 2. When a digit has exactly two candidate positions in two different rows, and those positions share the same two columns, the digit must occupy diagonal corners. Both columns are therefore covered, eliminating the digit from those columns elsewhere.',
    },
  },
};
```

## References

- [Sudopedia](https://www.sudopedia.org): canonical technique definitions
- [HoDoKu Techniques](https://hodoku.sourceforge.net/en/techniques.php): authoritative implementation reference
- [Sudoku Wiki by Andrew Stuart](https://www.sudokuwiki.org/sudoku.htm): alternative explanations
- [Sudoku Snake](http://www.sudokusnake.com): more technique resources
