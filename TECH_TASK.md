# Technical Specification

## Project Description

Develop a web application for managing interactions between travel agencies and tour operators.

## Functional Requirements

### Role: Travel Agency Administrator (Travel Agent)

#### 1. Subscription Management
- ✅ Create subscriptions to tour operator services
- ✅ Delete subscriptions to tour operator services
- ✅ View list of available tour operators

#### 2. Request Management
- ✅ View list of requests
- ✅ View detailed information about a request
- ✅ Add a request for own agency
- ✅ Delete own requests

#### 3. Tour Operations
- ✅ View list of tours
- ✅ Search for tours
- ✅ Filter tours by various criteria (country, price, dates)

---

### Role: Tour Operator Administrator (Tour Operator)

#### 1. Request Management
- ✅ View list of requests
- ✅ View detailed information about a request
- ✅ Delete requests
- ✅ Change request status (pending, approved, rejected)

#### 2. Tour Management
- ✅ Add new tour
- ✅ Delete tours
- ✅ Edit tours (optional)
- ✅ View list of own tours

#### 3. Search and Filtering
- ✅ View list of tours
- ✅ Search for tours
- ✅ Filter tours by various criteria

---

## Task Breakdown

### 1. Authentication and Authorization System

#### 1.1 User Registration
- [x] Registration form with role selection (Agent/Operator)
- [x] Registration data validation
- [x] Password hashing (bcrypt)
- [x] Save users to database

#### 1.2 User Login
- [x] Login form
- [x] Credentials verification
- [x] JWT token generation
- [x] User session storage

#### 1.3 Route Protection
- [x] Middleware for JWT token verification
- [x] User role verification
- [x] API endpoints protection

---

### 2. Data Models

#### 2.1 User Model
- [x] Fields: name, email, password, role
- [x] Email and password validation
- [x] Password hashing methods

#### 2.2 Tour Model
- [x] Fields: title, description, country, price, startDate, endDate, operator
- [x] Date validation (startDate < endDate)
- [x] Search indexes
- [x] Relationship with User (operator)

#### 2.3 Request Model
- [x] Fields: tour, customerName, customerEmail, status, createdBy, agency, operator
- [x] Statuses: pending, approved, rejected
- [x] Relationships with Tour and User

#### 2.4 Subscription Model
- [x] Fields: agency, operator
- [x] Relationships with User (agency and operator)

---

### 3. Backend API

#### 3.1 Authentication API
- [x] `POST /api/auth/register` - Registration
- [x] `POST /api/auth/login` - Login
- [x] `GET /api/auth/me` - Current user information

#### 3.2 Tours API
- [x] `GET /api/tours` - Get list of tours (with search and filtering)
- [x] `POST /api/tours` - Create tour (operators only)
- [x] `GET /api/tours/:id` - Get tour by ID
- [x] `DELETE /api/tours/:id` - Delete tour (owner only)

#### 3.3 Requests API
- [x] `GET /api/requests` - Get list of requests (with role-based filtering)
- [x] `POST /api/requests` - Create request (agents only)
- [x] `PUT /api/requests/:id/status` - Update request status (operators only)
- [x] `DELETE /api/requests/:id` - Delete request

#### 3.4 Subscriptions API
- [x] `GET /api/subscriptions` - Get user subscriptions
- [x] `POST /api/subscriptions` - Create subscription (agents only)
- [x] `DELETE /api/subscriptions/:id` - Delete subscription

#### 3.5 Users API
- [x] `GET /api/users/operators` - Get list of operators

---

### 4. Frontend - Components

#### 4.1 Authentication
- [x] LoginPage - Login page
- [x] RegisterPage - Registration page
- [x] ProtectedRoute - Route protection component

#### 4.2 Agent Dashboard
- [x] AgentDashboard - Agent main dashboard
- [x] "Search Tours" tab - TourSearch + TourSearchResult
- [x] "Operators" tab - List of operators with subscription capability
- [x] "My Requests" tab - List of agent requests

#### 4.3 Operator Dashboard
- [x] OperatorDashboard - Operator main dashboard
- [x] "All Tours" tab - List of all tours
- [x] "Create Tour" tab - CreateTourForm
- [x] "Requests" tab - List of requests with status change capability

#### 4.4 Tour Components
- [x] TourCard - Tour card (default and compact variants)
- [x] TourSearch - Search and filtering form
- [x] TourSearchResult - Search results
- [x] CreateTourForm - Tour creation form

#### 4.5 Helper Components
- [x] LanguageSwitcher - Language switcher
- [x] ThemeToggle - Theme switcher (light/dark)
- [x] TourPagination - Results pagination

---

### 5. State Management (Redux)

#### 5.1 Auth Slice
- [x] Authentication state
- [x] Actions: login, register, logout
- [x] Async thunks for API calls

#### 5.2 Tours Slice
- [x] Tours state
- [x] Actions: fetchTours, addTour, removeTour, searchTours
- [x] Search and filtering

#### 5.3 Requests Slice
- [x] Requests state
- [x] Actions: fetchRequests, addRequest, removeRequest, updateRequestStatus

#### 5.4 Subscriptions Slice
- [x] Subscriptions state
- [x] Actions: fetchSubscriptions, addSubscription, removeSubscription

#### 5.5 Users Slice
- [x] Users state (operators)
- [x] Action: getOperators

---

### 6. UI/UX Features

#### 6.1 Design
- [x] Modern gradient design
- [x] Glass morphism effects
- [x] Smooth animations and transitions
- [x] Responsive design

#### 6.2 Dark Theme
- [x] Dark theme implementation
- [x] Green accent colors in dark mode
- [x] Theme preference storage

#### 6.3 Internationalization
- [x] English language support
- [x] Ukrainian language support
- [x] Language switcher

#### 6.4 UX Improvements
- [x] Loading states
- [x] Error handling and error display
- [x] Toast notifications
- [x] Form validation
- [x] Optimistic UI updates

---

### 7. Search and Filtering

#### 7.1 Search Functionality
- [x] Text search by title and description
- [x] Country filter
- [x] Price range filter (min/max)
- [x] Date filter (startDate, endDate)
- [x] Sorting (by title, price, country, date)

#### 7.2 Pagination
- [x] Results pagination
- [x] Navigation between pages
- [x] Display total number of results

---

### 8. Testing

#### 8.1 Backend Tests
- [x] Tests for authController (register, login)
- [x] Tests for tourController (CRUD operations)
- [x] Tests for search and filtering
- [x] Jest configuration

#### 8.2 Frontend Tests
- [x] Tests for utilities (dateHelpers, countryHelpers)
- [x] Tests for Redux slices (authSlice)
- [x] Vitest configuration

---

### 9. Documentation

#### 9.1 Technical Documentation
- [x] README.md with project description
- [x] TESTING.md with testing instructions
- [x] TECH_TASK.md with task breakdown

#### 9.2 Code Documentation
- [x] Code comments
- [x] API endpoints description
- [x] Components description

---

## Implementation Status

✅ **All core features implemented**

The project fully complies with the technical specification and includes additional improvements:
- Dark theme
- Internationalization
- Enhanced UI/UX
- Testing
- Documentation

---

## Additional Enhancements (Beyond Requirements)

The following features were added to improve project quality:

1. **Dark Theme** - Full dark mode support with green accents
2. **Internationalization** - English and Ukrainian language support
3. **Enhanced UI** - Modern design with gradients and animations
4. **Testing** - Unit tests for backend and frontend
5. **Optimization** - Lazy loading, memoization, optimistic updates
6. **Documentation** - Complete project documentation
