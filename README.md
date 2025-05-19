# Triddle Form Builder

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-blue)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-lightgrey)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)](#)

## Overview

Triddle Form Builder is a powerful form creation and management platform built with modern web technologies. This monorepo contains both frontend and backend codebases for the Triddle application, providing a complete solution for creating, customizing, sharing, and analyzing forms with ease.

## Features

- **Form Creation & Management**: Create, edit, customize, publish and archive forms
- **Form Responses**: Collect and manage form submissions
- **File Uploads**: Cloudinary integration for file storage
- **Analytics Dashboard**: Track form performance and user engagement
- **Data Export**: Export form responses in CSV/JSON formats
- **Knowledge Base**: Access helpful resources and documentation
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Architecture

Triddle Form Builder consists of two main components:

- **Frontend**: A Next.js application that provides the user interface
- **Backend**: An Express.js API that handles data persistence and business logic

### Tech Stack

#### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Charts**: [Recharts](https://recharts.org/)

#### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Logging**: [Winston](https://github.com/winstonjs/winston)

## Repository Structure

```
triddle-form-builder/
├── triddle-backend/      # Backend codebase
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/              # Source code
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── index.js      # Entry point
│   └── configuration files...
│
├── triddle-frontend/     # Frontend codebase
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── app/          # App router pages and layouts
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and services
│   │   └── types/        # TypeScript type definitions
│   └── configuration files...
│
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- PostgreSQL (v12 or higher)
- Cloudinary account (for file storage)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd triddle-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the necessary variables (see backend README for details).

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:5000 with documentation at http://localhost:5000/api-docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd triddle-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend directory with the necessary variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000

## API Overview

The backend provides a comprehensive REST API for all functionality:

- **Authentication**
  - User registration and login
  - Password reset functionality
  - User profile management

- **Forms**
  - Create, read, update, and delete forms
  - Publish and archive forms
  - File uploads for forms

- **Responses**
  - Submit form responses
  - View and manage responses
  - Export responses in different formats

- **Analytics**
  - Form performance metrics
  - Field-specific analytics
  - Visit tracking

For detailed API documentation, visit http://localhost:5000/api-docs when running the backend.

## Security Features

- JWT authentication with secure cookie storage
- Password hashing with bcrypt
- XSS protection
- Rate limiting to prevent abuse
- Security headers with Helmet
- CORS configuration

## Deployment

### Backend Deployment

```bash
cd triddle-backend
npm run build
npm start
```

### Frontend Deployment

```bash
cd triddle-frontend
npm run build
npm start
```

For production deployment, consider using platforms like Vercel for the frontend and Heroku or AWS for the backend.

## Environment Variables

### Backend Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development, production) | development |
| PORT | Server port | 5000 |
| DATABASE_URL | PostgreSQL connection URL | - |
| JWT_SECRET | Secret for JWT signing | - |
| JWT_EXPIRE | JWT token expiration | 1d |
| CLOUDINARY_* | Cloudinary configuration | - |
| SMTP_* | SMTP server configuration | - |
| CORS_ORIGINS | Allowed CORS origins | - |

### Frontend Variables

Configure your frontend environment variables in `.env.local` according to your deployment needs.

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Submit a pull request

## License

© 2025 Triddle. All rights reserved.
