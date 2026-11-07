import { describe, it, expect, beforeEach, vi } from "vitest";
import { isRateLimited } from "../lib/rateLimit";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  it("blocks the 6th request within the same window", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(keyA);
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
