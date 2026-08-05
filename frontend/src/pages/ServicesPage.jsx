import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { PageHeader, StatusBadge, LoadingState, ErrorState } from "../components/UI.jsx";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadServices() {
    setLoading(true);
    try {
      const response = await apiRequest("/admin/services");
      setServices(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadServices(); }, []);

  async function toggle(service) {
    try {
      await apiRequest(`/admin/services/${service.id}/toggle`, { method: "PATCH" });
      loadServices();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <>
      <PageHeader title="Service controls" description="Enable or disable service categories shown on the platform." />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : (
        <section className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div>
                <span className="service-order">#{service.display_order}</span>
                <h2>{service.name}</h2>
                <p>{service.category}</p>
              </div>
              <div className="service-footer">
                <StatusBadge value={service.is_enabled ? "active" : "disabled"} />
                <button className={service.is_enabled ? "danger-button" : "success-button"} onClick={() => toggle(service)}>
                  {service.is_enabled ? "Disable" : "Enable"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
