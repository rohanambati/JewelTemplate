import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageLoading, setImageLoading] = useState(true);

  const inWishlist = isInWishlist(product.id);
  const rating = parseFloat(product.rating);
  const ratingWidth = (rating / 5) * 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const primaryImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600";

  return (
    <Card 
      className={`product-card group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border hover:border-primary/20 ${className}`}
      data-testid={`product-card-${product.id}`}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            data-testid={`product-image-${product.id}`}
          />
          <div className="shimmer-overlay absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-4 right-4 p-2 backdrop-blur-sm rounded-full transition-colors duration-200 ${
              inWishlist 
                ? "bg-primary/20 text-primary hover:bg-primary/30" 
                : "bg-foreground/60 text-background hover:bg-foreground/70 hover:text-primary"
            }`}
            onClick={handleWishlistToggle}
            data-testid={`wishlist-button-${product.id}`}
          >
            <Heart 
              className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} 
            />
          </Button>

          {/* Sale Badge */}
          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
            <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
              Sale
            </Badge>
          )}
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-serif font-semibold text-card-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-primary relative">
              <div className="text-lg text-gray-400">★★★★★</div>
              <div 
                className="absolute top-0 left-0 text-lg text-primary overflow-hidden"
                style={{ width: `${ratingWidth}%` }}
              >
                ★★★★★
              </div>
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                {CURRENCY_SYMBOL}{parseFloat(product.price).toLocaleString()}
              </span>
              {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                <span className="text-sm text-muted-foreground line-through">
                  {CURRENCY_SYMBOL}{parseFloat(product.compareAtPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-accent transition-colors duration-200"
            onClick={handleAddToCart}
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
