import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { Button } from "@/Components/UI/button";

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let title = "Unexpected Application Error";
  let message = "Something went wrong while rendering this page. Please try refreshing or return home.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} - ${error.statusText || "Application Error"}`;
    message = typeof error.data === "string" ? error.data : error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />
      <main className="grow flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight">{title}</h1>
        <p className="text-xs text-muted-foreground max-w-md">
          {message}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            className="rounded-full text-xs font-semibold h-10 px-5 cursor-pointer"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            <span>Reload Page</span>
          </Button>
          <Link to="/">
            <Button size="sm" className="rounded-full text-xs font-bold h-10 px-5 bg-primary text-white shadow-xs">
              <Home className="size-3.5 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RouteErrorBoundary;
