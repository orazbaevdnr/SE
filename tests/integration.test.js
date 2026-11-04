import { describe, it, expect } from 'vitest';
import { rooms } from '../src/data/rooms.js';
import { canBook } from '../src/domain/availability.js';

describe('Integration & State Reactivity (F5)', () => {
  // T12: Verifies that evaluating availability on a busy room returns false,
  // but switching the room_id state to an empty room returns true (F5).
  it('T12: Switching selected room reactively refreshes availability (F5)', () => {
    // Current simulation time: 08:00 (480 minutes)
    const now = 480;

    // Requested meeting interval: 09:10 - 09:50 (550 - 590 minutes)
    const requestedSlot = {
      start: 550,
      end: 590,
      now
    };

    // State variable representing user's current room selection
    let selectedRoomId = 'auditorium-a'; // Busy room (Booked 540-600)

    const findRoom = id => rooms.find(r => r.id === id);

    // Step 1: Check availability on busy room (Auditorium A)
    let currentRoom = findRoom(selectedRoomId);
    expect(currentRoom).toBeDefined();

    let isAvailable = canBook({
      start: requestedSlot.start,
      end: requestedSlot.end,
      now: requestedSlot.now,
      blocked: currentRoom.blocked,
      bookings: currentRoom.bookings
    });

    // Should be false because 550-590 overlaps with 540-600
    expect(isAvailable).toBe(false);

    // Step 2: User switches room selection to Pod C (Empty room)
    selectedRoomId = 'pod-c';
    currentRoom = findRoom(selectedRoomId);
    expect(currentRoom).toBeDefined();

    isAvailable = canBook({
      start: requestedSlot.start,
      end: requestedSlot.end,
      now: requestedSlot.now,
      blocked: currentRoom.blocked,
      bookings: currentRoom.bookings
    });

    // Should now be true because Pod C has no conflicting bookings
    expect(isAvailable).toBe(true);

    // Step 3: User switches to Hall D (Blocked room)
    selectedRoomId = 'hall-d';
    currentRoom = findRoom(selectedRoomId);
    expect(currentRoom).toBeDefined();

    isAvailable = canBook({
      start: requestedSlot.start,
      end: requestedSlot.end,
      now: requestedSlot.now,
      blocked: currentRoom.blocked,
      bookings: currentRoom.bookings
    });

    // Should be false because Hall D is blocked
    expect(isAvailable).toBe(false);
  });
});
