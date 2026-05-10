import { describe, it, expect } from 'vitest';

describe('toolchain smoke', () => {
  it('vitest can run a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('jsdom environment is available', () => {
    const div = document.createElement('div');
    div.textContent = 'hello';
    expect(div.textContent).toBe('hello');
  });
});
