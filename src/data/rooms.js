/**
 * Room Catalog Data Fixture
 *
 * Single Source of Truth for the campus room catalog.
 * Both the runtime UI (src/ui/app.js) and the Vitest test suites
 * (tests/filtering.test.js, tests/integration.test.js) import this module,
 * ensuring zero fixture drift.
 *
 * Time intervals are represented as integer minutes from midnight (00:00).
 * For example, 540 = 09:00, 600 = 10:00, 660 = 11:00.
 *
 * @typedef {Object} Booking
 * @property {number} start - Start time in minutes from 00:00 (0 – 1440)
 * @property {number} end   - End time in minutes from 00:00 (0 – 1440)
 *
 * @typedef {Object} Room
 * @property {string}    id        - Unique machine-readable identifier (kebab-case)
 * @property {string}    name      - Human-readable display name
 * @property {number}    capacity  - Maximum attendees the room can accommodate
 * @property {string[]}  equipment - Available equipment items (e.g. 'Projector', 'PCs')
 * @property {boolean}   blocked   - Whether the room is blocked / under maintenance
 * @property {Booking[]} bookings  - Existing reservations for the current day
 */

/** @type {Room[]} */
export const rooms = [
  {
    id: 'auditorium-a',
    name: 'Auditorium A',
    capacity: 50,
    equipment: ['Projector', 'Mic'],
    blocked: false,
    bookings: [
      { start: 540, end: 600 } // 09:00 – 10:00
    ]
  },
  {
    id: 'lab-b',
    name: 'Lab B',
    capacity: 20,
    equipment: ['PCs', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 } // 10:00 – 11:00
    ]
  },
  {
    id: 'pod-c',
    name: 'Pod C',
    capacity: 6,
    equipment: ['TV'],
    blocked: false,
    bookings: []
  },
  {
    id: 'hall-d',
    name: 'Hall D',
    capacity: 100,
    equipment: ['Projector', 'Sound System'],
    blocked: true,
    bookings: []
  }
];
