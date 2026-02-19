import React from "react";
import { Banner } from "../../components/ui/Banner";

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Uncaught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <Banner variant="error" title="Se rompió la app">
              <p className="text-sm opacity-90">
                Recarga la página. Si persiste, revisa consola.
              </p>
              <pre className="mt-3 text-xs overflow-auto rounded-lg bg-black/90 text-white p-3">
                {this.state.error?.message}
              </pre>
              <button
                className="mt-4 inline-flex rounded-xl bg-black text-white px-4 py-2"
                onClick={() => window.location.reload()}
              >
                Recargar
              </button>
            </Banner>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
