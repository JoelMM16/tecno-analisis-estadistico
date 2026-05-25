const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: isForm ? options.headers : { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get("content-type")?.includes("application/json") ? res.json() : res.blob();
}

export const api = {
  url: API_URL,
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body || {}) }),
  delete: (path) => request(path, { method: "DELETE" }),
  list: (resource) => request(`/${resource}`),
  create: (resource, body) => request(`/${resource}`, { method: "POST", body: JSON.stringify(body || {}) }),
  update: (resource, id, body) => request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body || {}) }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" })
};
