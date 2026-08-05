import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import {
  PageHeader,
  MetricCard,
  StatusBadge,
  LoadingState,
  ErrorState,
} from "../components/UI.jsx";

const money = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/admin/dashboard")
      .then((response) => setData(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const o = data.overview;
  const maxBookings = Math.max(
    1,
    ...data.monthlyBookings.map((item) => item.bookings)
  );

  return (
    <>
      <PageHeader
        title="Dashboard overview"
        description="A quick view of platform activity and Admin tasks."
      />

      <section className="metrics-grid">
        <MetricCard label="Total users" value={o.total_users} note="Customer and worker accounts" />
        <MetricCard label="Registered workers" value={o.total_workers} note={`${o.pending_workers} require review`} />
        <MetricCard label="Total bookings" value={o.total_bookings} note={`${o.completed_bookings} completed`} />
        <MetricCard
          label="Platform revenue"
          value={money.format(Number(o.platform_revenue))}
          note="Calculated from completed bookings"
          accent
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Booking activity</h2>
              <p>Bookings created during the last six months</p>
            </div>
          </div>
          <div className="bar-chart">
            {data.monthlyBookings.map((item) => (
              <div className="bar-item" key={item.label}>
                <span className="bar-value">{item.bookings}</span>
                <div
                  className="bar"
                  style={{ height: `${Math.max(8, (item.bookings / maxBookings) * 150)}px` }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel summary-panel">
          <div className="panel-heading">
            <div>
              <h2>System summary</h2>
              <p>Current booking outcomes</p>
            </div>
          </div>
          <div className="summary-row">
            <span>Completed bookings</span>
            <strong>{o.completed_bookings}</strong>
          </div>
          <div className="summary-row">
            <span>Cancelled bookings</span>
            <strong>{o.cancelled_bookings}</strong>
          </div>
          <div className="summary-row">
            <span>Completed booking value</span>
            <strong>{money.format(Number(o.completed_value))}</strong>
          </div>
          <div className="summary-row warning-row">
            <span>Pending worker approvals</span>
            <strong>{o.pending_workers}</strong>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recent bookings</h2>
            <p>Latest activity across the platform</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Worker</th><th>Service</th><th>City</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.worker_name}</td>
                  <td>{booking.service_name}</td>
                  <td>{booking.city}</td>
                  <td>{money.format(Number(booking.total_amount))}</td>
                  <td><StatusBadge value={booking.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
