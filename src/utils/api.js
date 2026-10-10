const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");
const API_VERSION = "v1";

export const API = `${API_BASE}/api/${API_VERSION}`;
