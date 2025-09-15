import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import ProductFilters from "@/components/product/product-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { SORT_OPTIONS } from "@/lib/constants";
import type { Product } from "@shared/schema";

interface FilterState {
  categories: string[];
  metals: string[];
  gemstones: string[];
  priceRange: [number, number];
  sortBy: string;
}

export default function Shop() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    metals: [],
    gemstones: [],
    priceRange: [0, 500000],
    sortBy: 'popularity'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters.categories.length > 0) params.set('category', filters.categories[0]);
    if (filters.metals.length > 0) params.set('metal', filters.metals[0]);
    if (filters.gemstones.length > 0) params.set('gemstone', filters.gemstones[0]);
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 500000) params.set('maxPrice', filters.priceRange[1].toString());
    params.set('sortBy', filters.sortBy);
    params.set('page', currentPage.toString());
    params.set('limit', itemsPerPage.toString());
    return params.toString();
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: [`/api/products?${buildQueryParams()}`],
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.total || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const ProductSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-8" data-testid="shop-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Shop Jewelry
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover our complete collection of handcrafted jewelry pieces
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="w-full"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${totalProducts} products found`}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="w-48" data-testid="sort-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                    data-testid="grid-view"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                    data-testid="list-view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 || filters.metals.length > 0 || filters.gemstones.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                {[...filters.categories, ...filters.metals, ...filters.gemstones].map((filter) => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product: Product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'md:flex md:flex-row md:h-48' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button 
                  onClick={() => handleFiltersChange({
                    categories: [],
                    metals: [],
                    gemstones: [],
                    priceRange: [0, 500000],
                    sortBy: 'popularity'
                  })}
                  data-testid="clear-all-filters"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  data-testid="prev-page"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        data-testid={`page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
