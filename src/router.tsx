import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layouts/AppShell";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { HostDashboardPage } from "./pages/HostDashboardPage";
//import { CreateListingPage } from "./pages/CreateListingPage";
import { MyTripsPage } from "./pages/MyTripsPage";
//import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./router/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/listing/:id", element: <ListingDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/trips", element: <MyTripsPage /> },
          { path: "/host", element: <HostDashboardPage /> },
          //{ path: "/host/new", element: <CreateListingPage /> },
        ],
      },

      //{ path: "*", element: <NotFoundPage /> },
    ],
  },
]);
