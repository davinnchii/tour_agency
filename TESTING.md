# Testing Guide

This project includes unit tests for both the backend and frontend.

## Backend Tests

### Setup
The backend uses **Jest** and **Supertest** for testing.

### Running Tests
```bash
cd backend
npm install
npm test
```

### Test Files
- `backend/tests/__tests__/authController.test.js` - Tests for authentication (register, login)
- `backend/tests/__tests__/tourController.test.js` - Tests for tour CRUD operations

### Test Configuration
- Jest configuration: `backend/jest.config.js`
- Test setup: `backend/tests/setup.js`

### Notes
- Tests require a MongoDB test database (default: `mongodb://localhost:27017/tour_agency_test`)
- Set `MONGODB_URI` environment variable to use a different test database
- Tests clean up data after each test run

## Frontend Tests

### Setup
The frontend uses **Vitest** and **React Testing Library** for testing.

### Running Tests
```bash
cd frontend
npm install
npm test
```

### Running Tests with UI
```bash
npm run test:ui
```

### Running Tests with Coverage
```bash
npm run test:coverage
```

### Test Files
- `frontend/src/utils/__tests__/dateHelpers.test.ts` - Tests for date utility functions
- `frontend/src/utils/__tests__/countryHelpers.test.ts` - Tests for country utility functions
- `frontend/src/features/auth/__tests__/authSlice.test.ts` - Tests for Redux auth slice

### Test Configuration
- Vitest configuration: `frontend/vite.config.ts`
- Test setup: `frontend/src/tests/setup.ts`
- Test utilities: `frontend/src/tests/testUtils.tsx`

## Test Coverage

The tests cover:
- **Backend:**
  - User registration and login
  - Tour CRUD operations
  - Tour filtering and search
  - Error handling

- **Frontend:**
  - Date utility functions (formatting, validation)
  - Country helper functions
  - Redux auth slice (login, register, logout)
  - State management

## Adding New Tests

### Backend
Create new test files in `backend/tests/__tests__/` following the naming pattern `*.test.js`.

### Frontend
Create new test files next to the source files with the pattern `*.test.ts` or `*.test.tsx`, or in `__tests__` directories.

