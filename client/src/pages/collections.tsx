import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import type { Collection, Product } from "@shared/schema";

export default function Collections() {
  const params = useParams();
  const collectionSlug = params.slug;

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  const { data: collection } = useQuery<Collection>({
    queryKey: [`/api/collections/${collectionSlug}`],
    enabled: !!collectionSlug,
  });

  const { data: collectionProductsData } = useQuery<{ products: Product[] }>({
    queryKey: [`/api/products?collectionId=${collection?.id}`],
    enabled: !!collection?.id,
  });

  const collectionProducts = collectionProductsData?.products || [];

  // If viewing a specific collection
  if (collectionSlug && collection) {
    return (
      <div className="min-h-screen pt-8" data-testid="collection-detail">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collection Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {collection.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {collection.description}
            </p>
          </div>

          {/* Collection Hero Image */}
          {collection.imageUrl && (
            <div className="relative overflow-hidden rounded-lg mb-16 h-96">
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {collectionProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products found in this collection yet.
              </p>
              <Link href="/shop">
                <Button className="mt-4">
                  Browse All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Collections overview page
  return (
    <div className="min-h-screen pt-8" data-testid="collections-overview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated jewelry collections, each featuring unique designs 
            and exceptional craftsmanship.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              <Card 
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-border hover:border-primary/20"
                data-testid={`collection-overview-card-${collection.slug}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={collection.imageUrl || 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                    alt={collection.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-serif font-semibold text-card-foreground mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {collection.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-accent font-semibold p-0 h-auto group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Explore Collection →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-20 prose prose-lg prose-invert max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">
            Discover Exceptional Jewelry Collections
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Premium Craftsmanship</h3>
              <p>
                Each piece in our collections is meticulously handcrafted by skilled artisans 
                who bring decades of experience to every design. We use only the finest materials 
                and traditional techniques to ensure lasting beauty and quality.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Timeless Design</h3>
              <p>
                Our jewelry collections blend classic elegance with contemporary style, 
                creating pieces that transcend trends and become treasured heirlooms. 
                From statement pieces to everyday elegance, find your perfect match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
