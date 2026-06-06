import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import CountryList from "./Components/Countries/CountryList.tsx";
import CityList from "./Components/Cities/CityList.tsx";
import CityDetails from "./Components/Cities/CityDetails.tsx";
import CityForm from "./Components/Cities/CityForm.tsx";
import ProtectedRoute from "./Pages/ProtectedRoute.tsx";

const Homepage = lazy(() => import("./Pages/Homepage.tsx"));
const About = lazy(() => import("./Pages/About.tsx"));
const Login = lazy(() => import("./Pages/Login.tsx"));
const Signup = lazy(() => import("./Pages/Signup.tsx"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound.tsx"));
const AppLayout = lazy(() => import("./Pages/AppLayout.tsx"));

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
        path: "*",
        Component: PageNotFound,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "app",
            Component: AppLayout,
            id: "app",
            children: [
              { index: true, element: <Navigate replace to="cities" /> },
              { path: "cities", Component: CityList },
              { path: "cities/:cityId", Component: CityDetails },
              { path: "countries", Component: CountryList },
              { path: "add-city", Component: CityForm },
              { path: "edit-city/:cityId", Component: CityForm },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
