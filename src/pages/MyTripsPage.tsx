import { useEffect, useState } from "react";
import { myBookingsApi, cancelBookingApi } from "../api/bookings";
import type { Booking } from "../api/types";
import { useAuth } from "../state/auth/useAuth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";

export function MyTripsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await myBookingsApi(token);
      setItems(data);
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  async function cancel(id: string) {
    if (!token) return;
    try {
      await cancelBookingApi(token, id);
      toast.success("Reserva cancelada");
      load();
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Mis viajes</h1>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {(items || []).map((b) => {
            const listing = typeof b.listingId === "string" ? null : b.listingId;
            return (
              <Card key={b._id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{listing?.title || "Listing"}</div>
                  <div className="text-sm text-neutral-600">
                    {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                    {" · "}
                    {b.nights} noches · ${b.totalPrice}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Status: {b.status}</div>
                </div>

                {b.status === "CONFIRMED" ? (
                  <Button variant="danger" onClick={() => cancel(b._id)}>
                    Cancelar
                  </Button>
                ) : (
                  <Button variant="ghost" disabled>
                    Cancelada
                  </Button>
                )}
              </Card>
            );
          })}
          {items?.length === 0 ? <div className="text-neutral-700">Aún no tienes reservas.</div> : null}
        </div>
      )}
    </div>
  );
}
