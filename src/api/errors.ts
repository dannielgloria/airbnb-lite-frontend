export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function mapApiStatusToUserMessage(status: number, serverMessage?: string) {
  // Server message ya viene en {message} en tu middleware :contentReference[oaicite:5]{index=5}
  const fallback = serverMessage || "Ocurrió un error. Intenta de nuevo.";

  switch (status) {
    case 400: return serverMessage || "Revisa los datos enviados (400).";
    case 401: return serverMessage || "Tu sesión expiró o credenciales inválidas (401).";
    case 403: return serverMessage || "No tienes permiso para hacer esto (403).";
    case 404: return serverMessage || "No se encontró el recurso (404).";
    case 409: return serverMessage || "Conflicto: ya existe un registro similar (409).";
    case 422: return serverMessage || "Datos inválidos (422).";
    case 500: return serverMessage || "Error del servidor (500).";
    default:  return fallback;
  }
}
