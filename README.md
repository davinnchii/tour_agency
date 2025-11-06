# Tour Agency Management System

A full-stack web application for managing tour operations between tour operators and travel agents. This project was developed as a submission for the **Software Engineering** course in the third year of university studies, following a technical specification document.

## 📋 Project Overview

This application provides a platform where:
- **Tour Operators** can create, manage, and publish tour packages
- **Travel Agents** can search for tours, subscribe to operators, and submit booking requests
- Operators can review and manage booking requests from agents

The system implements role-based access control, real-time data management, and a modern, responsive user interface with internationalization support.

## 🎯 Project Context

**University Project** - Third Year Software Engineering Course

This project was developed according to a technical specification document as part of the Software Engineering curriculum. The goal was to design and implement a complete web application following software engineering best practices, including:

- Requirements analysis and system design
- Database modeling and API design
- Frontend and backend development
- Testing and quality assurance
- Documentation

### 📄 Technical Specification

The project was built according to the following technical requirements:

**For Travel Agency Administrators:**
- Create/delete subscriptions to tour operator services
- View list of requests
- View detailed information about requests
- Add requests for their own agency
- View list of tours
- Search for tours

**For Tour Operator Administrators:**
- View list of requests
- View detailed information about requests
- Delete requests
- Add new tours
- Delete tours
- View list of tours
- Search for tours

For detailed breakdown of tasks and implementation status, see [TECH_TASK.md](./TECH_TASK.md)

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - Registration and login system
  - Role-based access control (Operator/Agent)
  - JWT-based session management

- **Tour Management** (Operators)
  - Create, view, update, and delete tours
  - Tour details: title, description, country, price, dates
  - Tour search and filtering capabilities

- **Tour Discovery** (Agents)
  - Advanced tour search with filters (country, price range, dates)
  - Tour browsing and detailed information
  - Subscription system to follow specific operators

- **Request Management**
  - Agents can submit booking requests for tours
  - Operators can approve, reject, or mark requests as pending
  - Request status tracking

### User Interface Features
- **Modern Design**
  - Beautiful gradient backgrounds and glass morphism effects
  - Smooth animations and transitions
  - Responsive layout for all screen sizes

- **Dark Mode Support**
  - Complete dark theme implementation
  - Green accent colors in dark mode
  - Theme preference persistence

- **Internationalization (i18n)**
  - English and Ukrainian language support
  - Language switcher component
  - All UI text translated

- **Enhanced UX**
  - Loading states and error handling
  - Toast notifications for user feedback
  - Form validation with helpful error messages
  - Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router DOM 7.6.0
- **Styling**: Tailwind CSS 4.1.8
- **Form Handling**: React Hook Form 7.57.0 + Yup 1.6.1
- **Internationalization**: i18next 25.2.1
- **HTTP Client**: Axios 1.9.0
- **Testing**: Vitest 1.0.4 + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.15.0
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **Testing**: Jest 29.7.0 + Supertest 7.0.0
- **Development**: Nodemon 3.1.10

## 📁 Project Structure

```
tour_agency/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── tests/              # Backend tests
│   ├── server.js           # Entry point
│   └── package.json
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Theme)
│   │   ├── features/      # Redux slices
│   │   ├── hooks/          # Custom React hooks
│   │   ├── locales/        # Translation files
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store configuration
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── .gitignore              # Git ignore rules
├── TESTING.md              # Testing documentation
└── README.md               # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/tour_agency
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🧪 Testing

### Backend Tests

Run backend tests:
```bash
cd backend
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Frontend Tests

Run frontend tests:
```bash
cd frontend
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

For detailed testing information, see [TESTING.md](./TESTING.md)

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tour Endpoints
- `GET /api/tours` - Get all tours (with search/filter support)
- `POST /api/tours` - Create a new tour (operator only)
- `GET /api/tours/:id` - Get tour by ID
- `PUT /api/tours/:id` - Update tour (operator only)
- `DELETE /api/tours/:id` - Delete tour (operator only)

### Request Endpoints
- `GET /api/requests` - Get requests (role-based filtering)
- `POST /api/requests` - Create a booking request (agent only)
- `PUT /api/requests/:id/status` - Update request status (operator only)
- `DELETE /api/requests/:id` - Delete request

### Subscription Endpoints
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Subscribe to an operator (agent only)
- `DELETE /api/subscriptions/:id` - Unsubscribe from operator

### User Endpoints
- `GET /api/users/operators` - Get all operators

## 👥 User Roles

### Tour Operator
- Create and manage tour packages
- View and manage booking requests
- Approve/reject agent requests
- Delete own tours

### Travel Agent
- Search and browse available tours
- Subscribe to tour operators
- Submit booking requests for tours
- View request status
- Manage subscriptions

## 🎨 UI Features

### Design Highlights
- **Gradient Backgrounds**: Beautiful animated gradients on auth pages
- **Glass Morphism**: Modern frosted glass effect on cards
- **Smooth Animations**: Fade-in and slide-in animations
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Dark Mode
- Complete dark theme implementation
- Green accent colors in dark mode
- Automatic theme detection
- Theme preference saved in localStorage

### Internationalization
- English and Ukrainian language support
- Easy language switching
- All UI text fully translated

## 🚢 Deployment

### Backend Deployment
The backend can be deployed to:
- Railway (configuration included)
- Vercel (configuration included)
- Heroku
- Any Node.js hosting platform

### Frontend Deployment
The frontend can be deployed to:
- GitHub Pages (configured)
- Vercel
- Netlify
- Any static hosting service

Build the frontend:
```bash
cd frontend
npm run build
```

## 📚 Development Notes

### Database Seeding
The backend includes a seed script to populate the database with sample data:
- Default operator: `operator@example.com` / `123456`
- Default agent: `agent@example.com` / `123456`

### Environment Variables
Make sure to set up proper environment variables for:
- MongoDB connection string
- JWT secret key
- API URLs
- Port configurations

## 🤝 Contributing

This is a university project submission. For questions or improvements, please refer to the project repository.

## 📄 License

This project was created for educational purposes as part of a university Software Engineering course.

## 👨‍💻 Author

Developed as a third-year Software Engineering course project submission.

---

**Note**: This project was developed according to a technical specification document provided as part of the Software Engineering curriculum requirements.

