import { Link } from "wouter";
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/cart-provider";
import { CURRENCY_SYMBOL } from "@/lib/constants";

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

export default function Favourites() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-8" data-testid="favourites-auth-required">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Sign In Required
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your favourite items.
            </p>
            <div className="space-x-4">
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-3 text-muted-foreground">Loading favourites...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8" data-testid="favourites-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              My Favourites
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              No Favourites Yet
            </h2>
            <p className="text-muted-foreground mb-8">
              Start adding items to your favourites to see them here.
            </p>
            <Link href="/shop">
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={
                        item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0
                          ? item.product.images[0]
                          : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                      }
                      alt={item.product?.name || "Product"}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlistMutation.mutate(item.productId)}
                      disabled={removeFromWishlistMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product?.name || "Unknown Product"}</h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {CURRENCY_SYMBOL}{item.product?.price ? parseFloat(item.product.price).toLocaleString() : "0"}
                      </span>
                    </div>
                    
                    {(item.product?.metal || item.product?.gemstone) && (
                      <div className="text-xs text-muted-foreground">
                        {item.product?.metal && <span>{item.product.metal}</span>}
                        {item.product?.metal && item.product?.gemstone && <span> • </span>}
                        {item.product?.gemstone && <span>{item.product.gemstone}</span>}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(item.productId, 1)}
                      >
                        Add to Cart
                      </Button>
                      <Link href={`/product/${item.productId}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
