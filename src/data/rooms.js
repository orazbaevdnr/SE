/**
 * Room Catalog Data Fixture
 * Defines 4 fictional rooms with capacity, equipment, blocked status, and bookings.
 * Time intervals are represented as integer minutes from midnight (00:00).
 */

export const rooms = [
  {
    id: 'auditorium-a',
    name: 'Auditorium A',
    capacity: 50,
    equipment: ['Projector', 'Mic'],
    blocked: false,
    bookings: [
      { start: 540, end: 600 } // 09:00 - 10:00
    ]
  },
  {
    id: 'lab-b',
    name: 'Lab B',
    capacity: 20,
    equipment: ['PCs', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 } // 10:00 - 11:00
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
