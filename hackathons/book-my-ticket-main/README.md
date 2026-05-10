# Book My Ticket

A BookMyShow-inspired movie ticket booking backend built for the Chai Aur SQL hackathon assignment. The project extends the starter seat-booking code instead of replacing it, adding JWT authentication, protected booking endpoints, PostgreSQL-backed booking records, duplicate-seat protection, and a repeatable API integration test flow.

## Project Inspiration

The assignment simulates a realistic backend change: an existing ticket-booking prototype already has working seat endpoints, and the job is to evolve it into a safer production-style API. The inspiration is the core BookMyShow flow:

1. A user signs up or logs in.
2. The user browses movies and showtimes.
3. The user checks available seats.
4. The user books one or more seats.
5. The backend prevents the same seat from being booked twice.
6. The booking is tied to the logged-in user.

The focus is backend correctness and integration with the starter code. Frontend work is optional, so this repository prioritizes API structure, database design, authentication, and testing.

## What This Project Does

- Registers users with hashed passwords.
- Logs users in with JWT access and refresh tokens.
- Protects user and booking routes with bearer-token authentication.
- Stores users, movies, shows, seats, bookings, and booked seats in PostgreSQL.
- Lists mock movie data and seeded show data.
- Shows seat availability for a seeded show.
- Creates bookings only for authenticated users.
- Prevents duplicate and overlapping seat bookings.
- Associates every booking with the authenticated user's `user_id`.
- Keeps the original starter `seats` table behavior in sync for compatibility.
- Provides Requestly/Postman collection files for manual API testing.
- Provides an automated integration flow for the main API and database rules.

## Tech Stack

- Node.js
- Express 5
- PostgreSQL
- `pg` for database access
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT auth
- `joi` for request validation
- `express-rate-limit` for auth endpoint protection
- Docker Compose for local PostgreSQL

## Repository Layout

```text
book-my-ticket-main/
|-- README.md
|-- index.html
|-- index.mjs
|-- package.json
|-- frontend/
|   `-- src/index.html
`-- backend/
    |-- docker-compose.yml
    |-- package.json
    |-- server.js
    |-- docs/
    |   `-- requestly-api-testing.md
    |-- requestly/
    |   |-- book-my-ticket.postman_collection.json
    |   `-- book-my-ticket.postman_environment.json
    |-- scripts/
    |   `-- test-api-flow.mjs
    |-- sql/
    |   |-- 001_starter_schema.sql
    |   |-- 002_auth_schema.sql
    |   `-- 003_booking_schema.sql
    `-- src/
        |-- app.js
        |-- common/
        |   |-- config/
        |   |-- dto/
        |   |-- middleware/
        |   `-- utils/
        `-- modules/
            |-- auth/
            |-- bookings/
            |-- legacy/
            |-- locations/
            |-- movies/
            `-- seats/
```

## Architecture

The backend is organized around small modules and shared common utilities.

```text
Client or API tester
        |
        v
Express app
        |
        +-- /health
        +-- /api/v1/auth      -> register, login, refresh, verify, password reset, me
        +-- /api/v1/movies    -> movie list, movie detail, seat availability
        +-- /api/v1/bookings  -> protected create booking and my bookings
        |
        v
Middleware
        |
        +-- validation middleware
        +-- auth middleware
        +-- rate-limit middleware
        +-- error middleware
        |
        v
Services and models
        |
        v
PostgreSQL
```

### Backend Layers

- `backend/server.js` starts the server, verifies the database connection, and attaches final error handlers.
- `backend/src/app.js` creates the Express app, configures JSON parsing, CORS, cookies, and mounts routes.
- `backend/src/common/config` contains environment and database configuration.
- `backend/src/common/middleware` contains auth, validation, rate-limiting, and error middleware.
- `backend/src/common/utils` contains shared helpers for API errors, JWTs, hashing, tokens, and mail.
- `backend/src/modules/auth` owns registration, login, token refresh, account verification, password reset, and current-user lookup.
- `backend/src/modules/movies` owns mock movie browsing and show seat availability.
- `backend/src/modules/bookings` owns protected booking creation and current-user booking history.
- `backend/src/modules/seats` owns starter seat-table compatibility updates.

## Database Design

The SQL files are intentionally split by project evolution:

1. `001_starter_schema.sql` creates the original starter `seats` table and seeds 20 seats.
2. `002_auth_schema.sql` adds `users` with password hashes, roles, verification token fields, refresh token hashes, and reset token fields.
3. `003_booking_schema.sql` adds the production-style booking model.

Main tables:

- `users`: registered users and auth token metadata.
- `cities`, `theatres`, `screens`: location and cinema structure.
- `movies`: seeded movie metadata.
- `shows`: movie showtimes.
- `seats`: starter seats extended with screen, row, number, category, and active flags.
- `seat_categories`: seat category metadata.
- `show_seat_prices`: per-show pricing by seat category.
- `bookings`: booking header tied to a user and show.
- `booking_seats`: seats attached to a booking.
- `seat_locks`: prepared for active seat-lock workflows.

Duplicate booking protection is enforced at the database level with:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS booking_seats_show_seat_unique_idx
  ON booking_seats (show_id, seat_id);
```

The booking service also checks booked seats before inserting, catches unique constraint conflicts, and returns `409 Conflict` when a seat is no longer available.

## Auth Workflow

### Register

`POST /api/v1/auth/register`

- Validates request body with Joi.
- Normalizes email to lowercase.
- Rejects duplicate emails.
- Hashes the password using `bcryptjs`.
- Creates a verification token hash.
- Creates access and refresh tokens.
- Stores only the refresh token hash.
- Returns the safe user object and tokens.

### Login

`POST /api/v1/auth/login`

- Validates email and password.
- Compares password with the stored password hash.
- Creates a new access token and refresh token.
- Stores the latest refresh token hash.
- Returns the safe user object and tokens.

### Authenticated User

`GET /api/v1/auth/me`

- Requires `Authorization: Bearer <accessToken>`.
- Decodes the JWT access token.
- Adds `req.user` with `id`, `email`, and `role`.
- Returns the current safe user object.

### Refresh Token

`POST /api/v1/auth/refreshToken`

- Verifies the refresh token.
- Compares its hash with the stored user refresh token hash.
- Rotates and returns a fresh token pair.

### Account Verification And Password Reset

The auth module also includes:

- `GET /api/v1/auth/verify-account`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

These routes use hashed opaque tokens and expiration timestamps. In development, verification/reset token flows are easier to inspect because the app can expose or log token details.

## Booking Workflow

### Browse Movies

```http
GET /api/v1/movies
GET /api/v1/movies/dhurandhar-the-revenge
```

Movie data is mocked in code for browsing, while the seeded database show is used for the booking flow.

### Check Seat Availability

Seeded show id:

```text
66666666-6666-6666-6666-666666666666
```

```http
GET /api/v1/movies/shows/66666666-6666-6666-6666-666666666666/seats
```

This returns the current seat state for the show, including whether seats are available or booked.

### Create Booking

```http
POST /api/v1/bookings
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "showId": "66666666-6666-6666-6666-666666666666",
  "seatIds": [1, 2]
}
```

The service:

- Requires an authenticated user.
- Deduplicates and sorts requested seat ids.
- Opens a database transaction.
- Verifies the user still exists.
- Verifies the show exists and is scheduled.
- Loads requested seats with pricing.
- Rejects invalid seats, unpriced seats, or already booked seats.
- Inserts a booking header.
- Inserts booking-seat rows.
- Updates the starter `seats.isbooked` and `seats.name` fields for compatibility.
- Commits the transaction.
- Returns the booking reference, totals, show details, and booked seats.

### My Bookings

```http
GET /api/v1/bookings/me
Authorization: Bearer <accessToken>
```

Returns only the bookings created by the logged-in user.

## API Endpoints

| Method | Endpoint | Auth Required | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Health check |
| `POST` | `/api/v1/auth/register` | No | Create a user |
| `GET` | `/api/v1/auth/verify-account` | No | Verify account token |
| `POST` | `/api/v1/auth/login` | No | Login and receive tokens |
| `POST` | `/api/v1/auth/refreshToken` | No | Rotate refresh/access tokens |
| `POST` | `/api/v1/auth/forgot-password` | No | Start reset flow |
| `POST` | `/api/v1/auth/reset-password` | No | Complete reset flow |
| `GET` | `/api/v1/auth/me` | Yes | Current user |
| `GET` | `/api/v1/movies` | No | List mock movies |
| `GET` | `/api/v1/movies/:movieId` | No | Movie details |
| `GET` | `/api/v1/movies/shows/:showId/seats` | No | Show seat availability |
| `GET` | `/api/v1/movies/:movieId/seat-map` | Yes | Protected movie seat map |
| `POST` | `/api/v1/bookings` | Yes | Create a booking |
| `GET` | `/api/v1/bookings/me` | Yes | Logged-in user's bookings |

## Local Setup

### Prerequisites

- Node.js 18 or newer
- npm
- Docker and Docker Compose
- PostgreSQL client tools such as `psql`

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Default local values:

```text
PORT=8080
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sql_class_2_db
CLIENT_ORIGIN=http://localhost:3000
APP_BASE_URL=http://localhost:8080
```

For real deployments, replace the JWT secrets and mail settings.

### Start PostgreSQL

```bash
docker compose up -d
```

The compose file starts a local PostgreSQL container named `book-my-ticket-postgres` and exposes it on host port `5434`.

### Apply Database Schema

Run the SQL files in order:

```bash
psql "postgres://postgres:postgres@localhost:5434/sql_class_2_db" -f sql/001_starter_schema.sql
psql "postgres://postgres:postgres@localhost:5434/sql_class_2_db" -f sql/002_auth_schema.sql
psql "postgres://postgres:postgres@localhost:5434/sql_class_2_db" -f sql/003_booking_schema.sql
```

If you prefer Docker exec:

```bash
docker exec -i book-my-ticket-postgres psql -U postgres -d sql_class_2_db < sql/001_starter_schema.sql
docker exec -i book-my-ticket-postgres psql -U postgres -d sql_class_2_db < sql/002_auth_schema.sql
docker exec -i book-my-ticket-postgres psql -U postgres -d sql_class_2_db < sql/003_booking_schema.sql
```

### Start The API

```bash
npm run dev
```

The API runs on:

```text
http://localhost:8080
```

## Quick API Walkthrough

### Health

```bash
curl http://localhost:8080/health
```

### Register

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

Copy `data.accessToken` from the response.

### Book Seats

```bash
curl -X POST http://localhost:8080/api/v1/bookings \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "showId": "66666666-6666-6666-6666-666666666666",
    "seatIds": [1, 2]
  }'
```

### Check My Bookings

```bash
curl http://localhost:8080/api/v1/bookings/me \
  -H "Authorization: Bearer <accessToken>"
```

## Testing Setup

### Automated API Integration Test

Run:

```bash
cd backend
npm run test:api
```

The script:

- Confirms the database is reachable.
- Confirms required tables exist.
- Confirms seed data exists.
- Resets test bookings and test users.
- Starts the Express app on a random local port unless `API_BASE_URL` is provided.
- Tests health, movie list, movie detail, and seat availability.
- Registers and logs in a test user.
- Captures the access token.
- Checks protected routes without a token return `401`.
- Checks invalid booking payloads return expected errors.
- Creates a valid booking.
- Confirms the booking belongs to the authenticated user.
- Confirms duplicate and overlapping bookings return `409`.
- Runs a concurrency check where two requests compete for the same seat.
- Confirms booked seats appear in availability.
- Confirms database invariants, including no duplicate booked seats.

To run against an already running server:

```bash
API_BASE_URL=http://localhost:8080 npm run test:api
```

### Manual Requestly Or Postman Testing

Import these files:

```text
backend/requestly/book-my-ticket.postman_collection.json
backend/requestly/book-my-ticket.postman_environment.json
```

Detailed manual steps are documented in:

```text
backend/docs/requestly-api-testing.md
```

Recommended Requestly environment variables:

```text
baseUrl = http://localhost:8080
showId = 66666666-6666-6666-6666-666666666666
accessToken =
```

After login, store `data.accessToken` in `accessToken` and use it for protected requests.

### Useful Database Checks

```bash
docker exec book-my-ticket-postgres psql -U postgres -d sql_class_2_db -c "SELECT id, email, role, is_verified FROM users ORDER BY created_at DESC;"
docker exec book-my-ticket-postgres psql -U postgres -d sql_class_2_db -c "SELECT id, user_id, show_id, booking_reference, status, total_amount FROM bookings ORDER BY created_at DESC;"
docker exec book-my-ticket-postgres psql -U postgres -d sql_class_2_db -c "SELECT booking_id, show_id, seat_id, price FROM booking_seats ORDER BY created_at DESC;"
docker exec book-my-ticket-postgres psql -U postgres -d sql_class_2_db -c "SELECT show_id, seat_id, COUNT(*) FROM booking_seats GROUP BY show_id, seat_id HAVING COUNT(*) > 1;"
docker exec book-my-ticket-postgres psql -U postgres -d sql_class_2_db -c "SELECT id, row_label, seat_number, name, isbooked FROM seats ORDER BY id ASC;"
```

The duplicate-seat query should return zero rows.

## Error Handling And Validation

- Validation errors return `400`.
- Missing or invalid bearer tokens return `401`.
- Unknown shows return `404`.
- Duplicate or already booked seats return `409`.
- Unexpected errors return `500` with a generic message.

Responses follow a consistent shape:

```json
{
  "success": false,
  "message": "Error message",
  "details": null
}
```

## Security Notes

- Passwords are never stored directly. They are hashed with `bcryptjs`.
- Refresh tokens are not stored directly. Only their hashes are stored.
- Protected routes use JWT bearer tokens.
- Auth routes use rate limiters.
- Request bodies are validated before controller logic runs.
- Production deployments should use strong JWT secrets, HTTPS, proper mail credentials, and environment-specific CORS origins.

## Assignment Coverage

| Requirement | Status |
| --- | --- |
| Use starter source code as base | Done |
| Do not remove existing endpoints | Done |
| Add register/login | Done |
| Use token-based auth | Done |
| Protect booking endpoints | Done |
| View available seats | Done |
| Book seats as logged-in user | Done |
| Prevent duplicate bookings | Done |
| Associate bookings with users | Done |
| Keep movie data mocked for now | Done |
| Provide setup and flow documentation | Done |
| Frontend integration | Optional starter/legacy files preserved |

## Known Scope Decisions

- The backend is the primary deliverable because the hackathon scoring focuses on backend implementation.
- Movie browsing is mocked in code, while the seeded show and seats are backed by PostgreSQL for booking correctness.
- Payments are not implemented. Booking is confirmed immediately after seat validation.
- Seat locking is modeled in the database but not exposed as a separate hold-seat API yet.
- Email delivery is abstracted for verification/reset flows; local development can use logged or returned tokens instead of real SMTP.

## Scripts

From `backend/`:

```bash
npm run dev       # Start with node --watch
npm start         # Start normally
npm run test:api  # Run API and database integration flow
```
