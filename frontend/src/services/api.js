const API_BASE_URL = import.meta.env.VITE_API_URL || "https://feedback-collection-system-d5te.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (token) headers.Authorization = "Bearer " + token;

  const response = await fetch(API_BASE_URL + path, { ...options, headers });
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
