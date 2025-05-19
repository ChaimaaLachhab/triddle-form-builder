# Triddle Form Builder - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)](#)

## Overview

Triddle Form Builder is a powerful form creation and management platform built with modern web technologies. This repository contains the frontend codebase for the Triddle application, allowing users to create, customize, share, and analyze forms with ease.

## Features

- **Form Creation & Management**: Create, edit, and manage custom forms
- **Form Analytics**: Track and analyze form submissions and user engagement
- **Dashboard**: Get insights and overview of all your forms
- **Knowledge Base**: Access helpful resources and documentation
- **User Authentication**: Secure user accounts and data
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```
triddle-frontend/
├── .next/               # Next.js build output
├── node_modules/        # Dependencies
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages and layouts
│   │   ├── (auth)/      # Authentication related pages
│   │   ├── analytics/   # Form analytics pages
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── f/           # Public form pages
│   │   ├── forms/       # Form management pages
│   │   ├── help-support/# Help and support pages
│   │   ├── knowledge-base/# Knowledge base resources
│   │   ├── profile/     # User profile pages
│   ├── components/      # Reusable components
│   │   ├── analytics/   # Analytics related components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── forms/       # Form building components
│   │   ├── knowledge/   # Knowledge base components
│   │   ├── layout/      # Layout components
│   │   ├── modal/       # Modal components
│   │   ├── ui/          # UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and services
│   ├── pages/           # Legacy pages (if any)
│   ├── types/           # TypeScript type definitions
└── configuration files...
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd triddle-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the project root and define necessary environment variables.

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the Triddle backend API using services defined in `src/lib/api-service.ts` with configuration in `src/lib/api-config.ts`.

## Authentication

User authentication is managed through the `AuthContext` provider in `src/context/AuthContext.tsx`.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request


© 2025 Triddle. All rights reserved.
