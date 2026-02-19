import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { MeResponse } from "../../api/types";
import { meApi } from "../../api/auth";
import toast from "react-hot-toast";
import { ApiError, mapApiStatusToUserMessage } from "../../api/errors";

const LS_TOKEN = "airbnb_lite_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isBootstrapping, setBootstrapping] = useState(true);

  async function refreshMe() {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await meApi(token);
      setUser(me);
    } catch (e) {
      const err = e as ApiError;
      // Si token inválido => logout duro
      if (err.status === 401) {
        localStorage.removeItem(LS_TOKEN);
        setToken(null);
        setUser(null);
      }
      throw e;
    }
  }

  async function login(nextToken: string) {
    localStorage.setItem(LS_TOKEN, nextToken);
    setToken(nextToken);
    try {
      const me = await meApi(nextToken);
      setUser(me);
      toast.success(`Bienvenido, ${me.name}`);
    } catch (e) {
      const err = e as ApiError;
      toast.error(mapApiStatusToUserMessage(err.status, err.message));
      localStorage.removeItem(LS_TOKEN);
      setToken(null);
      setUser(null);
      throw e;
    }
  }

  function logout() {
    localStorage.removeItem(LS_TOKEN);
    setToken(null);
    setUser(null);
    toast.success("Sesión cerrada");
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        // ya manejado arriba
      } finally {
        setBootstrapping(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ token, user, isBootstrapping, login, logout, refreshMe }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
