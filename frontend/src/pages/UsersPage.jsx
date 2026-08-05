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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ search: "", role: "", status: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));

    try {
      const response = await apiRequest(`/admin/users?${params}`);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function changeStatus(user) {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    if (!window.confirm(`Change ${user.full_name}'s status to ${nextStatus}?`)) return;

    try {
      await apiRequest(`/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <PageHeader title="User management" description="Search, review and manage customer and worker accounts." />

      <section className="filter-bar">
        <input
          placeholder="Search name, phone or email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="worker">Worker</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </section>

      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : users.length === 0 ? <EmptyState /> : (
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Contact</th><th>Role</th><th>City</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.full_name}</strong><small className="table-sub">ID #{user.id}</small></td>
                    <td>{user.phone}<small className="table-sub">{user.email || "No email"}</small></td>
                    <td className="capitalize">{user.role}</td>
                    <td>{user.city || "—"}</td>
                    <td><StatusBadge value={user.status} /></td>
                    <td>
                      <button className={user.status === "active" ? "danger-button" : "secondary-button"} onClick={() => changeStatus(user)}>
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </button>
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
