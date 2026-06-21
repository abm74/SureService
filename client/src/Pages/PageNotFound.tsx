import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Store } from "lucide-react";
import PageNav from "@/Components/Header/PageNav";
import { Button } from "@/Components/UI/button";

export const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PageNav />
      <main className="grow flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-3xl bg-surface-soft border border-hairline flex items-center justify-center text-primary shadow-xs">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight">404 - Page Not Found</h1>
        <p className="text-xs text-muted-foreground max-w-sm">
          The service provider profile, booking page, or document you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold h-10 px-5">
              <ArrowLeft className="size-3.5 mr-1.5" />
              <span>Back Home</span>
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button size="sm" className="rounded-full text-xs font-bold h-10 px-5 bg-primary text-white shadow-xs">
              <Store className="size-3.5 mr-1.5" />
              <span>Explore Marketplace</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PageNotFound;
