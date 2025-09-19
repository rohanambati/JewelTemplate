import { Switch, Route } from "wouter";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./components/cart/cart-provider";
import { WishlistProvider } from "./components/wishlist/wishlist-provider";
import { AuthProvider } from "./contexts/auth-context";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { queryClient } from "./lib/queryClient";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import Home from "./pages/home";
import Collections from "./pages/collections";
import Shop from "./pages/shop";
import ProductDetail from "./pages/product-detail";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Offers from "./pages/offers";
import Support from "./pages/support";
import Contact from "./pages/contact";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Cookies from "./pages/cookies";
import NotFound from "./pages/not-found";
import About from "./pages/about";
import Care from "./pages/care";
import Warranty from "./pages/warranty";
import SizeGuide from "./pages/size-guide";
import { Suspense, useEffect } from "react";
import { Button } from "./components/ui/button";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <pre className="text-red-500 bg-gray-100 p-4 rounded mb-6 overflow-auto text-sm">
        {error.message}
      </pre>
      <div className="flex justify-end">
        <Button onClick={resetErrorBoundary} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:slug" component={Collections} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/offers" component={Offers} />
      <Route path="/support" component={Support} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/about" component={About} />
      <Route path="/care" component={Care} />
      <Route path="/warranty" component={Warranty} />
      <Route path="/size-guide" component={SizeGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isLoading, progress, stopLoading } = useLoading();

  useEffect(() => {
    // Set a maximum loading time of 5 seconds
    const maxLoadingTime = setTimeout(() => {
      stopLoading();
    }, 5000); // 5 seconds maximum

    // Simulate loading of assets
    const loadingTimer = setTimeout(() => {
      stopLoading();
    }, 2000); // Normal loading time

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(maxLoadingTime);
    };
  }, [stopLoading]);

  return (
    <div className="flex min-h-screen flex-col">
      {isLoading && <LoadingScreen progress={progress} />}
      <Navbar />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorFallback 
                error={error} 
                resetErrorBoundary={resetErrorBoundary} 
              />
            )}
          >
            <TooltipProvider>
              <AuthProvider>
                <Suspense fallback={<LoadingScreen progress={0} />}>
                  <LoadingProvider>
                    <CartProvider>
                      <WishlistProvider>
                        <AppContent />
                      </WishlistProvider>
                    </CartProvider>
                  </LoadingProvider>
                </Suspense>
              </AuthProvider>
            </TooltipProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}

export default App;
