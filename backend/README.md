# Snake Arena Backend API

Backend API for Snake Arena Interactive - a multiplayer snake game with leaderboards and spectating features.

## Features

- 🔐 **Authentication**: JWT-based user authentication with signup/login
- 🏆 **Leaderboard**: Track and display top scores by game mode
- 👀 **Spectating**: Watch live game sessions from other players
- 📊 **Database**: SQLite for development, easily switchable to PostgreSQL for production
- 📚 **API Documentation**: Interactive Swagger UI documentation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Prisma ORM with SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcrypt

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/logout` - Logout (authenticated)
- `GET /api/v1/auth/me` - Get current user (authenticated)

### Leaderboard
- `GET /api/v1/leaderboard` - Get leaderboard entries
- `POST /api/v1/leaderboard/submit` - Submit score (authenticated)

### Sessions (Spectating)
- `GET /api/v1/sessions` - Get active game sessions
- `GET /api/v1/sessions/:sessionId` - Get specific session
- `POST /api/v1/sessions/create` - Create new session (authenticated)
- `POST /api/v1/sessions/:sessionId/end` - End session (authenticated)

## Database Schema

### Users
- `userId` (Primary Key)
- `username` (Unique)
- `password` (Hashed)
- `createdAt`, `updatedAt`

### Leaderboard Entries
- `entryId` (Primary Key)
- `userId` (Foreign Key)
- `username`
- `score`
- `gameMode` (walls | pass-through)
- `timestamp`

### Game Sessions
- `sessionId` (Primary Key)
- `userId` (Foreign Key)
- `username`
- `gameMode`
- `score`
- `isActive`
- `startedAt`, `endedAt`

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Start the server:
```bash
npm start
```

### Switching to PostgreSQL

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/snakearena"
```

Run migrations:
```bash
npm run prisma:migrate
```

## Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Express middleware
│   ├── validators/            # Zod schemas
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript types
│   ├── public/                # Static files (Swagger UI)
│   └── index.ts               # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## License

MIT
