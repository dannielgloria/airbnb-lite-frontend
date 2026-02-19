import { apiFetch } from "./client";
import type { Booking } from "./types";

export function createBookingApi(token: string, payload: { listingId: string; startDate: string; endDate: string }) {
  return apiFetch<Booking>("/api/v1/bookings", { method: "POST", body: payload, token });
}

export function myBookingsApi(token: string) {
  return apiFetch<Booking[]>("/api/v1/bookings/me", { token });
}

export function cancelBookingApi(token: string, bookingId: string) {
  return apiFetch<Booking>(`/api/v1/bookings/${bookingId}/cancel`, { method: "PATCH", token });
}

export function hostBookingsApi(token: string) {
  return apiFetch<Booking[]>("/api/v1/bookings/host/all", { token });
}
