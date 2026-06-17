import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const productApi = {
  getAll: () => api.get("/products/"),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products/", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const customerApi = {
  getAll: () => api.get("/customers/"),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers/", data),
  remove: (id) => api.delete(`/customers/${id}`),
};

export const orderApi = {
  getAll: () => api.get("/orders/"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders/", data),
  remove: (id) => api.delete(`/orders/${id}`),
};

export default api;
