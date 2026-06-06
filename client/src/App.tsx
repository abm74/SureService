import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import "./index.css";
import AuthProvider from "./store/Auth/AuthProvider";
import BookingsProvider from "./store/Bookings/BookingsProvider";
import SpinnerFullPage from "./Components/UI/SpinnerFullPage";

const App = () => {
  return (
    <AuthProvider>
      <BookingsProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <Outlet />
        </Suspense>
      </BookingsProvider>
    </AuthProvider>
  );
};

export default App;
