export const EN = {
  techniques: {
    'naked-single': {
      hint: 'Cell {cell} has only one candidate left.',
      standard: 'Cell {cell} can only be {digit} since all other digits are eliminated by its peers.',
      deepDive:
        "A Naked Single occurs when a cell's candidate set is reduced to exactly one digit. The peers of this cell collectively forbid the other 8 digits, leaving only one possibility.",
    },
    'hidden-single': {
      hint: 'Look at {house}. Digit {digit} fits in only one cell.',
      standard:
        'In {house}, digit {digit} can only go in {cell} since all other cells in this house already exclude it.',
      deepDive:
        'A Hidden Single is the converse of a Naked Single. Even if a cell has many candidates, if a digit has only one possible location in a given house, it must go there.',
    },
  },
} as const;
