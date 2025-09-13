import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { JEWELRY_CATEGORIES, METAL_TYPES, GEMSTONE_TYPES, SORT_OPTIONS } from "@/lib/constants";

interface FilterState {
  categories: string[];
  metals: string[];
  gemstones: string[];
  priceRange: [number, number];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export default function ProductFilters({ filters, onFiltersChange, className }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'metals' | 'gemstones', value: string) => {
    const currentArray = filters[key];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, updated);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      metals: [],
      gemstones: [],
      priceRange: [0, 500000],
      sortBy: 'popularity'
    });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + filters.metals.length + filters.gemstones.length;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger>
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
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          max={500000}
          min={0}
          step={5000}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="space-y-2">
          {JEWELRY_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleArrayFilter('categories', category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Metals */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Metal Type</Label>
        <div className="space-y-2">
          {METAL_TYPES.map((metal) => (
            <div key={metal} className="flex items-center space-x-2">
              <Checkbox
                id={`metal-${metal}`}
                checked={filters.metals.includes(metal)}
                onCheckedChange={() => toggleArrayFilter('metals', metal)}
              />
              <Label
                htmlFor={`metal-${metal}`}
                className="text-sm font-normal cursor-pointer"
              >
                {metal}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gemstones */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Gemstone</Label>
        <div className="space-y-2">
          {GEMSTONE_TYPES.map((gemstone) => (
            <div key={gemstone} className="flex items-center space-x-2">
              <Checkbox
                id={`gemstone-${gemstone}`}
                checked={filters.gemstones.includes(gemstone)}
                onCheckedChange={() => toggleArrayFilter('gemstones', gemstone)}
              />
              <Label
                htmlFor={`gemstone-${gemstone}`}
                className="text-sm font-normal cursor-pointer"
              >
                {gemstone}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
          data-testid="clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className={className} data-testid="filters-toggle">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 max-h-[calc(100vh-100px)] overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <Card className={`hidden lg:block ${className}`} data-testid="desktop-filters">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </>
  );
}
