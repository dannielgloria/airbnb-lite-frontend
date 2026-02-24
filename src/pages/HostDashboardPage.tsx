import { useEffect, useState } from "react";
import { hostBookingsApi } from "../api/bookings";
import type { Booking } from "../api/types";
import { useAuth } from "../state/auth/useAuth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import { Link } from "react-router-dom";

export function HostDashboardPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await hostBookingsApi(token);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Host dashboard</h1>
        <Link to="/host/new">
          <Button>Crear listing</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {(items || []).map((b) => {
            const listing = typeof b.listingId === "string" ? null : b.listingId;
            const guest = typeof b.guestId === "string" ? null : b.guestId;

            return (
              <Card key={b._id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold">{listing?.title || "Listing"}</div>
                    <div className="text-sm text-neutral-600">
                      Huésped: <span className="font-semibold">{guest?.name || "—"}</span> · {guest?.email || ""}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                      {" · "}
                      {b.nights} noches · ${b.totalPrice}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">Status: {b.status}</div>
                </div>
              </Card>
            );
          })}
          {items?.length === 0 ? <div className="text-neutral-700">Aún no tienes reservas como host.</div> : null}
        </div>
      )}
    </div>
  );
}
