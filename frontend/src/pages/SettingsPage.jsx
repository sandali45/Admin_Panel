import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { PageHeader, LoadingState, ErrorState } from "../components/UI.jsx";

export default function SettingsPage() {
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/admin/settings/commission")
      .then((response) => setRate(response.data.commissionRate))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      await apiRequest("/admin/settings/commission", {
        method: "PUT",
        body: JSON.stringify({ commissionRate: Number(rate) }),
      });
      setMessage("Commission rate saved successfully.");
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Platform settings" description="Manage configurable values used by the platform." />
      {error && <ErrorState message={error} />}
      {message && <div className="alert success">{message}</div>}
      <section className="settings-layout">
        <form className="panel setting-form" onSubmit={save}>
          <div className="eyebrow">REVENUE CONFIGURATION</div>
          <h2>Commission rate</h2>
          <p>Percentage deducted by the platform from a completed service amount.</p>
          <label>
            Commission percentage
            <div className="percentage-input">
              <input type="number" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} required />
              <span>%</span>
            </div>
          </label>
          <button className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save setting"}</button>
        </form>

        <article className="panel info-panel">
          <h2>Example</h2>
          <div className="calculation-box">
            <div><span>Booking value</span><strong>Rs. 5,000</strong></div>
            <div><span>Commission ({Number(rate || 0)}%)</span><strong>Rs. {(5000 * Number(rate || 0) / 100).toFixed(2)}</strong></div>
            <div className="calculation-total"><span>Worker amount</span><strong>Rs. {(5000 - 5000 * Number(rate || 0) / 100).toFixed(2)}</strong></div>
          </div>
          <p className="muted">This page manages the rate only. The full Revenue module can use this value when a booking is completed.</p>
        </article>
      </section>
    </>
  );
}
