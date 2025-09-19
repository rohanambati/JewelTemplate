import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Shop", href: "/shop" },
  { name: "Offers", href: "/offers" },
  { name: "Support", href: "/support" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, signout } = useAuth();

  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" data-testid="logo-link">
            <h1 className="text-2xl font-serif font-semibold text-primary tracking-wide">
              Terces Jewellery
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors duration-200 font-medium ${
                    location === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Search jewelry..."
                    className="w-64 bg-input"
                    autoFocus
                    data-testid="search-input"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                    data-testid="search-close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Search"
                  data-testid="search-toggle"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" data-testid="wishlist-link">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary relative"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 p-0 flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Account"
                    data-testid="account-button"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" data-testid="cart-link">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 p-0 flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-muted-foreground hover:text-primary"
                  aria-label="Menu"
                  data-testid="mobile-menu-toggle"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-lg font-medium transition-colors duration-200 ${
                        location === item.href
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t border-border">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="text-sm">
                          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                          <div className="text-muted-foreground">{user?.email}</div>
                        </div>
                        <div className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start">
                            Profile
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            Orders
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" onClick={handleSignout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/signin" className="block">
                          <Button variant="ghost" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup" className="block">
                          <Button className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
