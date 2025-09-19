import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import type { CartItem, Product } from "@shared/schema";

interface CartContextType {
  items: (CartItem & { product: Product })[];
  totalItems: number;
  totalAmount: number; // legacy: equals subtotalAfterDiscount for backward compatibility
  subtotal: number;
  subtotalAfterDiscount: number;
  discountAmount: number;
  appliedPromo?: { code: string; type: 'percent'; value: number; description?: string };
  addToCart: (productId: string, quantity?: number, variant?: any) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => Promise<void>;
  clearPromo: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percent'; value: number; description?: string } | undefined>(undefined);

  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
    refetchOnWindowFocus: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1, variant }: { productId: string; quantity?: number; variant?: any }) => {
      const response = await apiRequest("POST", "/api/cart", { 
        productId, 
        quantity,
        variant 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.product?.price || 0) * item.quantity);
  }, 0);

  const discountAmount = appliedPromo
    ? Math.max(0, Math.round((subtotal * appliedPromo.value) / 100))
    : 0;

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  async function applyPromo(code: string) {
    try {
      const res = await apiRequest('POST', '/api/promocode/validate', { code });
      const data = await res.json();
      setAppliedPromo({ code: data.code, type: data.type, value: data.value, description: data.description });
      toast({ title: 'Promo Applied', description: `${data.code} - ${data.description || data.value + '% off'}` });
    } catch (err: any) {
      setAppliedPromo(undefined);
      toast({ title: 'Invalid promo code', description: err.message || 'Please check the code and try again', variant: 'destructive' });
    }
  }

  function clearPromo() {
    setAppliedPromo(undefined);
    toast({ title: 'Promo Removed', description: 'The applied promo code has been removed.' });
  }

  const handleAddToCart = (productId: string, quantity = 1, variant?: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
        action: (
          <a href="/signin" className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Sign In
          </a>
        ),
      });
      return;
    }
    addToCartMutation.mutate({ productId, quantity, variant });
  };

  const value: CartContextType = {
    items: cartItems,
    totalItems,
    totalAmount: subtotalAfterDiscount,
    subtotal,
    subtotalAfterDiscount,
    discountAmount,
    appliedPromo,
    addToCart: handleAddToCart,
    updateQuantity: (itemId: string, quantity: number) => 
      updateQuantityMutation.mutate({ itemId, quantity }),
    removeItem: (itemId: string) => removeItemMutation.mutate(itemId),
    clearCart: () => clearCartMutation.mutate(),
    applyPromo,
    clearPromo,
    isLoading: isLoading || addToCartMutation.isPending || updateQuantityMutation.isPending || removeItemMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
