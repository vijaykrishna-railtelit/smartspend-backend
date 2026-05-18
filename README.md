

# SmartSpend Backend

SmartSpend Backend is a server-side application built with [NestJS](https://nestjs.com/) and TypeScript. It provides authentication, user management, email notifications, and PostgreSQL database integration for the SmartSpend platform.


## Features

- **Authentication**: Secure login with JWT token generation
- **User Management**: Create, update, fetch, and delete users
- **Email Notifications**: Sends welcome, OTP, registration, and other emails using Handlebars templates
- **PostgreSQL Integration**: Database access via a connection pool and query abstraction
- **Error Handling**: Global exception filter for consistent API errors
- **Response Interceptor**: Standardized API responses
- **Environment-based Configuration**: Uses `.env` for environment variables

src/
  app.controller.ts        # Main controller
  app.module.ts            # Root module
  app.service.ts           # Main service
  main.ts                  # Entry point
  auth/                    # Authentication module
    auth.controller.ts
    auth.dto.ts
    auth.module.ts
    auth.service.ts
    jwt.strategy.ts
  database/                # Database service and queries
    database.service.ts
    postgre.querys.json
  email/                   # Email service and templates
    email.module.ts
    email.service.ts
  templates/               # Handlebars email templates
    otp-login.hbs
    welcome.hbs
    partials/
      email-footer.hbs
      email-header.hbs
## Project Structure

```
src/
  app.controller.ts        # Main controller
  app.module.ts            # Root module
  app.service.ts           # Main service
  main.ts                  # Entry point
  auth/                    # Authentication module (login, JWT)
    auth.controller.ts
    auth.dto.ts
    auth.module.ts
    auth.service.ts
    jwt.strategy.ts
  user/                    # User management (CRUD)
    user.controller.ts
    user.dto.ts
    user.entity.ts
    user.module.ts
    user.service.ts
  database/                # Database service and queries
    database.service.ts
    postgre.querys.json
  email/                   # Email service and templates
    email.module.ts
    email.service.ts
  common/                  # Common utilities, filters, interceptors
    filters/
      all-exceptions.filter.ts
    interceptors/
      response.interceptor.ts
    utils/
      app.utils.ts
  templates/               # Handlebars email templates
    otp-login.hbs
    register-success.hbs
    welcome.hbs
    partials/
      email-footer.hbs
      email-header.hbs
test/                      # Test files
  app.e2e-spec.ts
  jest-e2e.json
```


## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
  ```bash
  npm install
  ```
3. Create a `.env` file in the root directory and configure the following variables:
  ```env
  POSTGRESQL_CONNECTION_STRING=your_postgres_connection_string
  JWT_SECRET_KEY=your_jwt_secret
  MAIL_HOST=your_smtp_host
  MAIL_PORT=your_smtp_port
  MAIL_USER=your_smtp_user
  MAIL_PASSWORD=your_smtp_password
  MAIL_FROM=your_from_email
  APP_URL=https://your-app-url.com
  ```

### Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```


## API Endpoints

### Auth
- `POST /auth/login` — Login with credentials (returns JWT and sends welcome email)

### Users
- `POST /users` — Create a new user
- `GET /users` — Get all users (JWT required)
- `GET /users/:id` — Get user by ID (JWT required)
- `PATCH /users/:id` — Update user (JWT required)
- `DELETE /users/:id` — Delete user (JWT required)

### Root
- `GET /` — Health check (returns "Hello World!")

All protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## Modules

- **AuthModule**: Handles authentication and JWT
- **UsersModule**: User CRUD operations
- **EmailModule**: Email sending and templates
- **DatabaseService**: PostgreSQL connection and query abstraction
- **Common**: Filters, interceptors, and utilities

## Email Templates

Located in `src/templates/` and used for:
- OTP login
- Registration success
- Welcome email
- Password change, account locked, etc.

## Error Handling & Response

- All errors are handled by a global exception filter for consistent API responses
- All successful responses are wrapped by a response interceptor

## License

This project is UNLICENSED and for internal use only.

## License

This project is UNLICENSED and for internal use only.
