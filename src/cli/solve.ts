import { fileURLToPath } from 'node:url';
import { parseBoard } from '@/core/parser';
import { solve } from '@/core/solver';
import { cellName } from '@/core/notation';
import type { ExplanationLevel } from '@/types/move';
import type { SolveResult } from '@/types/solver';

export interface CliResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
}

const USAGE = 'Usage: npm run solve "<81-char-puzzle>" [--json] [--level=hint|standard|deepDive]';

function parseLevel(flag: string | undefined): ExplanationLevel {
  if (!flag) return 'standard';
  const value = flag.split('=')[1];
  if (value === 'hint' || value === 'standard' || value === 'deepDive') return value;
  return 'standard';
}

function formatHuman(result: SolveResult): string {
  const lines: string[] = [];
  result.steps.forEach((step, i) => {
    const placement = step.move.placements[0];
    const cell = placement ? cellName(placement.cell) : '';
    const digit = placement ? placement.digit : '';
    const head = placement
      ? `Step ${i + 1}: ${step.technique} - ${cell} = ${digit}`
      : `Step ${i + 1}: ${step.technique}`;
    lines.push(head);
    lines.push(`  ${step.explanation.text}`);
  });

  if (result.status === 'solved') {
    lines.push(`Solved in ${result.steps.length} steps.`);
  } else if (result.status === 'stuck') {
    lines.push(`Stuck after ${result.steps.length} steps.`);
  } else {
    lines.push('Invalid puzzle: an empty cell has no candidates left.');
  }
  return lines.join('\n');
}

export function runCli(argv: ReadonlyArray<string>): CliResult {
  const args = [...argv];
  if (args.length === 0) {
    return { stdout: '', stderr: USAGE, exitCode: 2 };
  }

  const puzzle = args[0];
  const flags = args.slice(1);
  const json = flags.includes('--json');
  const levelFlag = flags.find((f) => f.startsWith('--level='));
  const level = parseLevel(levelFlag);

  let board;
  try {
    board = parseBoard(puzzle);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout: '', stderr: message, exitCode: 1 };
  }

  const result = solve(board, { explanationLevel: level });

  if (json) {
    return { stdout: JSON.stringify(result, null, 2), stderr: '', exitCode: result.status === 'solved' ? 0 : 1 };
  }

  const exitCode = result.status === 'solved' ? 0 : 1;
  return { stdout: formatHuman(result), stderr: '', exitCode };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runCli(process.argv.slice(2));
  if (result.stdout) {
    console.log(result.stdout);
  }
  if (result.stderr) {
    console.error(result.stderr);
  }
  process.exit(result.exitCode);
}
