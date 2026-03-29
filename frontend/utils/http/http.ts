import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "@/core/constants";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export function formatDate(isoDate: string | Date): string {
  const date = new Date(isoDate);
  
  const day = date.getUTCDate(); // UTC day to avoid timezone shift
  const year = date.getUTCFullYear(); // UTC year

  // Array of months to ensure consistent English month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getUTCMonth()]; // UTC month

  return `${day} ${month}, ${year}`;
}

function baseUrl(): string {
  const base = API_URL ?? "";
  return base.endsWith("/") ? base : `${base}/`;
}

function buildUrl(path: string): string {
  return `${baseUrl()}${path.startsWith("/") ? path.slice(1) : path}`;
}

export async function apiGet<T = any>(
  path: string,
  config?: AxiosRequestConfig
) {
  const url = `${baseUrl()}${path.startsWith("/") ? path.slice(1) : path}`;
  return axios.get<T>(url, {
    ...config,
    headers: { ...getAuthHeaders(), ...(config?.headers ?? {}) },
  });
}

export async function apiPost<T = any>(
  path: string,
  body?: any,
  config?: AxiosRequestConfig
) {
  const url = `${baseUrl()}${path.startsWith("/") ? path.slice(1) : path}`;
  return axios.post<T>(url, body, {
    ...config,
    headers: { ...getAuthHeaders(), ...(config?.headers ?? {}) },
  });
}

// export async function apiPut<T = any>(
//   path: string,
//   body?: any,
//   config?: AxiosRequestConfig
// ) {
//   const url = `${baseUrl()}${path.startsWith("/") ? path.slice(1) : path}`;
//   return axios.put<T>(url, body, {
//     ...config,
//     headers: { ...getAuthHeaders(), ...(config?.headers ?? {}) },
//   });
// }

export async function apiPut<T = any>(
  path: string,
  body?: any,
  config?: AxiosRequestConfig
) {
  const url = `${baseUrl()}${path.startsWith("/") ? path.slice(1) : path}`;

  // Detect if body is FormData
  const isFormData = body instanceof FormData;

  return axios.put<T>(url, body, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(config?.headers ?? {}),
    },
  });
}

// PATCH ✅
export async function apiPatch<T = any>(
  path: string,
  body?: any,
  config?: AxiosRequestConfig
) {
  return axios.patch<T>(buildUrl(path), body, {
    ...config,
    headers: { ...getAuthHeaders(), ...(config?.headers ?? {}) },
  });
}

// DELETE ✅
export async function apiDelete<T = any>(
  path: string,
  config?: AxiosRequestConfig
) {
  return axios.delete<T>(buildUrl(path), {
    ...config,
    headers: { ...getAuthHeaders(), ...(config?.headers ?? {}) },
  });
}
