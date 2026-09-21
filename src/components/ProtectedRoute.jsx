import { Navigate, Outlet } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { PageLoader } from "@/App";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const hasToken = !!session.tokens?.idToken;

        setAuthenticated(hasToken);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
