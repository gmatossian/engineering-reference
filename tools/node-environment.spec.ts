import { describe, expect, it } from 'vitest';

describe('Node test configuration', () => {
  it('runs tool tests in Node without a browser DOM', () => {
    expect('process' in globalThis).toBe(true);
    expect('document' in globalThis).toBe(false);
  });
});
