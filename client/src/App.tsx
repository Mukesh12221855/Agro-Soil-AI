import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/Auth";
import DashboardOverview from "@/pages/DashboardOverview";
import SoilAnalysis from "@/pages/SoilAnalysis";
import Market from "@/pages/Market";
import Weather from "@/pages/Weather";
import NotFound from "@/pages/not-found";
import { DashboardLayout } from "@/components/DashboardLayout";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardOverview} />
      </Route>
      <Route path="/dashboard/soil">
        <ProtectedRoute component={SoilAnalysis} />
      </Route>
      <Route path="/dashboard/market">
        <ProtectedRoute component={Market} />
      </Route>
      <Route path="/dashboard/weather">
        <ProtectedRoute component={Weather} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
