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

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkers = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    try {
      const response = await apiRequest(`/admin/workers?${params}`);
      setWorkers(response.data);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadWorkers(); }, [loadWorkers]);

  async function approve(worker) {
    if (!window.confirm(`Approve ${worker.full_name}?`)) return;
    try {
      await apiRequest(`/admin/workers/${worker.id}/approve`, { method: "PATCH" });
      loadWorkers();
    } catch (requestError) { setError(requestError.message); }
  }

  async function reject(worker) {
    const reason = window.prompt(`Reason for rejecting ${worker.full_name}:`);
    if (!reason) return;
    try {
      await apiRequest(`/admin/workers/${worker.id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
      loadWorkers();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <>
      <PageHeader title="Worker management" description="Review worker applications and verification status." />
      <section className="filter-bar">
        <input placeholder="Search worker or service" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </section>

      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : workers.length === 0 ? <EmptyState /> : (
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Worker</th><th>Service</th><th>Location</th><th>Performance</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker.id}>
                    <td><strong>{worker.full_name}</strong><small className="table-sub">{worker.phone}</small></td>
                    <td>{worker.service_name}</td>
                    <td>{worker.city || "—"}</td>
                    <td>{Number(worker.rating).toFixed(1)} ★ · {worker.completed_jobs} jobs</td>
                    <td><StatusBadge value={worker.verification_status} /></td>
                    <td className="action-group">
                      <button className="success-button" onClick={() => approve(worker)}>Approve</button>
                      <button className="danger-button" onClick={() => reject(worker)}>Reject</button>
                    </td>
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
