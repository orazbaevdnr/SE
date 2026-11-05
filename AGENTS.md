# AGENTS.md - Repository Instructions & Engineering Guidelines

## 📌 Project Overview
**Project Name:** Smart Campus Room Availability Checker  
**Student:** Daniyar Orazbaev | **ID:** 25B031445 | **Group:** WED18-21  
**Course:** AI-driven Software Engineering (Practice #09 / Assignment #04)  
**Scope:** Client-side room availability calculation engine and room catalog filtering. Built with pure Vanilla JS, Vite, and Vitest.

---

## ⛔ Strict Project Constraints
1. **Zero Backend / Zero Database:** Everything runs 100% client-side in the browser. Do not introduce Express, SQLite, Node backends, or mock asynchronous `Promise`/`setTimeout` layers.
2. **Framework Restrictions:** Do NOT use React, Vue, Angular, or heavy UI frameworks. Use pure Vanilla JS and native DOM APIs.
3. **Preserve AC1–AC6:** Never weaken, delete, or break the baseline acceptance criteria.
4. **No Login / No Booking Persistence:** Only calculate availability decisions for display. No user accounts or storage.

---

## 📋 Acceptance Criteria (AC1–AC6)
- **AC1 (Bounds & Past Requests):** $0 \le \text{start} < \text{end} \le 1440$ minutes. Start time must be strictly $> \text{now}$. Integer minutes only. Reject non-integers, floats, booleans, and null/undefined.
- **AC2 (Duration):** Maximum 120 minutes allowed. Exactly 120 is valid; 121 is invalid.
- **AC3 (Blocked Status):** If `room.blocked === true`, room is always reported as unavailable.
- **AC4 (Overlap Rule):** Strict overlap: $\text{start} < \text{existing.end} \land \text{end} > \text{existing.start}$. Touching endpoints (e.g. 600–660 and 660–720) DO NOT overlap and are valid.
- **AC5 (Pure Functions & Immutability):** Do not mutate input parameters or the `bookings` array (never use in-place `.sort()` or element modification).
- **AC6 (Clear Feedback):** Provide immediate, descriptive diagnostic feedback in both desktop and mobile viewports.

---

## 🏛️ Engineering Rules & Approved Patterns
- **Keep Changes Minimal:** Prefer simple pure functions over complex object-oriented hierarchies.
- **Pattern Justification:** Apply at most ONE or TWO design patterns only when they solve a concrete, identifiable maintainability problem:
  1. **Small Module Boundary:** Separate pure booking rules (`src/domain/availability.js`), catalog filtering (`src/domain/filtering.js`), data fixtures (`src/data/rooms.js`), and UI rendering (`src/ui/app.js`).
  2. **Adapter Pattern:** Normalize heterogeneous booking representations (`{start, end}` vs `{startTime, endTime}`) at the input boundary (`src/domain/adapters.js`) so core logic remains format-agnostic.
- **Avoid Unjustified Patterns:** Do NOT add Singleton, Factory, Visitor, or unnecessary inheritance hierarchies.

---

## 🚀 Build, Test & Run Commands
- **Install Dependencies:** `npm install`
- **Run Tests:** `npm test` or `npx vitest run --reporter=verbose`
- **Run Tests in Watch Mode:** `npm run test:watch`
- **Development Server:** `npm run dev` (opens `http://localhost:5173`)
- **Production Build:** `npm run build`
- **One-Click Windows Launcher:** `start.bat` / `test.bat`

---

## 🔍 Verification Checklist for AI Agents
Before proposing or applying any changes:
1. Read this `AGENTS.md` and respect all scope boundaries.
2. Identify the smallest design problem and write a two-sentence rationale: `problem -> pattern -> expected benefit`.
3. Keep core availability rules pure and format-independent.
4. Run regression tests (`npm test`) and ensure 100% pass rate.
5. Verify both desktop (1280px) and mobile (375px) UI responsiveness.
6. Report changed files, rationale, and exact test execution output.
