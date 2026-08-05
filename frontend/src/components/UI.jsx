export function PageHeader({ title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ value }) {
  const normalized = String(value || "unknown").toLowerCase();
  return (
    <span className={`badge badge-${normalized.replaceAll("_", "-")}`}>
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

export function LoadingState() {
  return <div className="state-card">Loading data...</div>;
}

export function EmptyState({ message = "No records found." }) {
  return <div className="state-card">{message}</div>;
}

export function ErrorState({ message }) {
  return <div className="alert error">{message}</div>;
}

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="secondary-button"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        className="secondary-button"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export function MetricCard({ label, value, note, accent = false }) {
  return (
    <article className={accent ? "metric-card accent" : "metric-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
