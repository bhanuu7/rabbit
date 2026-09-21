import { useState, lazy, Suspense } from "react";
import LoginPage from "./pages/LoginPage";
import { StoreProvider } from "./context/StoreContext";
import { CartProvider } from "./context/CartContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./AppLayout";
import { Amplify } from "aws-amplify";
import AgeVerification from "./components/AgeVerification";
import WhiskeySpinner from "./components/WhiskeySpinner";
import { UserProvider } from "./context/UserContext";
import { CustomersPage } from "./pages/Customers";
import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const Inventory = lazy(() => import("./pages/Inventory"));
const CartPage = lazy(() => import("./pages/CartPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_COGNITO_REGION,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    },
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_ASSETS_BUCKET,
      region: import.meta.env.VITE_REGION,
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const [ageVerified, setAgeVerified] = useState(
    () => sessionStorage.getItem("ageVerified") === "true",
  );

  const handleAgeConfirm = () => {
    sessionStorage.setItem("ageVerified", "true");
    setAgeVerified(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {!ageVerified && <AgeVerification onConfirm={handleAgeConfirm} />}
      <UserProvider>
        <BrowserRouter>
          <TooltipProvider>
            <StoreProvider>
              <CartProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route element={<AppLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<ContactUs />} />
                      </Route>
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Suspense>
              </CartProvider>
            </StoreProvider>
          </TooltipProvider>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-svh bg-bg-base">
      <WhiskeySpinner size={100} label="Loading…" />
    </div>
  );
}

export default App;
