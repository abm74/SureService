import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
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

const Homepage = lazy(() => import("./Pages/Homepage.tsx"));
const About = lazy(() => import("./Pages/About.tsx"));
const Marketplace = lazy(() => import("./Pages/Marketplace.tsx"));
const ProviderProfile = lazy(() => import("./Pages/ProviderProfile.tsx"));
const BookProvider = lazy(() => import("./Pages/BookProvider.tsx"));
const CustomerBookings = lazy(() => import("./Pages/CustomerBookings.tsx"));
const ProviderDashboard = lazy(() => import("./Pages/ProviderDashboard.tsx"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard.tsx"));
const Login = lazy(() => import("./Pages/Login.tsx"));
const Signup = lazy(() => import("./Pages/Signup.tsx"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
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
        path: "app",
        element: <Navigate replace to="/marketplace" />,
      },
      {
        path: "app/*",
        element: <Navigate replace to="/marketplace" />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "marketplace",
            Component: Marketplace,
          },
          {
            path: "providers/:id",
            Component: ProviderProfile,
          },
          {
            path: "providers/:id/book",
            Component: BookProvider,
          },
          {
            path: "bookings",
            Component: CustomerBookings,
          },
          {
            path: "provider-dashboard",
            Component: ProviderDashboard,
          },
          {
            path: "admin-dashboard",
            Component: AdminDashboard,
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
