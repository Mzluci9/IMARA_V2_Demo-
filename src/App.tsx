import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/store/AppContext";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import DemandsPage from "@/pages/DemandsPage";
import MarketplacePage from "@/pages/MarketplacePage";
import AssignmentsPage from "@/pages/AssignmentsPage";
import QAPage from "@/pages/QAPage";
import PaymentsPage from "@/pages/PaymentsPage";
import AdminPage from "@/pages/AdminPage";
import EventLogPage from "@/pages/EventLogPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/demands" element={<DemandsPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/qa" element={<QAPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/events" element={<EventLogPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
