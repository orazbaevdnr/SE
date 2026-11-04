# Assignment #04: AI-driven Software Engineering

## Master Project Specification & Agent Prompt

**Student:** Orazbaev Daniyar | **KBTU ID:** 25B031445 | **Group:** WED18-21
**Course:** AI-driven Software Engineering (Fall 2026)
**Deadline:** November 10, 2026 23:59:59

## 🤖 PART 0: THE ANTI-GRAVITY AGENT PROMPT

*(Copy the block below and paste it into Cursor, Windsurf, or Bolt.new to generate the project)*

> **SYSTEM INSTRUCTION FOR AI CODING AGENT:**
> You are a Senior Software Engineer executing "Assignment #04: Smart Campus Room Availability Checker".
> Read the specifications in this document carefully. Your goal is to generate a pristine, modular Vanilla JS web application using Vite and Vitest.
>
> **CRITICAL CONSTRAINTS:**
>
> 1. **Zero Backend/DB:** Everything must run client-side in the browser. Do not use React/Vue; use pure Vanilla JS + DOM API.
>
> 2. **Strict Module Separation:** Separate data (`rooms.js`), domain logic (`availability.js`, `filtering.js`), and UI (`app.js`).
>
> 3. **Preserve AC1-AC6:** The original availability rules (overlapping, max 120 min, etc.) MUST NOT break.
>
> 4. **Implement F1-F5:** Build the new room catalog filtering logic (capacity, equipment, blocked status, reactive UI).
>
> 5. **TDD / Testing:** Generate exactly 12 Vitest unit tests covering the boundary cases specified below.
>
> **ACTION REQUIRED:** Generate the file structure and write the code for all files described in "PART 2: FILE CONTRACTS". Ensure the UI is responsive (375px mobile support) and looks modern.

## 📋 PART 1: DOMAIN REQUIREMENTS

### Baseline Rules (Must Preserve)

* **AC1 (Bounds):** $0 \le \text{start} < \text{end} \le 1440$. Start must be strictly `> now`. Integer minutes only.

* **AC2 (Duration):** Max 120 minutes. Exactly 120 is valid; 121 is invalid.

* **AC3 (Blocked):** If `room.blocked === true`, always return Unavailable.

* **AC4 (Overlap):** Strict overlap rule: `start < existing.end && end > existing.start`. Touching endpoints (600-660 and 660-720) DO NOT overlap.

* **AC5 (Pure):** Do not mutate input arrays.

### New Features (To Implement)

* **F1 (Capacity Filter):** `room.capacity >= requestedAttendees`.

* **F2 (Equipment Filter):** Room must contain ALL selected checkboxes (`['Projector', 'PCs']`).

* **F3 (Blocked Check):** Blocked rooms display a visual tag but cannot be booked.

* **F4 (Empty State):** Show "No matching rooms found" if filters return an empty array.

* **F5 (Reactivity):** Changing any input (time, room, filters) immediately updates the Availability Status.

## 📁 PART 2: ARCHITECTURE & FILE CONTRACTS

*(Agent: Generate these files according to the strict signatures below)*

```
smart-campus/
├── package.json          # Vite & Vitest scripts
├── index.html            # Responsive UI (CSS in <style> or separate file)
├── src/
│   ├── data/rooms.js     # Array of 4 fictional rooms (ID, name, capacity, equipment[], blocked, bookings[])
│   ├── domain/
│   │   ├── availability.js # export function canBook({ start, end, now, blocked, bookings }) -> boolean
│   │   └── filtering.js    # export function filterRooms(rooms, { capacity, equipment }) -> array
│   └── ui/app.js         # DOM manipulation and event listeners
└── tests/
    ├── availability.test.js # Vitest: 7 tests for AC1-AC5
    ├── filtering.test.js    # Vitest: 4 tests for F1-F4
    └── integration.test.js  # Vitest: 1 test for F5 (Room switching)

```

**Data Fixture Requirement (`rooms.js`):**
Create 4 rooms:

1. "Auditorium A" (Cap: 50, Eq: Projector, Mic. Booked 09:00-10:00)

2. "Lab B" (Cap: 20, Eq: PCs, Whiteboard. Booked 10:00-11:00)

3. "Pod C" (Cap: 6, Eq: TV. No bookings)

4. "Hall D" (Cap: 100, Blocked: true)

## 🧪 PART 3: TEST SPECIFICATION

*(Agent: Implement these exact Vitest cases)*

**availability.test.js**

1. `T01`: Allows touching endpoints (e.g., req 660-720 alongside existing 600-660).

2. `T02`: Rejects overlapping intervals (e.g., req 630-690).

3. `T03`: Rejects all if room is blocked.

4. `T04`: Accepts exact max duration (120 min).

5. `T05`: Rejects duration of 121 min.

6. `T06`: Rejects if start == now.

7. `T07`: Rejects boolean or non-integer inputs (Robustness).

**filtering.test.js**
8. `T08`: Filters correctly by minimum capacity (F1).
9. `T09`: Exact capacity match is accepted (F1 Boundary).
10. `T10`: Filters by ALL requested equipment (F2).
11. `T11`: Returns empty array on impossible constraints (F4).

**integration.test.js**
12. `T12`: Verifies that evaluating availability on a busy room returns `false`, but switching the `room_id` state to an empty room returns `true` (F5).

## 📑 PART 4: STUDENT ENGINEERING REPORT

*(Ready for Assignment Submission)*

### Task #01: Codebase Analysis

* **Initial State:** The Practice 08 codebase was a monolithic structure coupling validation, a single hardcoded room fixture, and UI rendering.

* **Maintainability Risks Identified:**

  1. *Tight Data Coupling:* Hardcoded single-room schedule inside the UI logic prevented multi-room scaling.

  2. *Type Sanitization:* Missing type assertions allowed JS to evaluate `start: true` as `1` in numeric comparisons.

  3. *State Mutation:* In-place `array.sort()` on bookings array risked mutating the source of truth across renders.

* **Rejected AI Suggestion:** The AI initially suggested adding a mock `Promise`-based async backend. I rejected this because it violated the project constraint to avoid backends and adds unnecessary complexity for a simple synchronous calculator.

### Task #03: Refactoring Decisions

* **Decision 1 (Pure Domain Functions):** I separated `canBook` and `filterRooms` into pure functions without DOM dependencies. This allowed 100% test coverage via Vitest without needing a browser environment.

* **Decision 2 (Centralized Data Source):** Moved room catalog into a dedicated `rooms.js` module. This acts as a Single Source of Truth for both the UI and the test suites.

### Task #05: Quality Evaluation Table

| Metric | Baseline (Assignment #03) | Final (Assignment #04) | Measurement Method | 
| ----- | ----- | ----- | ----- | 
| **Test Pass Rate** | 17/19 (Failed type boundaries) | **12/12 (100%)** | Terminal `vitest run` output | 
| **Logic Duplication** | 3 locations | **0 locations** | Manual code inspection | 
| **Architecture** | 1 Monolithic file | **4 Modules** (Data, UI, x2 Domain) | Directory structure | 
| **Capabilities** | 1 Room, No filters | **4 Rooms, Cap/Eq Filters** | UI Verification | 
| **Known Limitation** | Same-day integer checks only | Unresolved (multi-day dates) | Explicit scope analysis | 

### Task #06: AI Reflection

During Assignment #04, I utilized AI coding assistants (Claude / Bolt) using a highly structured "Anti-Gravity" prompt specifying exact file contracts and pure function boundaries.
**Context:** I provided the AI with the full AC1-AC6 list, F1-F5 requirements, and strict instructions forbidding React, backends, or database setups.
**Evaluation:** The AI was exceptionally good at generating the Vitest boundary cases based on my textual descriptions. However, it initially failed to use strict inequalities (`>`) for the capacity filter, using `>=` only after a manual correction prompt.
**Verification:** I personally verified the UI responsiveness on a 375px mobile view and manually triggered the F4 "Empty State" message. The TDD approach directly influenced my engineering decisions: writing the test for `start == now` forced the AI to implement robust type-checking in the `availability.js` module before touching the UI layer.
**Next Steps:** The next logical improvement would be migrating the codebase to TypeScript to natively prevent the boolean/float input bugs we tested for in T07, and adding ARIA labels for accessibility.