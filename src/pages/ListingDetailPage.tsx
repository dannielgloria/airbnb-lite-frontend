import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingByIdApi, uploadListingPhotosApi } from "../api/listings";
import { createBookingApi } from "../api/bookings";
import type { Listing } from "../api/types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../state/auth/useAuth";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import { differenceInCalendarDays, parseISO } from "date-fns";

export function ListingDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isHost = useMemo(() => {
    if (!item || !user) return false;
    // backend listing.hostId es string
    return String(item.hostId) === String(user._id);
  }, [item, user]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getListingByIdApi(id);
      setItem(data);
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    try {
      return differenceInCalendarDays(parseISO(endDate), parseISO(startDate));
    } catch {
      return 0;
    }
  }, [startDate, endDate]);

  async function book() {
    if (!token) return toast.error("Debes iniciar sesión");
    if (!item) return;
    try {
      const data = await createBookingApi(token, { listingId: item._id, startDate, endDate });
      toast.success(`Reserva confirmada: ${data.nights} noches`);
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
    }
  }

  async function uploadPhotos() {
    if (!token) return toast.error("Debes iniciar sesión");
    if (!item) return;
    const files = Array.from(fileRef.current?.files || []);
    if (!files.length) return toast.error("Selecciona fotos");
    if (files.length > 5) return toast.error("Máximo 5 fotos");

    setUploading(true);
    try {
      const updated = await uploadListingPhotosApi(token, item._id, files);
      setItem(updated);
      toast.success("Fotos subidas");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-[360px] w-full rounded-3xl" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!item) return <div className="text-neutral-700">No encontrado.</div>;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{item.title}</h1>
          <p className="mt-1 text-neutral-600">{item.description}</p>
          <div className="mt-2 text-sm text-neutral-600">
            {item.maxGuests} huéspedes · {item.bedrooms} recámaras
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(item.photos?.length ? item.photos : [{ url: "", publicId: "x" }]).map((p, idx) => (
            <div key={p.publicId + idx} className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
              {p.url ? <img src={p.url} alt={`photo-${idx}`} className="h-full w-full object-cover" /> : null}
            </div>
          ))}
        </div>

        {isHost ? (
          <Card className="p-4">
            <div className="font-semibold">Admin del listing (host)</div>
            <p className="text-sm text-neutral-600 mt-1">
              Sube hasta 5 fotos. El backend exige field name <b>photos</b> y tipos jpeg/png/webp. :contentReference[oaicite:14]{index=14}
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="block w-full text-sm" />
              <Button loading={uploading} onClick={uploadPhotos}>Subir fotos</Button>
            </div>
          </Card>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-24 h-fit">
        <Card className="p-5">
          <div className="flex items-end justify-between">
            <div className="text-xl font-extrabold">${item.pricePerNight}</div>
            <div className="text-sm text-neutral-600">por noche</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Input label="Check-in" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="Check-out" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="mt-4 rounded-2xl bg-neutral-50 border border-neutral-200 p-3 text-sm">
            <div className="flex justify-between">
              <span>Noches</span>
              <span className="font-semibold">{Math.max(0, nights)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total estimado</span>
              <span className="font-extrabold">${Math.max(0, nights) * item.pricePerNight}</span>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={book}>
            Reservar
          </Button>

          {!token ? (
            <p className="mt-3 text-xs text-neutral-600">
              Inicia sesión para reservar.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
