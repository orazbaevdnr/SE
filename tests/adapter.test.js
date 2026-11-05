import { describe, it, expect } from 'vitest';
import { normalizeBooking, normalizeBookings } from '../src/domain/adapters.js';
import { canBook } from '../src/domain/availability.js';

describe('Booking Adapter Pattern (Practice #09)', () => {
  // Test canonical shape {start, end}
  it('Normalizes canonical shape { start, end }', () => {
    const raw = { start: 540, end: 600 };
    const normalized = normalizeBooking(raw);
    expect(normalized).toEqual({ start: 540, end: 600 });
  });

  // Test alternative shape {startTime, endTime}
  it('Normalizes alternative shape { startTime, endTime }', () => {
    const raw = { startTime: 600, endTime: 660 };
    const normalized = normalizeBooking(raw);
    expect(normalized).toEqual({ start: 600, end: 660 });
  });

  // Test string "HH:MM" format
  it('Normalizes time string "HH:MM" format', () => {
    const raw = { startTime: '09:00', endTime: '10:00' };
    const normalized = normalizeBooking(raw);
    expect(normalized).toEqual({ start: 540, end: 600 });
  });

  // Test malformed input rejection
  it('Explicitly rejects malformed or invalid booking shapes', () => {
    expect(normalizeBooking(null)).toBeNull();
    expect(normalizeBooking(undefined)).toBeNull();
    expect(normalizeBooking({})).toBeNull();
    expect(normalizeBooking({ start: 600, end: 500 })).toBeNull(); // reversed
    expect(normalizeBooking({ start: 'invalid', end: 600 })).toBeNull();
    expect(normalizeBooking({ startTime: -10, endTime: 60 })).toBeNull();
    expect(normalizeBooking({ startTime: 1400, endTime: 1441 })).toBeNull();
  });

  // Test array normalization
  it('Normalizes an array of mixed format bookings', () => {
    const mixedBookings = [
      { start: 540, end: 600 },
      { startTime: 600, endTime: 660 },
      { startTime: '11:00', endTime: '12:00' },
      { invalid: true }
    ];
    const result = normalizeBookings(mixedBookings);
    expect(result).toEqual([
      { start: 540, end: 600 },
      { start: 600, end: 660 },
      { start: 660, end: 720 }
    ]);
  });

  // Test integration with canBook
  it('canBook seamlessly evaluates availability using adapted alternative shape', () => {
    const legacyBookings = [
      { startTime: 600, endTime: 660 } // 10:00 - 11:00 in legacy format
    ];

    // Overlapping request (630 - 690) should be rejected
    const isOverlapping = canBook({
      start: 630,
      end: 690,
      now: 480,
      blocked: false,
      bookings: legacyBookings
    });
    expect(isOverlapping).toBe(false);

    // Touching endpoint request (660 - 720) should be accepted
    const isTouching = canBook({
      start: 660,
      end: 720,
      now: 480,
      blocked: false,
      bookings: legacyBookings
    });
    expect(isTouching).toBe(true);
  });
});
