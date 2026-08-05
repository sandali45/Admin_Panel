# Team Integration Checklist

## Developer 1 — Authentication

- Replace the demo `/auth/login` route.
- Replace `require-admin.js` with the shared JWT middleware.
- Confirm the exact role value: `admin`, `ADMIN`, or another value.

## Developer 2 — Workers and Services

- Confirm `workers` and `services` table column names.
- Confirm worker verification states.
- Confirm whether service enable/disable belongs to this Admin module or the worker/service module.

## Developer 3 — Bookings

- Confirm booking status names.
- Confirm booking price column.
- Confirm city and scheduled date fields.
- Keep this module read-only for booking monitoring unless the team adds dispute actions.

## Developer 4 — Admin

- Keep Admin routes under `/api/v1/admin`.
- Test Admin and non-Admin access.
- Test empty lists, invalid IDs and database failures.
- Keep API response formats consistent with the rest of the project.
