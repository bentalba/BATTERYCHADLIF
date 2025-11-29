import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BatteriesVoiture from "./pages/BatteriesVoiture";
import BatteriesPoidsLourd from "./pages/BatteriesPoidsLourd";
import BatteriesMarine from "./pages/BatteriesMarine";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time + wait for resources
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(minLoadTime);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen isLoading={isLoading} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/batteries-voiture" element={<BatteriesVoiture />} />
            <Route path="/batteries-poids-lourd" element={<BatteriesPoidsLourd />} />
            <Route path="/batteries-marine" element={<BatteriesMarine />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
