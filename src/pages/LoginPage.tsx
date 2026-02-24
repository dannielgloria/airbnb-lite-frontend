import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { loginApi } from "../api/auth";
import { useAuth } from "../state/auth/useAuth";
import { ApiError, mapApiStatusToUserMessage } from "../api/errors";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Banner } from "../components/ui/Banner";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Password requerido"),
});
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loc = useLocation() as any;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({ resolver: zodResolver(schema), mode: "onTouched" });

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  const onSubmit = async (values: Form) => {
    try {
      const { accessToken } = await loginApi(values);
      await login(accessToken);
      const to = loc.state?.from || "/";
      nav(to, { replace: true });
    } catch (e) {
      const err = e as ApiError;
      const msg = mapApiStatusToUserMessage(err.status, err.message);
      toast.error(msg);

      // inline mapping (ej: credenciales inválidas)
      if (err.status === 401) {
        setError("email", { message: "Revisa tu email" });
        setError("password", { message: "Revisa tu password" });
      }
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Inicia sesión</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Bienvenido de vuelta. Reserva en 2 minutos.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            {...register("email")}
            error={errors.email?.message}
            ref={(el) => {
              register("email").ref(el);
              firstFieldRef.current = el;
            }}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button className="w-full" loading={isSubmitting}>
            Entrar
          </Button>

          <Banner variant="info" title="Tip">
            <p className="text-sm">
              Si tu backend responde 401 con “Invalid credentials”, aquí lo mapeamos a mensajes útiles.
            </p>
          </Banner>

          <p className="text-sm text-neutral-600">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-rose-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
