/**
 * Room Catalog Filtering Logic
 * 
 * Filters rooms based on minimum attendee capacity and required equipment items.
 * 
 * Features:
 * - F1 (Capacity Filter): room.capacity >= requested attendees.
 * - F2 (Equipment Filter): Room must contain ALL selected required equipment.
 * - Pure function: Does not mutate the input rooms array.
 *
 * @param {Array<Object>} rooms - List of rooms
 * @param {Object} [filters={}] - Filter criteria
 * @param {number} [filters.capacity=0] - Minimum requested attendee capacity
 * @param {Array<string>} [filters.equipment=[]] - Array of required equipment items
 * @returns {Array<Object>} Filtered list of rooms
 */
export function filterRooms(rooms = [], { capacity = 0, equipment = [] } = {}) {
  if (!Array.isArray(rooms)) {
    return [];
  }

  const minCapacity = typeof capacity === 'number' && !Number.isNaN(capacity)
    ? capacity
    : Number(capacity) || 0;

  const requiredEquipment = Array.isArray(equipment) ? equipment : [];

  return rooms.filter(room => {
    if (!room) return false;

    // F1: Capacity filter (greater than or equal to requested attendees)
    if (typeof room.capacity === 'number' && room.capacity < minCapacity) {
      return false;
    }

    // F2: Equipment filter (room must contain ALL requested items)
    if (requiredEquipment.length > 0) {
      const roomEquipment = Array.isArray(room.equipment) ? room.equipment : [];
      const hasAllEquipment = requiredEquipment.every(item => roomEquipment.includes(item));
      if (!hasAllEquipment) {
        return false;
      }
    }

    return true;
  });
}
