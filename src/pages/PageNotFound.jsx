import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Home className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <p className="text-7xl font-bold tracking-tight">404</p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved or the URL might be incorrect.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
