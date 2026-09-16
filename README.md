# Lumi

Lumi is a full-stack dating application built as an MVP. It allows users to create and manage profiles, discover other users, interact through likes, communicate through chat, and configure personal preferences and notifications.

## Demo

**Live application:** https://dating-8efalgezw-pomaino12-1491s-projects.vercel.app

## Features

- User registration and authentication
- Email and password authentication
- Profile creation and editing
- Profile photo management
- User discovery
- Likes
- Matches
- One-to-one chat
- Notifications
- User settings and preferences
- Notification preferences
- Theme selection
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Lucide React

### Backend

- Next.js App Router
- Next.js Route Handlers
- Auth.js
- Prisma ORM
- PostgreSQL
- bcryptjs

### Infrastructure

- Vercel
- PostgreSQL database

## Architecture

The application uses the Next.js App Router for both the frontend and backend.

Authentication is handled by Auth.js, while Prisma provides type-safe access to the PostgreSQL database.

The application is structured around the following main areas:

```text
app/
├── (app)/
│   ├── chat/
│   ├── discover/
│   ├── likes/
│   └── profile/
├── api/
│   ├── auth/
│   ├── me/
│   └── ...
├── login/
└── register/

components/
├── auth/
├── people/
├── chat/
└── ...

lib/
├── prisma.ts
└── ...

prisma/
└── schema.prisma

auth.ts
prisma.config.ts
```

## Database

Lumi uses PostgreSQL with Prisma ORM.

The database contains entities for authentication, user profiles, profile photos, interests, user settings, sessions, accounts, and notifications.

Prisma migrations are stored in:

```text
prisma/migrations/
```

The Prisma schema is located at:

```text
prisma/schema.prisma
```

## Authentication

Authentication is implemented using Auth.js.

The current authentication flow supports registration and login using email and password. Passwords are hashed using `bcryptjs` before being stored in the database.

Auth.js-related database entities are managed through Prisma.

## Environment Variables

Create a `.env` file in the project root for local development.

Example:

```env
DATABASE_URL="your_database_connection_string"
AUTH_SECRET="your_auth_secret"
BLOB_STORE_ID="your_blob_store_id"
BLOB_READ_WRITE_TOKEN="your_blob_read_write_token"
```

Additional environment variables may be required depending on the configured authentication providers and deployment environment.

Never commit environment variables or secrets to the repository.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL database

### Installation

Clone the repository:

```bash
git clone https://github.com/Mol4un72/dating-app.git
cd dating-app
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
touch .env
```

Configure the required environment variables.

### Prisma

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Production

The application is deployed on Vercel.

Production environment variables must be configured in the Vercel project settings.

The production database must be configured separately from the local development database.

## Code Quality

Before creating a production deployment, it is recommended to verify the application with:

```bash
npm run build
```

and ensure that Prisma is correctly generated and the database migrations are applied.

## Project Status

Lumi is currently an MVP.

The current version focuses on the core dating application flow:

```text
Registration
    ↓
Authentication
    ↓
Profile setup
    ↓
Discover users
    ↓
Likes / Matches
    ↓
Chat
```

The project is deployed and available as a live web application.

## Future Improvements

Potential improvements for future versions include:

- OAuth authentication with Google and Apple
- Real-time messaging
- Push notifications
- Improved matching and recommendation algorithms
- Advanced discovery filters
- User reporting and moderation
- Image optimization and processing
- Automated unit and integration tests
- End-to-end testing
- Improved accessibility
- Performance optimization

## License

This project is currently intended as a personal project and does not specify a public open-source license.