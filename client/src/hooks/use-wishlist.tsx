import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
    category: string;
    metal?: string;
    gemstone?: string;
  };
  createdAt: string;
}

export function useWishlist() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("POST", "/api/wishlist", { productId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to favourites",
        description: "Item has been added to your favourites.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favourites",
        variant: "destructive",
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("DELETE", `/api/wishlist/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from favourites",
        description: "Item has been removed from your favourites.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favourites",
        variant: "destructive",
      });
    },
  });

  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your favourites.",
        variant: "destructive",
        action: (
          <a href="/signin" className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Sign In
          </a>
        ),
      });
      return;
    }

    const isInWishlist = wishlistItems.some(item => item.productId === productId);
    
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return {
    wishlistItems,
    isLoading,
    toggleWishlist,
    isInWishlist,
    addToWishlist: (productId: string) => {
      if (!isAuthenticated) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to your favourites.",
          variant: "destructive",
          action: (
            <a href="/signin" className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Sign In
            </a>
          ),
        });
        return;
      }
      addToWishlistMutation.mutate(productId);
    },
    removeFromWishlist: (productId: string) => removeFromWishlistMutation.mutate(productId),
    isProcessing: addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
  };
}
