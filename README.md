# NestJS User Registration Module

A professional NestJS module for user registration with JWT authentication and PostgreSQL database.

## Features

- User registration with email validation
- JWT authentication
- PostgreSQL database with Prisma ORM
- Clean architecture with separation of concerns
- Robust error handling and logging
- Input validation using class-validator

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/imran-khan-rehan/user-registration
   cd user-registration
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the database connection string and JWT secret

4. Set up the database
   ```bash
   # Create migrations
   npm run prisma:migrate

   # Generate Prisma client
   npm run prisma:generate
   ```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Endpoints

- **POST /users/register** - Register a new user
  - Request body:
    ```json
    {
      "fullName": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

## Environment Variables

Create a `.env` file with the following variables:

```
# Database connection
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@localhost:5432/userdb?schema=public"

# JWT configuration
# JWT configuration
USE_HARDCODED_TOKEN=true
HARDCODED_TOKEN="test_token"
JWT_SECRET=your_actual_jwt_secret_here
JWT_EXPIRATION="1h"

# Server port
PORT=3000
```

## Testing the API

You can test the registration endpoint using curl:

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

To test protected routes, include a Bearer token:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

The project follows a modular structure:

- `src/` - Source code
  - `main.ts` - Application entry point
  - `app.module.ts` - Main module
  - `config/` - Configuration
  - `common/` - Shared components (guards, middleware, etc.)
  - `users/` - User module with controller, service, and DTOs
  - `prisma/` - Prisma service and module

## License

MIT
```

## Testing the Application

To test the application:

1. Start the PostgreSQL database
2. Set up your environment variables in `.env`
3. Run migrations: `npm run prisma:migrate`
4. Start the application: `npm run start:dev`
5. Make a POST request to `http://localhost:3000/users/register` with the required user data

## Next Steps and Best Practices

1. Add unit and e2e tests
2. Implement password reset functionality
3. Add email verification
4. Create proper authentication endpoints (login, refresh token)
5. Add role-based authorization
6. Set up CI/CD pipeline
