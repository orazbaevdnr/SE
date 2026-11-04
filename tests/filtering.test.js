import { describe, it, expect } from 'vitest';
import { filterRooms } from '../src/domain/filtering.js';
import { rooms } from '../src/data/rooms.js';

describe('Room Catalog Filtering (F1 - F4)', () => {
  // T08: Filters correctly by minimum capacity (F1)
  it('T08: Filters correctly by minimum capacity (F1)', () => {
    // Request capacity of 30 attendees
    // Expected rooms: Auditorium A (50) and Hall D (100)
    const filtered = filterRooms(rooms, { capacity: 30 });
    const roomIds = filtered.map(r => r.id);

    expect(roomIds).toContain('auditorium-a');
    expect(roomIds).toContain('hall-d');
    expect(roomIds).not.toContain('lab-b'); // cap 20 < 30
    expect(roomIds).not.toContain('pod-c'); // cap 6 < 30
    expect(filtered.length).toBe(2);
  });

  // T09: Exact capacity match is accepted (F1 Boundary)
  it('T09: Exact capacity match is accepted (F1 Boundary)', () => {
    // Lab B has capacity 20 exactly. Requesting 20 must include Lab B.
    const filtered = filterRooms(rooms, { capacity: 20 });
    const roomIds = filtered.map(r => r.id);

    expect(roomIds).toContain('lab-b'); // 20 >= 20 (exact match)
    expect(roomIds).toContain('auditorium-a'); // 50 >= 20
    expect(roomIds).toContain('hall-d'); // 100 >= 20
    expect(roomIds).not.toContain('pod-c'); // 6 < 20
    expect(filtered.length).toBe(3);
  });

  // T10: Filters by ALL requested equipment (F2)
  it('T10: Filters by ALL requested equipment (F2)', () => {
    // Auditorium A has ['Projector', 'Mic']
    // Hall D has ['Projector', 'Sound System']
    // Requesting both ['Projector', 'Mic'] should only match Auditorium A
    const filtered = filterRooms(rooms, { equipment: ['Projector', 'Mic'] });
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('auditorium-a');

    // Requesting ['PCs'] should match Lab B
    const pcsFiltered = filterRooms(rooms, { equipment: ['PCs'] });
    expect(pcsFiltered.length).toBe(1);
    expect(pcsFiltered[0].id).toBe('lab-b');
  });

  // T11: Returns empty array on impossible constraints (F4)
  it('T11: Returns empty array on impossible constraints (F4)', () => {
    // Capacity too high for any room
    const overCapacity = filterRooms(rooms, { capacity: 999 });
    expect(overCapacity).toEqual([]);

    // Equipment not present in any room
    const nonexistentEquipment = filterRooms(rooms, { equipment: ['Telescope'] });
    expect(nonexistentEquipment).toEqual([]);

    // Impossible combination (e.g. TV and PCs together)
    const impossibleCombo = filterRooms(rooms, { equipment: ['TV', 'PCs'] });
    expect(impossibleCombo).toEqual([]);
  });
});
