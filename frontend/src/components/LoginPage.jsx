import { useState } from "react";
import { apiRequest, saveSession } from "../api.js";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@itx.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession(response.data);
      onLogin();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-brand">
        <div className="brand-mark large">IT<span>X</span></div>
        <p>Digital Services</p>
        <h1>Admin Management Portal</h1>
        <p className="muted-light">
          Manage users, workers, bookings, services and platform settings.
        </p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="eyebrow">SECURE ADMIN ACCESS</div>
          <h2>Welcome back</h2>
          <p className="muted">Enter your Admin account details.</p>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <div className="alert error">{error}</div>}

          <button className="primary-button full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="demo-note">
            Demo: admin@itx.local / Admin@123
          </div>
        </form>
      </section>
    </main>
  );
}
