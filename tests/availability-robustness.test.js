import { describe, it, expect } from 'vitest';
import { canBook } from '../src/domain/availability.js';

// Practice #10 regression test (R1):
// An existing booking that cannot be normalized must not be silently ignored.
// The availability engine must fail closed (report unavailable) rather than
// reporting a room as free when its schedule cannot be verified.
describe('Availability robustness (Practice #10 / R1)', () => {
  it('T13: Rejects a request when an existing booking is malformed', () => {
    const now = 480; // 08:00
    const request = { start: 630, end: 690, now, blocked: false };

    // Missing end: normalizeBooking returns null.
    expect(canBook({ ...request, bookings: [{ start: 600 }] })).toBe(false);

    // Null record: normalizeBooking returns null.
    expect(canBook({ ...request, bookings: [null] })).toBe(false);

    // Reversed interval: normalizeBooking returns null.
    expect(canBook({ ...request, bookings: [{ start: 660, end: 600 }] })).toBe(false);

    // Sanity check: a valid non-overlapping schedule remains bookable.
    expect(canBook({ start: 660, end: 720, now, blocked: false, bookings: [{ start: 600, end: 660 }] })).toBe(true);
  });
});
