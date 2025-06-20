import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Homepage from "@/pages/homepage";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import LoanApplication from "@/pages/loan-application";
import Applications from "@/pages/applications";
import ApplicationDetails from "@/pages/application-details";
import Documents from "@/pages/documents";
import Analytics from "@/pages/analytics";
import Messages from "@/pages/messages";
import Settings from "@/pages/settings";
import FIDashboard from "@/pages/fi/fi-dashboard";
import FIApplications from "@/pages/fi/applications";
import FIPortfolio from "@/pages/fi/portfolio";
import FISettings from "@/pages/fi/fi-settings";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: any }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <Component />;
}

function Router() {
  const { user } = useAuth();
  
  // Role-based dashboard routing
  const getDashboardComponent = () => {
    if (!user) return Homepage;
    switch (user.role) {
      case 'fi': return FIDashboard;
      case 'admin': return AdminDashboard;
      default: return Dashboard;
    }
  };
  
  return (
    <Switch>
      <Route path="/" component={user ? getDashboardComponent() : Homepage} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/dashboard">
        <ProtectedRoute component={getDashboardComponent()} />
      </Route>
      
      {/* SMB Routes */}
      <Route path="/apply">
        <ProtectedRoute component={LoanApplication} />
      </Route>
      <Route path="/applications">
        <ProtectedRoute component={Applications} />
      </Route>
      <Route path="/applications/:id">
        <ProtectedRoute component={ApplicationDetails} />
      </Route>
      <Route path="/documents">
        <ProtectedRoute component={Documents} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route path="/business-settings" component={() => {
        const LazyComponent = React.lazy(() => import("@/pages/business-settings"));
        return <React.Suspense fallback={<div>Loading...</div>}><LazyComponent /></React.Suspense>;
      }} />
      
      {/* FI Routes */}
      <Route path="/fi/applications">
        <ProtectedRoute component={FIApplications} />
      </Route>
      <Route path="/fi/portfolio">
        <ProtectedRoute component={FIPortfolio} />
      </Route>
      <Route path="/fi/settings">
        <ProtectedRoute component={FISettings} />
      </Route>
      <Route path="/fi/recent-applications" component={() => {
        const LazyComponent = React.lazy(() => import("@/pages/fi/recent-applications"));
        return <React.Suspense fallback={<div>Loading...</div>}><LazyComponent /></React.Suspense>;
      }} />
      
      {/* Admin Routes */}
      <Route path="/admin/users">
        <ProtectedRoute component={() => <div className="p-8 text-center">User Management - Coming Soon</div>} />
      </Route>
      <Route path="/admin/user-management" component={() => {
        const LazyComponent = React.lazy(() => import("@/pages/admin/user-management"));
        return <React.Suspense fallback={<div>Loading...</div>}><LazyComponent /></React.Suspense>;
      }} />
      <Route path="/admin/settings">
        <ProtectedRoute component={() => <div className="p-8 text-center">Admin Settings - Coming Soon</div>} />
      </Route>
      <Route path="/admin/api-management" component={() => {
        const LazyComponent = React.lazy(() => import("@/pages/admin/api-management"));
        return <React.Suspense fallback={<div>Loading...</div>}><LazyComponent /></React.Suspense>;
      }} />
      <Route path="/admin/security-policies" component={() => {
        const LazyComponent = React.lazy(() => import("@/pages/admin/security-policies"));
        return <React.Suspense fallback={<div>Loading...</div>}><LazyComponent /></React.Suspense>;
      }} />
      
      {/* Shared Routes */}
      <Route path="/messages">
        <ProtectedRoute component={Messages} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {user && <AppHeader />}
      <Toaster />
      <Router />
    </div>
  );
}

function AppHeader() {
  const { user, logout } = useAuth();
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const { selectedCurrency, currencies, setCurrency } = useCurrency();
  
  return (
    <header className={`glass-nav ${effectiveTheme === 'dark' ? 'glass-nav-dark' : 'glass-nav-light'} sticky top-0 z-50 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-float relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse-slow opacity-75"></div>
              <span className="text-white font-black text-xl relative z-10">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black heading-gradient heading-primary">
                KreditHub
              </span>
              <span className={`text-xs ${effectiveTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} tracking-wider`}>
                FINANCIAL PLATFORM
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Currency Selector */}
            <Select value={selectedCurrency.code} onValueChange={(code) => {
              const currency = currencies.find(c => c.code === code);
              if (currency) setCurrency(currency);
            }}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Theme Toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Current theme: ${theme} (${effectiveTheme})`}
              >
                {effectiveTheme === "light" ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                  </svg>
                )}
                {theme === "system" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ({user?.role === 'smb' ? 'Business' : user?.role === 'fi' ? 'Financial Institution' : 'Admin'})
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-xs">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
