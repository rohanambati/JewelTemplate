import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart, Star, ShoppingCart, Truck, RotateCcw, Shield, Share2, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product/product-card";
import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { useToast } from "@/hooks/use-toast";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { Product, Review } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const { slug } = params;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    enabled: !!slug,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/products/${product?.id}/reviews`],
    enabled: !!product?.id,
  });

  const { data: relatedProducts = [] } = useQuery<{ products: Product[] }>({
    queryKey: [`/api/products?category=${product?.category}&limit=4`],
    enabled: !!product?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Link href="/shop">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"];

  const inWishlist = isInWishlist(product.id);
  const rating = parseFloat(product.rating);
  const ratingWidth = (rating / 5) * 100;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariant);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen pt-8" data-testid="product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div 
                className="relative overflow-hidden rounded-lg bg-muted cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className={`w-full transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  data-testid="product-main-image"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    data-testid="prev-image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    data-testid="next-image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-primary relative mr-2">
                  <div className="text-lg text-gray-400">★★★★★</div>
                  <div 
                    className="absolute top-0 left-0 text-lg text-primary overflow-hidden"
                    style={{ width: `${ratingWidth}%` }}
                  >
                    ★★★★★
                  </div>
                </div>
                <span className="text-muted-foreground">
                  {rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {CURRENCY_SYMBOL}{parseFloat(product.price).toLocaleString()}
                </span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-xl text-muted-foreground line-through">
                    {CURRENCY_SYMBOL}{parseFloat(product.compareAtPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.sku && (
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
              )}
              {product.metal && (
                <div>
                  <span className="text-muted-foreground">Metal:</span>
                  <span className="ml-2 font-medium">{product.metal}</span>
                </div>
              )}
              {product.gemstone && (
                <div>
                  <span className="text-muted-foreground">Gemstone:</span>
                  <span className="ml-2 font-medium">{product.gemstone}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="quantity">Quantity:</Label>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                  <SelectTrigger className="w-24" id="quantity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  data-testid="add-to-cart"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={inWishlist ? "border-primary text-primary" : ""}
                  data-testid="toggle-wishlist"
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                </Button>
                
                <Button variant="outline" onClick={handleShare} data-testid="share-product">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center space-y-2">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-16">
          <Accordion type="single" collapsible className="max-w-4xl">
            <AccordionItem value="materials">
              <AccordionTrigger className="text-left">Materials & Craftsmanship</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  {product.materials && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Materials:</h4>
                      <p>{product.materials}</p>
                    </div>
                  )}
                  {product.craftsmanship && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Craftsmanship:</h4>
                      <p>{product.craftsmanship}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Shipping:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Free shipping on orders over ₹5,000</li>
                      <li>Standard delivery: 3-5 business days</li>
                      <li>Express delivery: 1-2 business days (additional charges apply)</li>
                      <li>Secure packaging with insurance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Returns:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>30-day hassle-free returns</li>
                      <li>Items must be in original condition</li>
                      <li>Free return shipping</li>
                      <li>Refund processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="warranty">
              <AccordionTrigger>Warranty & Care</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  {product.warranty && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Warranty:</h4>
                      <p>{product.warranty}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Care Instructions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Store in a cool, dry place</li>
                      <li>Clean with soft cloth</li>
                      <li>Avoid exposure to chemicals and perfumes</li>
                      <li>Professional cleaning recommended annually</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Customer Reviews</h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.slice(0, 3).map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="flex text-primary mr-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-current" : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                        )}
                      </div>
                      {review.isVerified && (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts?.products?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.products
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
