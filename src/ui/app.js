/**
 * UI Controller and DOM Manipulation
 * Connects domain availability and filtering logic reactively to the user interface.
 */

import { rooms } from '../data/rooms.js';
import { canBook } from '../domain/availability.js';
import { filterRooms } from '../domain/filtering.js';

// Convert "HH:MM" string to minutes from 00:00
function timeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return NaN;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
  return hours * 60 + minutes;
}

// Convert minutes from 00:00 to "HH:MM" string
function minutesToTimeString(totalMinutes) {
  if (typeof totalMinutes !== 'number' || Number.isNaN(totalMinutes)) return '--:--';
  const mins = Math.max(0, Math.min(1440, Math.floor(totalMinutes)));
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Application State
const state = {
  selectedRoomId: 'auditorium-a'
};

// DOM Elements
const inputNow = document.getElementById('inputNow');
const inputStart = document.getElementById('inputStart');
const inputEnd = document.getElementById('inputEnd');
const inputCapacity = document.getElementById('inputCapacity');
const durationText = document.getElementById('durationText');
const btnResetFilters = document.getElementById('btnResetFilters');
const roomsContainer = document.getElementById('roomsContainer');
const emptyState = document.getElementById('emptyState');
const matchCount = document.getElementById('matchCount');
const statusPanel = document.getElementById('statusPanel');
const statusHeading = document.getElementById('statusHeading');
const statusIcon = document.getElementById('statusIcon');
const statusReason = document.getElementById('statusReason');

// Retrieve currently checked equipment
function getSelectedEquipment() {
  const checkboxes = document.querySelectorAll('input[name="equipment"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// Reactive Render Function (F5)
function render() {
  const now = timeStringToMinutes(inputNow.value);
  const start = timeStringToMinutes(inputStart.value);
  const end = timeStringToMinutes(inputEnd.value);
  const capacity = inputCapacity.value ? Number(inputCapacity.value) : 0;
  const equipment = getSelectedEquipment();

  // Update duration text
  if (!Number.isNaN(start) && !Number.isNaN(end) && end > start) {
    const dur = end - start;
    durationText.textContent = `Duration: ${dur} min (Max 120 min permitted)`;
    durationText.style.color = dur > 120 ? '#991b1b' : 'var(--text-muted)';
  } else {
    durationText.textContent = 'Invalid start/end range';
    durationText.style.color = '#991b1b';
  }

  // F1 & F2: Filter room catalog
  const filteredRooms = filterRooms(rooms, { capacity, equipment });
  matchCount.textContent = `${filteredRooms.length} room${filteredRooms.length === 1 ? '' : 's'}`;

  // F4: Handle Empty State
  if (filteredRooms.length === 0) {
    roomsContainer.style.display = 'none';
    emptyState.style.display = 'block';

    statusPanel.className = 'status-panel unavailable';
    statusIcon.textContent = '✕';
    statusHeading.textContent = 'No Room Selected';
    statusReason.textContent = 'No rooms match your filter criteria. Adjust attendees or equipment to find rooms.';
    return;
  }

  emptyState.style.display = 'none';
  roomsContainer.style.display = 'flex';

  // Ensure selected room is still in the filtered set
  const isSelectedVisible = filteredRooms.some(r => r.id === state.selectedRoomId);
  if (!isSelectedVisible && filteredRooms.length > 0) {
    state.selectedRoomId = filteredRooms[0].id;
  }

  // Render Room Cards
  roomsContainer.innerHTML = '';
  filteredRooms.forEach(room => {
    const isSelected = room.id === state.selectedRoomId;
    const card = document.createElement('div');
    card.className = `room-card${isSelected ? ' selected' : ''}`;
    card.setAttribute('data-room-id', room.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    card.setAttribute('aria-label', `Select ${room.name}, capacity ${room.capacity}${room.blocked ? ', blocked' : ''}`);

    // Bookings summary
    let bookingsHtml = '';
    if (room.bookings && room.bookings.length > 0) {
      const slots = room.bookings
        .map(b => `${minutesToTimeString(b.start)} - ${minutesToTimeString(b.end)}`)
        .join(', ');
      bookingsHtml = `<span class="tag booked">Booked: ${slots}</span>`;
    } else {
      bookingsHtml = `<span class="tag">No bookings today</span>`;
    }

    // Equipment tags
    const eqTags = room.equipment.map(eq => `<span class="tag">${eq}</span>`).join(' ');

    // Blocked tag (F3)
    const blockedTag = room.blocked ? `<span class="tag blocked">Blocked</span>` : '';

    card.innerHTML = `
      <div class="room-card-header">
        <span class="room-name">${room.name}</span>
        <span class="room-cap">Capacity: ${room.capacity}</span>
      </div>
      <div class="room-tags">
        ${blockedTag}
        ${eqTags}
        ${bookingsHtml}
      </div>
    `;

    const selectThisRoom = () => {
      state.selectedRoomId = room.id;
      render();
    };

    card.addEventListener('click', selectThisRoom);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectThisRoom();
      }
    });

    roomsContainer.appendChild(card);
  });

  // Evaluate Availability for currently selected room
  const selectedRoom = rooms.find(r => r.id === state.selectedRoomId);
  if (!selectedRoom) return;

  const available = canBook({
    start,
    end,
    now,
    blocked: selectedRoom.blocked,
    bookings: selectedRoom.bookings
  });

  if (available) {
    statusPanel.className = 'status-panel available';
    statusIcon.textContent = '✓';
    statusHeading.textContent = 'Available for Booking';
    statusReason.textContent = `${selectedRoom.name} is free for the requested interval (${minutesToTimeString(start)} - ${minutesToTimeString(end)}, ${end - start} min).`;
  } else {
    statusPanel.className = 'status-panel unavailable';
    statusIcon.textContent = '✕';
    statusHeading.textContent = 'Unavailable for Booking';

    // Provide helpful diagnostic feedback
    if (selectedRoom.blocked) {
      statusReason.textContent = `${selectedRoom.name} is currently blocked / under maintenance (AC3 & F3).`;
    } else if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(now)) {
      statusReason.textContent = 'Please enter valid times.';
    } else if (start <= now) {
      statusReason.textContent = `Start time (${minutesToTimeString(start)}) must be strictly in the future (after campus time ${minutesToTimeString(now)}).`;
    } else if (start >= end) {
      statusReason.textContent = `End time (${minutesToTimeString(end)}) must be strictly greater than start time (${minutesToTimeString(start)}).`;
    } else if (end - start > 120) {
      statusReason.textContent = `Requested duration (${end - start} min) exceeds the maximum allowed 120 minutes (AC2).`;
    } else {
      // Overlap with existing booking
      const conflictingBooking = selectedRoom.bookings.find(b => start < b.end && end > b.start);
      if (conflictingBooking) {
        statusReason.textContent = `Conflict: Overlaps with an existing reservation (${minutesToTimeString(conflictingBooking.start)} - ${minutesToTimeString(conflictingBooking.end)}) (AC4).`;
      } else {
        statusReason.textContent = 'Room cannot be booked for the specified parameters.';
      }
    }
  }
}

// Bind Reactive Event Listeners
[inputNow, inputStart, inputEnd, inputCapacity].forEach(el => {
  if (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  }
});

const checkboxes = document.querySelectorAll('input[name="equipment"]');
checkboxes.forEach(cb => {
  cb.addEventListener('change', render);
});

if (btnResetFilters) {
  btnResetFilters.addEventListener('click', () => {
    inputCapacity.value = '';
    checkboxes.forEach(cb => { cb.checked = false; });
    render();
  });
}

// Initial render
render();
