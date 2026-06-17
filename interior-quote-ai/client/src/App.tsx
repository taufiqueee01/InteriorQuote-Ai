import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import Quotations from "./pages/Quotations";
import QuotationForm from "./pages/QuotationForm";
import Proposals from "./pages/Proposals";
import ProposalForm from "./pages/ProposalForm";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      
      {/* Protected Routes */}
      <Route path={"/dashboard"} component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={"/clients"} component={() => <ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path={"/clients/new"} component={() => <ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path={"/clients/:id"} component={() => <ProtectedRoute><ClientForm /></ProtectedRoute>} />
      
      <Route path={"/quotations"} component={() => <ProtectedRoute><Quotations /></ProtectedRoute>} />
      <Route path={"/quotations/new"} component={() => <ProtectedRoute><QuotationForm /></ProtectedRoute>} />
      <Route path={"/quotations/:id"} component={() => <ProtectedRoute><QuotationForm /></ProtectedRoute>} />
      
      <Route path={"/proposals"} component={() => <ProtectedRoute><Proposals /></ProtectedRoute>} />
      <Route path={"/proposals/new"} component={() => <ProtectedRoute><ProposalForm /></ProtectedRoute>} />
      <Route path={"/proposals/:id"} component={() => <ProtectedRoute><ProposalForm /></ProtectedRoute>} />
      
      <Route path={"/settings"} component={() => <ProtectedRoute><Settings /></ProtectedRoute>} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
