import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { createListingApi, uploadListingPhotosApi } from "../api/listings";
import { useAuth } from "../state/auth/useAuth";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import { Banner } from "../components/ui/Banner";

const schema = z.object({
  title: z.string().min(3, "Título requerido"),
  description: z.string().min(10, "Descripción requerida"),
  pricePerNight: z.coerce.number().positive("Debe ser > 0"),
  maxGuests: z.coerce.number().int().min(1, "Mínimo 1"),
  bedrooms: z.coerce.number().int().min(1, "Mínimo 1"),
  amenities: z.string().optional(), // CSV
});

type Form = z.infer<typeof schema>;

export function CreateListingPage() {
  const { token } = useAuth();
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (values: Form) => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const amenities = values.amenities
        ? values.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const listing = await createListingApi(token, {
        title: values.title,
        description: values.description,
        pricePerNight: values.pricePerNight,
        maxGuests: values.maxGuests,
        bedrooms: values.bedrooms,
        amenities,
      });

      setCreatedId(listing._id);
      toast.success("Listing creado. Ahora sube fotos.");
      reset();
    } catch (e) {
      const err = e as ApiError;
      toast.error(
        mapApiStatusToUserMessage(err.status, err.message)
      );
    }
  };

  async function uploadPhotos() {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }

    if (!createdId) {
      toast.error("Primero crea un listing");
      return;
    }

    const files = Array.from(fileRef.current?.files || []);

    if (!files.length) {
      toast.error("Selecciona fotos");
      return;
    }

    if (files.length > 5) {
      toast.error("Máximo 5 fotos");
      return;
    }

    setUploading(true);

    try {
      await uploadListingPhotosApi(token, createdId, files);

      toast.success("Fotos subidas correctamente ✅");
      setCreatedId(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (e) {
      const err = e as ApiError;
      toast.error(
        mapApiStatusToUserMessage(err.status, err.message)
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      {/* FORM */}
      <Card className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Crear listing
        </h1>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Título"
            placeholder="Loft moderno en Roma Norte"
            {...register("title")}
            error={errors.title?.message}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe tu lugar..."
            {...register("description")}
            error={errors.description?.message}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Precio/noche"
              inputMode="numeric"
              placeholder="1200"
              {...register("pricePerNight")}
              error={errors.pricePerNight?.message}
            />

            <Input
              label="Max huéspedes"
              inputMode="numeric"
              placeholder="2"
              {...register("maxGuests")}
              error={errors.maxGuests?.message}
            />

            <Input
              label="Recámaras"
              inputMode="numeric"
              placeholder="1"
              {...register("bedrooms")}
              error={errors.bedrooms?.message}
            />
          </div>

          <Input
            label="Amenities (CSV)"
            placeholder="wifi, cocina, estacionamiento"
            {...register("amenities")}
          />

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Crear listing
          </Button>
        </form>
      </Card>

      {/* UPLOAD */}
      <div className="space-y-3">
        <Card className="p-5">
          <div className="font-semibold">
            Subir fotos
          </div>

          <p className="text-sm text-neutral-600 mt-1">
            Endpoint: <b>POST /api/v1/listings/:id/photos</b> <br />
            Field name esperado por Multer: <b>photos</b> <br />
            Máximo 5 imágenes (jpg, png, webp)
          </p>

          {createdId ? (
            <Banner
              variant="success"
              title="Listing listo para fotos"
            >
              <p className="text-sm">
                ID:
                <span className="font-mono text-xs ml-2">
                  {createdId}
                </span>
              </p>
            </Banner>
          ) : (
            <Banner
              variant="info"
              title="Primero crea un listing"
            >
              <p className="text-sm">
                Cuando lo crees, aquí se habilita la subida.
              </p>
            </Banner>
          )}

          <div className="mt-3 space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full text-sm"
            />

            <Button
              type="button"
              className="w-full"
              loading={uploading}
              onClick={uploadPhotos}
            >
              Subir fotos
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}