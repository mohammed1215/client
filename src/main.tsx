import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { UserProvider } from "./context/userContext.tsx";
import { ThemeProvider } from "./context/themeContext.tsx";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <TooltipProvider>
        <BrowserRouter>
            <UserProvider>
                <ThemeProvider
                    defaultTheme="system"
                    storageKey="taskflow-theme"
                >
                    <App />
                </ThemeProvider>
            </UserProvider>
            <Toaster />
        </BrowserRouter>
    </TooltipProvider>,
    // </StrictMode>,
);
