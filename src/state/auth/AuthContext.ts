import { createContext } from "react";
import type { MeResponse } from "../../api/types";

export type AuthState = {
  token: string | null;
  user: MeResponse | null;
  isBootstrapping: boolean;
};

export type AuthActions = {
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<(AuthState & AuthActions) | null>(null);
