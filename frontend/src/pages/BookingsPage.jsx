import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import {
  PageHeader,
  StatusBadge,
  LoadingState,
  EmptyState,
  ErrorState,
  Pagination,
} from "../components/UI.jsx";

const money = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 });

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", city: "", dateFrom: "", dateTo: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    try {
      const response = await apiRequest(`/admin/bookings?${params}`);
      setBookings(response.data);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  return (
    <>
      <PageHeader title="Booking monitoring" description="View and filter all service bookings across the platform." />
      <section className="filter-bar booking-filters">
        <input placeholder="Search ID, customer or service" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option><option value="accepted">Accepted</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
        <input placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value, page: 1 })} />
        <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value, page: 1 })} />
        <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value, page: 1 })} />
      </section>

      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : bookings.length === 0 ? <EmptyState /> : (
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Customer</th><th>Worker</th><th>Service</th><th>City</th><th>Scheduled</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>#{booking.id}</strong></td><td>{booking.customer_name}</td><td>{booking.worker_name}</td><td>{booking.service_name}</td><td>{booking.city}</td>
                    <td>{booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString() : "Not scheduled"}</td>
                    <td>{money.format(Number(booking.total_amount))}</td><td><StatusBadge value={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={(page) => setFilters({ ...filters, page })} />
        </section>
      )}
    </>
  );
}
