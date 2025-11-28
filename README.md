# Employee Onboarding Form Builder

A full-stack web application for dynamic form building and submission management.

## Project Structure

```
project-root/
├── backend/          # Express.js API server
├── frontend/         # React frontend application
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## Tech Stack

### Frontend
- **React 19** with Vite
- **TanStack Query** for server state management
- **TanStack Form** for form handling
- **TanStack Table** for data tables
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **CORS** support
- In-memory data persistence
- RESTful API design

## Features

### Core Functionality
- ✅ Dynamic form rendering with 8 field types
- ✅ Server-side validation
- ✅ Form submission with error handling
- ✅ Submissions table with pagination
- ✅ Server-side sorting
- ✅ Search functionality (debounced)
- ✅ Edit/Delete submissions
- ✅ CSV export

### Field Types Supported
- Text
- Number
- Select
- Multi-select
- Date
- Textarea
- Switch

### Validation Rules
- Required fields
- Min/Max length
- Regex patterns
- Min/Max values
- Min/Max date
- Min/Max selected options

## API Endpoints

### Form Schema
- `GET /api/form-schema` - Returns the form configuration

### Submissions
- `GET /api/submissions` - Paginated list with sorting
  - Query params: `page`, `limit`, `sortBy`, `sortOrder`
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

### Running the Application

#### Development
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 5173) concurrently.

#### Production
```bash
npm run start
```

### Individual Services

#### Backend Only
```bash
cd backend
npm start
```

#### Frontend Only
```bash
cd frontend
npm run dev
```

## Milestone Completion Status

### Milestone 1 - Frontend Development ✅
- Dynamic form with all required field types
- TanStack Query/Form/Table integration
- Proper validation and error handling
- Submissions table with pagination and sorting
- CSV export functionality
- Edit/Delete operations
- Debounced search
- Responsive UI with Tailwind CSS

### Backend Implementation ✅
- RESTful API with Express.js
- Form schema endpoint
- Submissions CRUD operations
- Server-side validation
- Pagination and sorting
- Error handling and CORS
- In-memory persistence

## Known Issues
- None

## Assumptions
- Backend runs on port 5000, frontend on 5173
- Data persists in memory (resets on server restart)
- Form schema is static as per requirements
- All validation rules implemented as specified

## API Response Examples

### Form Schema Response
```json
{
  "title": "Employee Onboarding Form",
  "description": "Please fill out this form...",
  "fields": [...]
}
```

### Submissions List Response
```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Submission Create/Update Response
```json
{
  "success": true,
  "id": 1,
  "createdAt": "2025-11-28T07:00:00.000Z"
}
```

## Development Notes

- Frontend uses absolute URLs to backend (https://matbook-ass-1.onrender.com)
- All API calls include proper error handling
- Form validation matches backend validation rules
- Table supports server-side operations
- Search is debounced to prevent excessive API calls