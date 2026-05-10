# CoachDoku

> The open source Sudoku coach that explains which technique is optimal at each step, and why.

## What makes CoachDoku different

Most Sudoku solvers tell you what move to make. CoachDoku tells you **why that move is the best choice right now**, when multiple techniques are applicable.

At every step, CoachDoku:

1. Finds all techniques that apply to the current board
2. Ranks them by simplicity, eliminations produced, cascade impact, and pedagogical value
3. Recommends one and explains the trade-offs
4. Teaches you the visual pattern so you can spot it yourself next time

No AI in the core engine. Everything is deterministic, testable, and reproducible. Optional LLM-augmented explanations may be added later as a separate, opt-in layer.

## Status

Early development. See [ROADMAP.md](./ROADMAP.md) for milestones.

## Tech stack

- TypeScript (no WASM, no Rust, pure TS for solver and UI)
- React + Vite for the web app
- Tailwind CSS for styling
- Zustand for state management
- Vitest for tests
- PWA-first, mobile-friendly from day one

## Quick start

Docker (recommended, no local Node required):

```bash
docker compose up           # dev server with hot reload at http://localhost:5180
docker build -t coachdoku . # build production image (nginx-served)
```

Or natively on the host:

```bash
npm install
npm run dev      # start dev server at http://localhost:5180
npm run test     # run test suite
npm run build    # production build
npm run lint     # static checks
```

## Project goals

- Open source, Apache 2.0 licensed
- Match sudoku.coach feature parity for techniques (27 plus)
- Surpass it on the "why this technique" explanation layer
- English-only product UI in v1 (additional languages may come post-launch)
- Modular technique system so contributors can add new techniques easily
- 100 percent deterministic core, easy to test and audit

## Non-goals (for v1)

- Maximum brute-force speed (tdoku and JCZsolver already won this race)
- Sudoku variants beyond classic 9x9 (Killer, Samurai, etc. come later)
- Native mobile apps (PWA covers mobile in v1)
- Multiplayer or leaderboards (post-launch)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and the technique authoring guide in [adding-techniques.md](./adding-techniques.md).

## License

Apache 2.0
