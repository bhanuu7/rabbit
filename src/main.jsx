import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <ThemeProvider
    defaultTheme="dark"
    attribute="class"
    storageKey="vite-ui-theme"
  >
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </ThemeProvider>,
);
