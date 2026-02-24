import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-extrabold">404</div>
        <p className="mt-2 text-neutral-600">No existe esta ruta.</p>
        <Link to="/" className="inline-block mt-4">
          <Button>Volver a Home</Button>
        </Link>
      </div>
    </div>
  );
}