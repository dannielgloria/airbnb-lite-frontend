import { useEffect, useMemo, useState } from "react";
import { getListingsApi } from "../api/listings";
import type { Listing } from "../api/types";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import toast from "react-hot-toast";

export function HomePage() {
  const [items, setItems] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);

  // filtros mapeados al backend: search, minPrice, maxPrice, guests :contentReference[oaicite:13]{index=13}
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [guests, setGuests] = useState<string>("");

  const query = useMemo(() => ({
    search,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    guests: guests ? Number(guests) : undefined,
  }), [search, minPrice, maxPrice, guests]);

  async function load() {
    setLoading(true);
    try {
      const data = await getListingsApi(query);
      setItems(data);
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-neutral-200 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <Input label="Buscar" placeholder="Loft, cerca del centro..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
            <Input label="Min" inputMode="numeric" placeholder="500" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <Input label="Max" inputMode="numeric" placeholder="2500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <Input label="Guests" inputMode="numeric" placeholder="2" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={load}>Aplicar</Button>
            <Button variant="ghost" onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setGuests(""); }}>
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="p-3">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(items || []).map((l) => {
            const cover = l.photos?.[0]?.url;
            return (
              <Link key={l._id} to={`/listing/${l._id}`} className="group">
                <Card className="p-3 hover:shadow-md transition">
                  <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3]">
                    {cover ? (
                      <img src={cover} alt={l.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-400 text-sm">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="font-semibold line-clamp-1">{l.title}</div>
                    <div className="text-sm text-neutral-600 line-clamp-1">{l.description}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-neutral-700">
                        <span className="font-bold">${l.pricePerNight}</span> / noche
                      </div>
                      <div className="text-xs text-neutral-500">
                        {l.maxGuests} huéspedes · {l.bedrooms} recs
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
