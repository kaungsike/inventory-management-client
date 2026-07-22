import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangleIcon, HomeIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let status = 500;
  let title = "Something went wrong";
  let description = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Page not found";
      description = "The page you're looking for doesn't exist or has been moved.";
    } else if (error.status === 403) {
      title = "Access denied";
      description = "You don't have permission to view this page.";
    } else if (error.status === 401) {
      title = "Not authenticated";
      description = "Sign in to access this page.";
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="h-8 w-8 text-destructive" />
      </div>

      <div className="space-y-2">
        <p className="text-5xl font-bold text-muted-foreground">{status}</p>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <RefreshCwIcon className="h-4 w-4" />
          Go back
        </Button>
        <Button onClick={() => navigate("/")} className="gap-2">
          <HomeIcon className="h-4 w-4" />
          Home
        </Button>
      </div>
    </div>
  );
}