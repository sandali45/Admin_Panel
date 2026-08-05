import { useState } from "react";
import { getToken, clearSession } from "./api.js";
import LoginPage from "./components/LoginPage.jsx";
import Layout from "./components/Layout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import WorkersPage from "./pages/WorkersPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const pages = {
  dashboard: DashboardPage,
  users: UsersPage,
  workers: WorkersPage,
  bookings: BookingsPage,
  services: ServicesPage,
  settings: SettingsPage,
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [activePage, setActivePage] = useState("dashboard");

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  const ActiveComponent = pages[activePage] || DashboardPage;

  function logout() {
    clearSession();
    setAuthenticated(false);
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={logout}
    >
      <ActiveComponent />
    </Layout>
  );
}
