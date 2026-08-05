# ITX Admin Management Project

A complete Admin web application starter for the Developer 4 responsibilities.
It includes a React dashboard, Node.js/Express REST API, and PostgreSQL database.

## Included Admin Functions

- Secure demo Admin login
- Dashboard overview and recent activity
- User listing, searching, filtering, suspension and activation
- Worker application listing, approval and rejection
- Booking monitoring with status, city and date filters
- Service enable/disable controls
- Commission setting management
- Responsive ITX red, black and white user interface
- Consistent REST API responses and error handling

## Technology Stack

- Frontend: React, JavaScript, JSX, CSS and Vite
- Backend: Node.js, Express and JavaScript
- Database: PostgreSQL and SQL
- Authentication: JWT-based demo Admin authentication

> The demo authentication is included only so the project can run independently.
> When integrating with the team project, replace it with Developer 1's real
> OTP/JWT authentication middleware.

## Project Structure

```text
ITX_Admin_Project/
├── backend/
├── frontend/
├── database/
├── docs/
├── docker-compose.yml
└── README.md
```

## Required Software

- Node.js 20.19 or newer
- npm
- PostgreSQL 14 or newer, or Docker Desktop

## Quick Start

### 1. Start PostgreSQL with Docker

From the project root:

```bash
docker compose up -d
```

This creates a PostgreSQL database on port `5432`.

### 2. Create the database structure and sample data

Using PowerShell:

```powershell
Get-Content database/schema.sql | docker exec -i itx-admin-postgres psql -U postgres -d itx_admin
Get-Content database/seed.sql | docker exec -i itx-admin-postgres psql -U postgres -d itx_admin
```

Or run `schema.sql` and `seed.sql` using pgAdmin Query Tool.

### 3. Run the backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend URL:

```text
http://localhost:3000
```

### 4. Run the frontend

Open a second terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Demo Login

```text
Email: admin@itx.local
Password: Admin@123
```

Change these values in `backend/.env` before sharing or deploying the project.

## Integration Notes

Before adding this module to the team's backend:

1. Compare the SQL column names with the real shared database schema.
2. Replace the demo login middleware with Developer 1's authentication.
3. Confirm booking statuses with Developer 3.
4. Confirm worker table and verification statuses with Developer 2.
5. Keep only the Admin routes and UI pages required by the final team scope.

## API Documentation

See `docs/API.md`.
