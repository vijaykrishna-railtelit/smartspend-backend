
# SmartSpend Backend

SmartSpend Backend is a server-side application built with [NestJS](https://nestjs.com/) and TypeScript. It provides authentication, email notifications, and PostgreSQL database integration for the SmartSpend platform.

## Features

- **Authentication**: Secure login endpoint with JWT token generation
- **Email Notifications**: Sends welcome and OTP emails using Handlebars templates
- **PostgreSQL Integration**: Database access via a connection pool and query abstraction
- **Environment-based Configuration**: Uses `.env` for environment variables

## Project Structure

```
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
test/                      # Test files
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

- `POST /auth/login` — Login with credentials (returns JWT and sends welcome email)

## License

This project is UNLICENSED and for internal use only.
