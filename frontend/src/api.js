const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function getToken() {
  return localStorage.getItem("itx_admin_token");
}

export function saveSession(data) {
  localStorage.setItem("itx_admin_token", data.token);
  localStorage.setItem("itx_admin_user", JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem("itx_admin_token");
  localStorage.removeItem("itx_admin_user");
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new Error(data.message || "Request failed");
  }

  return data;
}
