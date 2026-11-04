// Baseline Monolithic Script (Practice #08 / Assignment #03)
// Notice tight coupling, lack of type validation, and in-place array mutation.

const fixedNow = 480; // 08:00

// Risk 1: Tight data coupling - hardcoded single room schedule
const auditoriumBookings = [
  { start: 540, end: 600 } // 09:00 - 10:00
];

function checkAvailability(start, end, now, bookings) {
  // Risk 2: Loose type sanitization (missing strict integer checks, boolean true -> 1)
  if (start <= now) return false;
  if (end <= start) return false;
  if (end - start > 120) return false;
  if (start < 0 || end > 1440) return false;

  // Risk 3: In-place mutation of the bookings array
  bookings.sort((a, b) => a.start - b.start);

  for (let b of bookings) {
    if (start < b.end && end > b.start) {
      return false;
    }
  }
  return true;
}

// UI binding tightly coupled in the same monolithic file
const checkBtn = document.getElementById('checkBtn');
if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    const startVal = Number(document.getElementById('startTime').value);
    const endVal = Number(document.getElementById('endTime').value);
    const resultDiv = document.getElementById('result');

    const isAvailable = checkAvailability(startVal, endVal, fixedNow, auditoriumBookings);

    resultDiv.style.display = 'block';
    if (isAvailable) {
      resultDiv.className = 'available';
      resultDiv.textContent = 'Room is Available for booking!';
    } else {
      resultDiv.className = 'unavailable';
      resultDiv.textContent = 'Room is Unavailable or invalid time!';
    }
  });
}
