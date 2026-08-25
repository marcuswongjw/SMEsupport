import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Advisor from "./pages/Advisor";
import Home from "./pages/Home";
import Resources from "./pages/Resources";

function AppRouter() {
  return <Switch><Route path="/" component={Home} /><Route path="/advisor" component={Advisor} /><Route path="/resources" component={Resources} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Router hook={useHashLocation}><Toaster /><AppRouter /></Router></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
