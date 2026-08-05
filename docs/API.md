# Admin API Specification

Base URL:

```text
http://localhost:3000/api/v1
```

## Authentication

### POST `/auth/login`

```json
{
  "email": "admin@itx.local",
  "password": "Admin@123"
}
```

Protected routes require:

```text
Authorization: Bearer <token>
```

## Dashboard

- `GET /admin/dashboard`

## User Management

- `GET /admin/users`
- `GET /admin/users?search=nimal&role=customer&status=active&page=1`
- `PATCH /admin/users/:id/status`

```json
{
  "status": "suspended"
}
```

## Worker Management

- `GET /admin/workers`
- `GET /admin/workers?status=pending`
- `PATCH /admin/workers/:id/approve`
- `PATCH /admin/workers/:id/reject`

```json
{
  "reason": "NIC image is unclear"
}
```

## Booking Monitoring

- `GET /admin/bookings`
- `GET /admin/bookings?status=completed&city=Colombo`
- `GET /admin/bookings?dateFrom=2026-04-01&dateTo=2026-04-30`

## Service Controls

- `GET /admin/services`
- `PATCH /admin/services/:id/toggle`

## Commission Setting

- `GET /admin/settings/commission`
- `PUT /admin/settings/commission`

```json
{
  "commissionRate": 12.5
}
```
