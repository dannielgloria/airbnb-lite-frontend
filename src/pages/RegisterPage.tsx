import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { registerApi, loginApi } from "../api/auth";
import { useAuth } from "../state/auth/useAuth";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type Form = z.infer<typeof schema>;

export function RegisterPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({ resolver: zodResolver(schema), mode: "onTouched" });

  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { firstFieldRef.current?.focus(); }, []);

  const onSubmit = async (values: Form) => {
    try {
      await registerApi(values); // backend: {id,name,email} :contentReference[oaicite:12]{index=12}
      toast.success("Cuenta creada. Entrando…");
      const { accessToken } = await loginApi({ email: values.email, password: values.password });
      await login(accessToken);
      nav("/", { replace: true });
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
      if (err.status === 409) setError("email", { message: "Ese email ya está en uso" });
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Hostea o reserva. Tú decides.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre"
            placeholder="Daniel"
            {...register("name")}
            error={errors.name?.message}
            ref={(el) => {
              register("name").ref(el);
              firstFieldRef.current = el;
            }}
          />
          <Input label="Email" type="email" placeholder="tu@email.com" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />

          <Button className="w-full" loading={isSubmitting}>
            Crear cuenta
          </Button>

          <p className="text-sm text-neutral-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-rose-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
