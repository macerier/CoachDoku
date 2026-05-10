import { describe, it, expect } from 'vitest';
import { runCli } from '@/cli/solve';

describe('cli solve', () => {
  it('shows usage and exits 2 when no puzzle arg is given', () => {
    const result = runCli([]);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toMatch(/usage/i);
  });

  it('rejects invalid puzzle length with exit code 1', () => {
    const result = runCli(['123']);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toMatch(/length/i);
  });

  it('solves a puzzle and prints step list', () => {
    const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const result = runCli([puzzle]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/Step \d+/);
    expect(result.stdout).toMatch(/Solved in/);
  });

  it('emits JSON when --json flag is set', () => {
    const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const result = runCli([puzzle, '--json']);
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.stdout) as { status: string; steps: unknown[] };
    expect(parsed.status).toBe('solved');
    expect(Array.isArray(parsed.steps)).toBe(true);
  });

  it('reports stuck for a puzzle that needs harder techniques', () => {
    const puzzle = '0'.repeat(81);
    const result = runCli([puzzle]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toMatch(/Stuck/);
  });

  it('accepts --level flag', () => {
    const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const result = runCli([puzzle, '--level=hint']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/Step \d+/);
  });
});
