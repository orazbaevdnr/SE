import { describe, it, expect } from 'vitest';
import { canBook } from '../src/domain/availability.js';

describe('Availability Domain Logic (AC1 - AC5)', () => {
  const existingBookings = [
    { start: 600, end: 660 } // 10:00 - 11:00 (60 min)
  ];
  const now = 480; // 08:00

  // T01: Allows touching endpoints (e.g., req 660-720 alongside existing 600-660) & preserves immutability (AC5)
  it('T01: Allows touching endpoints (AC4) and preserves immutability (AC5)', () => {
    const originalSnapshot = JSON.parse(JSON.stringify(existingBookings));

    // Request adjacent right touching endpoint (660 - 720)
    const canBookRightTouching = canBook({
      start: 660,
      end: 720,
      now,
      blocked: false,
      bookings: existingBookings
    });
    expect(canBookRightTouching).toBe(true);

    // Request adjacent left touching endpoint (540 - 600)
    const canBookLeftTouching = canBook({
      start: 540,
      end: 600,
      now,
      blocked: false,
      bookings: existingBookings
    });
    expect(canBookLeftTouching).toBe(true);

    // AC5 Verification: ensure the bookings array was not mutated (e.g. no in-place sort or element modification)
    expect(existingBookings).toEqual(originalSnapshot);
  });

  // T02: Rejects overlapping intervals (e.g., req 630-690)
  it('T02: Rejects overlapping intervals (AC4)', () => {
    const isOverlapping = canBook({
      start: 630,
      end: 690,
      now,
      blocked: false,
      bookings: existingBookings
    });
    expect(isOverlapping).toBe(false);
  });

  // T03: Rejects all if room is blocked
  it('T03: Rejects all if room is blocked (AC3)', () => {
    const isBlocked = canBook({
      start: 700,
      end: 760,
      now,
      blocked: true,
      bookings: []
    });
    expect(isBlocked).toBe(false);
  });

  // T04: Accepts exact max duration (120 min)
  it('T04: Accepts exact max duration of 120 min (AC2 Boundary)', () => {
    const exact120 = canBook({
      start: 700,
      end: 820, // 820 - 700 = 120 min
      now,
      blocked: false,
      bookings: []
    });
    expect(exact120).toBe(true);
  });

  // T05: Rejects duration of 121 min
  it('T05: Rejects duration of 121 min (AC2 Boundary)', () => {
    const exceedsMax = canBook({
      start: 700,
      end: 821, // 821 - 700 = 121 min
      now,
      blocked: false,
      bookings: []
    });
    expect(exceedsMax).toBe(false);
  });

  // T06: Rejects if start == now
  it('T06: Rejects if start == now (AC1 Boundary)', () => {
    const startEqualsNow = canBook({
      start: 480, // exactly now
      end: 540,
      now: 480,
      blocked: false,
      bookings: []
    });
    expect(startEqualsNow).toBe(false);
  });

  // T07: Rejects boolean or non-integer inputs (Robustness)
  it('T07: Rejects boolean or non-integer inputs (AC1 Robustness)', () => {
    // Boolean input should NOT be coerced to 1 or 0
    expect(canBook({ start: true, end: 600, now, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: 500, end: false, now, blocked: false, bookings: [] })).toBe(false);

    // Floating point minutes should be rejected
    expect(canBook({ start: 500.5, end: 560, now, blocked: false, bookings: [] })).toBe(false);

    // String numbers without parsing should be rejected
    expect(canBook({ start: '500', end: 560, now, blocked: false, bookings: [] })).toBe(false);

    // null, undefined, NaN, Infinity, and object inputs
    expect(canBook({ start: null, end: 600, now, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: 500, end: undefined, now, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: NaN, end: 600, now, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: 500, end: Infinity, now, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: {}, end: 600, now, blocked: false, bookings: [] })).toBe(false);

    // Out of bounds minutes (< 0 or > 1440)
    expect(canBook({ start: -10, end: 60, now: -20, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ start: 1400, end: 1441, now: 1300, blocked: false, bookings: [] })).toBe(false);
  });
});
