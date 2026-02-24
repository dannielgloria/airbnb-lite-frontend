import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../state/auth/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-rose-500" />
          <span className="font-extrabold tracking-tight">airbnb-lite</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "px-3 py-2 rounded-xl bg-neutral-100 font-semibold" : "px-3 py-2 rounded-xl hover:bg-neutral-100"}>
            Explorar
          </NavLink>
          {user ? (
            <>
              <NavLink to="/trips" className={({isActive}) => isActive ? "px-3 py-2 rounded-xl bg-neutral-100 font-semibold" : "px-3 py-2 rounded-xl hover:bg-neutral-100"}>
                Mis viajes
              </NavLink>
              <NavLink to="/host" className={({isActive}) => isActive ? "px-3 py-2 rounded-xl bg-neutral-100 font-semibold" : "px-3 py-2 rounded-xl hover:bg-neutral-100"}>
                Host dashboard
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:block text-sm text-neutral-700">
                <span className="font-semibold">{user.name}</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold px-3 py-2 rounded-xl hover:bg-neutral-100">Login</Link>
              <Link to="/register" className="text-sm font-semibold px-3 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
