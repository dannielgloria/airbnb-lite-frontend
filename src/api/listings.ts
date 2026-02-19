import { apiFetch } from "./client";
import type { Listing } from "./types";

export function getListingsApi(query?: { search?: string; minPrice?: number; maxPrice?: number; guests?: number }) {
  return apiFetch<Listing[]>("/api/v1/listings", { query });
}

export function getListingByIdApi(id: string) {
  return apiFetch<Listing>(`/api/v1/listings/${id}`);
}

export function createListingApi(token: string, payload: {
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  amenities?: string[];
}) {
  return apiFetch<Listing>("/api/v1/listings", { method: "POST", body: payload, token });
}

export function updateListingApi(token: string, id: string, payload: Partial<{
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  amenities: string[];
  isActive: boolean;
}>) {
  return apiFetch<Listing>(`/api/v1/listings/${id}`, { method: "PUT", body: payload, token });
}

export function deleteListingApi(token: string, id: string) {
  return apiFetch<void>(`/api/v1/listings/${id}`, { method: "DELETE", token });
}

// Upload fotos: field name = 'photos', max 5, multipart; endpoint POST /:id/photos :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
export function uploadListingPhotosApi(token: string, id: string, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("photos", f));
  return apiFetch<Listing>(`/api/v1/listings/${id}/photos`, { method: "POST", body: fd, token, isFormData: true });
}
