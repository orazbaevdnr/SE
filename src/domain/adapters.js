/**
 * Booking Adapter Pattern Implementation (Practice #09)
 * 
 * Pattern Justification:
 * Problem: External data sources and legacy fixtures provide booking intervals in
 * inconsistent shapes (e.g. {start, end} in minutes vs {startTime, endTime} in minutes or HH:MM).
 * Pattern: Adapter pattern (normalizeBooking / normalizeBookings).
 * Expected Benefit: Decouples the core availability engine (canBook) from external data
 * representation, preventing redundant shape conversion logic across domain functions.
 */

/**
 * Normalizes an individual booking object into the canonical shape:
 * { start: number, end: number }
 *
 * @param {Object} raw - Raw booking object in either shape
 * @returns {{start: number, end: number}|null} Canonical booking object, or null if malformed
 */
export function normalizeBooking(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  // Extract start value from either canonical (start) or alternative (startTime) property
  let rawStart = raw.start !== undefined ? raw.start : raw.startTime;
  // Extract end value from either canonical (end) or alternative (endTime) property
  let rawEnd = raw.end !== undefined ? raw.end : raw.endTime;

  // Convert "HH:MM" string format to minutes if necessary
  if (typeof rawStart === 'string' && rawStart.includes(':')) {
    const [h, m] = rawStart.split(':').map(Number);
    rawStart = Number.isInteger(h) && Number.isInteger(m) ? h * 60 + m : NaN;
  }
  if (typeof rawEnd === 'string' && rawEnd.includes(':')) {
    const [h, m] = rawEnd.split(':').map(Number);
    rawEnd = Number.isInteger(h) && Number.isInteger(m) ? h * 60 + m : NaN;
  }

  // Strict type verification: integers only, within valid bounds
  if (
    typeof rawStart !== 'number' ||
    typeof rawEnd !== 'number' ||
    !Number.isInteger(rawStart) ||
    !Number.isInteger(rawEnd) ||
    rawStart < 0 ||
    rawEnd > 1440 ||
    rawStart >= rawEnd
  ) {
    return null;
  }

  return {
    start: rawStart,
    end: rawEnd
  };
}

/**
 * Normalizes an array of heterogeneous booking objects into canonical shape.
 * Malformed entries are safely rejected without throwing exceptions.
 *
 * @param {Array<Object>} bookings - Array of raw bookings
 * @returns {Array<{start: number, end: number}>} Normalized array of bookings
 */
export function normalizeBookings(bookings = []) {
  if (!Array.isArray(bookings)) {
    return [];
  }

  return bookings
    .map(normalizeBooking)
    .filter(b => b !== null);
}
