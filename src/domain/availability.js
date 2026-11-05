/**
 * Availability Domain Logic
 * 
 * Determines whether a room can be booked given start, end, current time,
 * blocked status, and existing bookings.
 * 
 * Rules:
 * - AC1 (Bounds): 0 <= start < end <= 1440. Start must be strictly > now. Integer minutes only.
 * - AC2 (Duration): Maximum 120 minutes. Exactly 120 is valid; 121 is invalid.
 * - AC3 (Blocked): If room is blocked, cannot be booked (returns false).
 * - AC4 (Overlap): Strict overlap rule: start < existing.end && end > existing.start.
 *                  Touching endpoints (e.g. 600-660 and 660-720) do NOT overlap.
 * - AC5 (Pure): Pure function; does not mutate input parameters or bookings array.
 * 
 * Pattern Applied:
 * - Adapter Pattern: Uses normalizeBooking to transparently adapt inconsistent booking shapes
 *   ({start, end} vs {startTime, endTime}) without coupling core validation to input shapes.
 *
 * @param {Object} params
 * @param {number} params.start - Requested start time in minutes (0 - 1440)
 * @param {number} params.end - Requested end time in minutes (0 - 1440)
 * @param {number} params.now - Current time in minutes (0 - 1440)
 * @param {boolean} [params.blocked=false] - Whether the room is blocked
 * @param {Array<{start: number, end: number}>} [params.bookings=[]] - Existing bookings
 * @returns {boolean} True if the room can be booked, false otherwise
 */
import { normalizeBooking } from './adapters.js';

export function canBook({ start, end, now, blocked = false, bookings = [] } = {}) {
  // AC3: Blocked room check
  if (blocked === true) {
    return false;
  }

  // AC1 & T07: Strict type sanitization (reject non-integers, booleans, strings, floats, NaN, null, undefined)
  if (
    typeof start !== 'number' ||
    typeof end !== 'number' ||
    typeof now !== 'number' ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    !Number.isInteger(now)
  ) {
    return false;
  }

  // AC1: Bounds check (0 <= start < end <= 1440, and start strictly > now)
  if (start < 0 || end > 1440 || start >= end) {
    return false;
  }

  // AC1 & T06: Start must be strictly greater than now (start == now is rejected)
  if (start <= now) {
    return false;
  }

  // AC2 & T04, T05: Duration check (max 120 minutes)
  const duration = end - start;
  if (duration > 120) {
    return false;
  }

  // AC4 & T01, T02: Strict overlap rule (pure iteration without mutating bookings array)
  if (!Array.isArray(bookings)) {
    return false;
  }

  const hasOverlap = bookings.some(rawBooking => {
    // Adapter normalization: handles both {start, end} and legacy {startTime, endTime}
    const booking = normalizeBooking(rawBooking);
    if (!booking) {
      return false;
    }
    // Strict overlap: touching endpoints (start === b.end || end === b.start) are NOT overlaps
    return start < booking.end && end > booking.start;
  });

  return !hasOverlap;
}
