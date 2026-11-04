# Smart Campus - Room Availability Checker

**Assignment #04:** AI-driven Software Engineering  
**Student:** Daniyar Orazbaev | **ID:** 25B031445 | **Group:** WED18-21  
**Course:** AI-driven Software Engineering (Fall 2026)  
**Deadline:** November 10, 2026 23:59:59  

---

## 📌 Project Overview

A modular, client-side web application built with Vanilla JS, Vite, and Vitest. The application manages a catalog of campus rooms and evaluates room availability in real-time according to strict domain rules (duration bounds, touching endpoints, overlapping slots, and room block status), while supporting dynamic filtering by capacity and required equipment.

### Key Architecture Highlights
- **Zero Backend / Zero Database:** Runs 100% in the browser.
- **Strict Separation of Concerns:**
  - `src/data/rooms.js`: Centralized room catalog data fixture.
  - `src/domain/availability.js`: Pure availability logic function (`canBook`).
  - `src/domain/filtering.js`: Pure room filtering function (`filterRooms`).
  - `src/ui/app.js`: Reactive UI DOM controller.
- **100% Automated Test Coverage:** 12 Vitest unit and integration tests covering all boundary conditions.
- **Responsive Design:** Supports 375px mobile viewports through desktop displays.

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### Quick Start on Windows (1-Click)
- **`start.bat`**: Дважды кликните по файлу `start.bat` в папке проекта. Скрипт сам проверит Node.js, установит зависимости (если их нет), выполнит все 12 тестов Vitest и автоматически откроет приложение в браузере!
- **`test.bat`**: Быстрый запуск всех 12 тестов в подробном (verbose) режиме в 1 клик.

### Terminal Commands
Clone the repository and install dependencies:
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Automated Unit & Integration Tests
```bash
npm test
```
To run tests in watch mode:
```bash
npm run test:watch
```

### Build for Production
```bash
npm run build
```

---

## 🧪 Automated Test Suite (12 Vitest Tests)

All 12 test cases specified in the assignment contract are implemented across 3 test suites:

| Suite | ID | Test Description | Rule / Feature | Status |
|---|---|---|---|:---:|
| `availability.test.js` | **T01** | Allows touching endpoints (req 660-720 with existing 600-660) | AC4 | Passed ✓ |
| `availability.test.js` | **T02** | Rejects overlapping intervals (req 630-690 with existing 600-660) | AC4 | Passed ✓ |
| `availability.test.js` | **T03** | Rejects all bookings if room is blocked | AC3 | Passed ✓ |
| `availability.test.js` | **T04** | Accepts exact maximum duration (120 minutes) | AC2 Boundary | Passed ✓ |
| `availability.test.js` | **T05** | Rejects duration of 121 minutes | AC2 Boundary | Passed ✓ |
| `availability.test.js` | **T06** | Rejects booking if `start == now` | AC1 Boundary | Passed ✓ |
| `availability.test.js` | **T07** | Rejects boolean, float, and non-integer inputs | AC1 Robustness | Passed ✓ |
| `filtering.test.js` | **T08** | Filters rooms correctly by minimum capacity | F1 | Passed ✓ |
| `filtering.test.js` | **T09** | Accepts exact capacity match boundary | F1 Boundary | Passed ✓ |
| `filtering.test.js` | **T10** | Filters by ALL requested equipment | F2 | Passed ✓ |
| `filtering.test.js` | **T11** | Returns empty array on impossible constraints | F4 | Passed ✓ |
| `integration.test.js` | **T12** | Reactive room switching updates availability from false to true | F5 Integration | Passed ✓ |

### Test Execution Output
```
 RUN  v3.2.7 C:/Users/support/Desktop/2kbtu/SE/Project

 ✓ tests/integration.test.js (1 test) 2ms
 ✓ tests/availability.test.js (7 tests) 4ms
 ✓ tests/filtering.test.js (4 tests) 4ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  661ms
```

---

## 🏛️ Architecture & Component Map

```
Project/
├── .gitignore               # Ignored dependencies & build artifacts
├── index.html               # Responsive web UI (mobile 375px ready)
├── package.json             # Vite & Vitest configuration
├── README.md                # Project documentation & run guide
├── REPORT.md                # Comprehensive Assignment #04 Report
├── src/
│   ├── data/
│   │   └── rooms.js         # 4 fictional rooms fixture (single source of truth)
│   ├── domain/
│   │   ├── availability.js  # Pure canBook domain logic (AC1-AC5)
│   │   └── filtering.js     # Pure filterRooms domain logic (F1-F4)
│   └── ui/
│       └── app.js           # Reactive UI event handler & DOM renderer (F5)
└── tests/
    ├── availability.test.js # Unit tests T01 - T07
    ├── filtering.test.js    # Unit tests T08 - T11
    └── integration.test.js  # Integration test T12
```

---

## 📜 Git Version History

To compare the baseline monolithic prototype (Practice 08 / Assignment 03) against the final refactored architecture:

```bash
# View commit history
git log --oneline

# View diff between baseline and final refactor
git diff HEAD~1 HEAD
```
