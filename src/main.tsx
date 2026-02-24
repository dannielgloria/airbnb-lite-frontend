import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast" // Import the Tailwind CSS styles
import "./styles.css"
import {router} from "./router"
import { AuthProvider } from "./state/auth/AuthProvider"
import { ErrorBoundary } from "./state/errors/ErrorBoundary"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" toastOptions={{duration: 3500}} />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)