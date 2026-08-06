import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient.ts";
import App from "./App.tsx";
import ProtectedRoute from "./Pages/ProtectedRoute.tsx";
import RouteErrorBoundary from "./Pages/RouteErrorBoundary.tsx";

const Homepage = lazy(() => import("./Pages/Homepage.tsx"));
const About = lazy(() => import("./Pages/About.tsx"));
const Marketplace = lazy(() => import("./Pages/Marketplace.tsx"));
const ProviderProfile = lazy(() => import("./Pages/ProviderProfile.tsx"));
const BookProvider = lazy(() => import("./Pages/BookProvider.tsx"));
const CustomerBookings = lazy(() => import("./Pages/CustomerBookings.tsx"));
const ProviderBookings = lazy(() => import("./Pages/ProviderBookings.tsx"));
const ProviderStats = lazy(() => import("./Pages/ProviderStats.tsx"));
const ProviderVerification = lazy(() => import("./Pages/ProviderVerification.tsx"));
const ProviderProfileSettings = lazy(() => import("./Pages/ProviderProfileSettings.tsx"));
const AdminUsers = lazy(() => import("./Pages/AdminUsers.tsx"));
const AdminBookings = lazy(() => import("./Pages/AdminBookings.tsx"));
const AdminBookingDetails = lazy(() => import("./Pages/AdminBookingDetails.tsx"));
const AdminVerifications = lazy(() => import("./Pages/AdminVerifications.tsx"));
const Login = lazy(() => import("./Pages/Login.tsx"));
const Signup = lazy(() => import("./Pages/Signup.tsx"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RouteErrorBoundary,
    id: "root",
    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "marketplace",
        Component: Marketplace,
      },
      {
        path: "providers/:id",
        Component: ProviderProfile,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "providers/:id/book",
            Component: BookProvider,
          },
          {
            path: "bookings",
            Component: CustomerBookings,
          },
        ],
      },
      {
        path: "provider",
        element: <ProtectedRoute requiredRole="provider" />,
        children: [
          {
            index: true,
            element: <Navigate to="/provider/bookings" replace />,
          },
          {
            path: "bookings",
            Component: ProviderBookings,
          },
          {
            path: "stats",
            Component: ProviderStats,
          },
          {
            path: "verification",
            Component: ProviderVerification,
          },
          {
            path: "profile",
            Component: ProviderProfileSettings,
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/users" replace />,
          },
          {
            path: "users",
            Component: AdminUsers,
          },
          {
            path: "bookings",
            Component: AdminBookings,
          },
          {
            path: "bookings/:id",
            Component: AdminBookingDetails,
          },
          {
            path: "verifications",
            Component: AdminVerifications,
          },
        ],
      },
      {
        path: "*",
        Component: PageNotFound,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
