import pool from "../config/db.js";

function addFilter(filters, values, condition, value) {
  if (value === undefined || value === null || value === "") return;
  values.push(value);
  filters.push(condition.replace("?", `$${values.length}`));
}

export async function fetchDashboard() {
  const [overviewResult, recentBookingsResult, monthlyResult] = await Promise.all([
    pool.query(`
      WITH commission AS (
        SELECT COALESCE((value->>'rate')::numeric, 0) AS rate
        FROM system_settings
        WHERE key = 'commission'
      )
      SELECT
        (SELECT COUNT(*)::int FROM users WHERE role <> 'admin') AS total_users,
        (SELECT COUNT(*)::int FROM workers) AS total_workers,
        (SELECT COUNT(*)::int FROM workers WHERE verification_status = 'pending') AS pending_workers,
        (SELECT COUNT(*)::int FROM bookings) AS total_bookings,
        (SELECT COUNT(*)::int FROM bookings WHERE status = 'completed') AS completed_bookings,
        (SELECT COUNT(*)::int FROM bookings WHERE status = 'cancelled') AS cancelled_bookings,
        COALESCE((SELECT SUM(total_amount) FROM bookings WHERE status = 'completed'), 0) AS completed_value,
        ROUND(
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE status = 'completed'), 0)
          * COALESCE((SELECT rate FROM commission), 0) / 100,
          2
        ) AS platform_revenue
    `),
    pool.query(`
      SELECT
        b.id,
        c.full_name AS customer_name,
        COALESCE(wu.full_name, 'Not assigned') AS worker_name,
        s.name AS service_name,
        b.status,
        b.total_amount,
        b.city,
        b.created_at
      FROM bookings b
      JOIN users c ON c.id = b.customer_id
      LEFT JOIN workers w ON w.id = b.worker_id
      LEFT JOIN users wu ON wu.id = w.user_id
      JOIN services s ON s.id = b.service_id
      ORDER BY b.created_at DESC
      LIMIT 5
    `),
    pool.query(`
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', NOW()) - INTERVAL '5 months',
          date_trunc('month', NOW()),
          INTERVAL '1 month'
        ) AS month
      )
      SELECT
        TO_CHAR(months.month, 'Mon') AS label,
        COUNT(b.id)::int AS bookings
      FROM months
      LEFT JOIN bookings b
        ON date_trunc('month', b.created_at) = months.month
      GROUP BY months.month
      ORDER BY months.month
    `),
  ]);

  return {
    overview: overviewResult.rows[0],
    recentBookings: recentBookingsResult.rows,
    monthlyBookings: monthlyResult.rows,
  };
}

export async function findUsers({ search, role, status, limit, offset }) {
  const filters = ["u.role <> 'admin'"];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    const p = `$${values.length}`;
    filters.push(`(u.full_name ILIKE ${p} OR u.phone ILIKE ${p} OR COALESCE(u.email, '') ILIKE ${p})`);
  }

  addFilter(filters, values, "u.role = ?", role);
  addFilter(filters, values, "u.status = ?", status);

  const where = `WHERE ${filters.join(" AND ")}`;
  const countValues = [...values];

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, full_name, phone, email, role, status, city, created_at
       FROM users u
       ${where}
       ORDER BY created_at DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      values
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM users u ${where}`, countValues),
  ]);

  return { rows: rowsResult.rows, total: countResult.rows[0].total };
}

export async function changeUserStatus(userId, status) {
  const result = await pool.query(
    `UPDATE users
     SET status = $2, updated_at = NOW()
     WHERE id = $1 AND role <> 'admin'
     RETURNING id, full_name, phone, email, role, status, city, updated_at`,
    [userId, status]
  );
  return result.rows[0] || null;
}

export async function findWorkers({ search, status, limit, offset }) {
  const filters = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    const p = `$${values.length}`;
    filters.push(`(u.full_name ILIKE ${p} OR u.phone ILIKE ${p} OR w.service_name ILIKE ${p})`);
  }

  addFilter(filters, values, "w.verification_status = ?", status);
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const countValues = [...values];

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
         w.id, w.user_id, u.full_name, u.phone, u.email, u.city,
         w.service_name, w.verification_status, w.online_status,
         w.rating, w.completed_jobs, w.rejection_reason, w.created_at
       FROM workers w
       JOIN users u ON u.id = w.user_id
       ${where}
       ORDER BY w.created_at DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      values
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total
       FROM workers w JOIN users u ON u.id = w.user_id ${where}`,
      countValues
    ),
  ]);

  return { rows: rowsResult.rows, total: countResult.rows[0].total };
}

export async function changeWorkerVerification({ workerId, status, reason }) {
  const result = await pool.query(
    `UPDATE workers
     SET verification_status = $2,
         rejection_reason = $3,
         verified_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, user_id, service_name, verification_status,
               rejection_reason, verified_at`,
    [workerId, status, reason]
  );
  return result.rows[0] || null;
}

export async function findBookings({
  search,
  status,
  city,
  dateFrom,
  dateTo,
  limit,
  offset,
}) {
  const filters = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    const p = `$${values.length}`;
    filters.push(`(CAST(b.id AS TEXT) ILIKE ${p} OR c.full_name ILIKE ${p} OR s.name ILIKE ${p})`);
  }

  addFilter(filters, values, "b.status = ?", status);
  addFilter(filters, values, "b.city = ?", city);
  addFilter(filters, values, "b.created_at >= ?::date", dateFrom);
  addFilter(filters, values, "b.created_at < (?::date + INTERVAL '1 day')", dateTo);

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const countValues = [...values];

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const baseFrom = `
    FROM bookings b
    JOIN users c ON c.id = b.customer_id
    LEFT JOIN workers w ON w.id = b.worker_id
    LEFT JOIN users wu ON wu.id = w.user_id
    JOIN services s ON s.id = b.service_id
  `;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
         b.id, c.full_name AS customer_name,
         COALESCE(wu.full_name, 'Not assigned') AS worker_name,
         s.name AS service_name, b.status, b.total_amount,
         b.city, b.scheduled_at, b.created_at
       ${baseFrom}
       ${where}
       ORDER BY b.created_at DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      values
    ),
    pool.query(`SELECT COUNT(*)::int AS total ${baseFrom} ${where}`, countValues),
  ]);

  return { rows: rowsResult.rows, total: countResult.rows[0].total };
}

export async function findServices() {
  const result = await pool.query(
    `SELECT id, name, category, is_enabled, display_order, created_at
     FROM services ORDER BY display_order, name`
  );
  return result.rows;
}

export async function toggleService(serviceId) {
  const result = await pool.query(
    `UPDATE services
     SET is_enabled = NOT is_enabled, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, category, is_enabled, display_order, updated_at`,
    [serviceId]
  );
  return result.rows[0] || null;
}

export async function readCommission() {
  const result = await pool.query(
    `SELECT COALESCE((value->>'rate')::numeric, 0) AS rate
     FROM system_settings WHERE key = 'commission'`
  );
  return Number(result.rows[0]?.rate || 0);
}

export async function saveCommission(rate) {
  const result = await pool.query(
    `INSERT INTO system_settings (key, value, updated_at)
     VALUES ('commission', jsonb_build_object('rate', $1::numeric), NOW())
     ON CONFLICT (key)
     DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING key, value, updated_at`,
    [rate]
  );
  return result.rows[0];
}
