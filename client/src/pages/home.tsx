import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";
import type { Collection, Product } from "@shared/schema";

export default function Home() {
  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-spotlight">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
          }}
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight tracking-wide">
            Elevate Your{" "}
            <span className="text-primary">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Handcrafted jewelry where timeless design meets modern sophistication.
          </p>
          
          <Link href="/collections">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:bg-accent transition-all duration-300 transform hover:scale-105"
              data-testid="explore-collections-cta"
            >
              Explore Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {/* Micro-trust text */}
          <div className="mt-6 text-sm text-muted-foreground flex items-center justify-center space-x-6">
            <span className="flex items-center">
              <Truck className="w-4 h-4 mr-2 text-primary" />
              Free Shipping
            </span>
            <span className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2 text-primary" />
              30-Day Returns
            </span>
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="py-20 bg-card" data-testid="signature-collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-card-foreground mb-4">
              Our Signature Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collections of exquisite jewelry, each piece telling its own story of elegance and craftsmanship.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`}>
                <div className="group cursor-pointer" data-testid={`collection-card-${collection.slug}`}>
                  <div className="relative overflow-hidden rounded-lg bg-muted">
                    <img 
                      src={collection.imageUrl || 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                      alt={`${collection.name} Collection`}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-2xl font-serif font-semibold mb-2">{collection.name}</h3>
                      <p className="text-white/90 mb-4">{collection.description}</p>
                      <Button 
                        variant="link" 
                        className="text-primary hover:text-accent font-semibold p-0 h-auto"
                      >
                        View Collection →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground">Handpicked pieces from our finest collections</p>
            </div>
            
            <Link href="/shop">
              <Button 
                variant="outline" 
                className="hidden md:flex items-center space-x-2"
                data-testid="view-all-products"
              >
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12 md:hidden">
            <Link href="/shop">
              <Button data-testid="view-all-products-mobile">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 bg-secondary border-y border-border" data-testid="trust-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 text-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-secondary-foreground">Free Shipping</div>
                <div className="text-sm text-muted-foreground">On orders over ₹5,000</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-secondary-foreground">30-Day Returns</div>
                <div className="text-sm text-muted-foreground">Hassle-free exchange</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-secondary-foreground">Secure Payments</div>
                <div className="text-sm text-muted-foreground">256-bit SSL encryption</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
