const navigation = [
  ["dashboard", "Overview", "▦"],
  ["users", "Users", "👤"],
  ["workers", "Workers", "🛠"],
  ["bookings", "Bookings", "▣"],
  ["services", "Services", "⌘"],
  ["settings", "Settings", "⚙"],
];

export default function Layout({
  activePage,
  onNavigate,
  onLogout,
  children,
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">IT<span>X</span></div>
          <div>
            <strong>DIGITAL</strong>
            <small>SERVICES</small>
          </div>
        </div>

        <nav>
          {navigation.map(([key, label, icon]) => (
            <button
              key={key}
              className={activePage === key ? "nav-item active" : "nav-item"}
              onClick={() => onNavigate(key)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={onLogout}>
          Sign out
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">ADMIN CONTROL CENTRE</div>
            <strong>{navigation.find(([key]) => key === activePage)?.[1]}</strong>
          </div>
          <div className="admin-chip">
            <span className="avatar">A</span>
            <div>
              <strong>ITX Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
