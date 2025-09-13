import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-provider";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function Cart() {
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();

  const subtotal = totalAmount;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 200;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-8" data-testid="empty-cart">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our beautiful jewelry collections and add items to your cart.
            </p>
            <Link href="/shop">
              <Button size="lg" data-testid="continue-shopping">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Shopping Cart ({totalItems} items)
          </h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
            data-testid="clear-cart"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            {freeShippingRemaining > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Free Shipping Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {CURRENCY_SYMBOL}{freeShippingRemaining.toLocaleString()} remaining
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Add {CURRENCY_SYMBOL}{freeShippingRemaining.toLocaleString()} more to get free shipping!
                  </p>
                </CardContent>
              </Card>
            )}

            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Link href={`/product/${item.product.slug}`}>
                        <img
                          src={
                            Array.isArray(item.product.images) && item.product.images.length > 0
                              ? item.product.images[0]
                              : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                          }
                          alt={item.product.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:opacity-75 transition-opacity"
                          data-testid={`cart-item-image-${item.id}`}
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="text-lg font-serif font-semibold text-foreground hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.shortDescription}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          {item.product.sku && (
                            <span className="text-muted-foreground">SKU: {item.product.sku}</span>
                          )}
                          {item.product.metal && (
                            <Badge variant="secondary">{item.product.metal}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary">
                            {CURRENCY_SYMBOL}{parseFloat(item.product.price).toLocaleString()}
                          </span>
                          {item.product.compareAtPrice && parseFloat(item.product.compareAtPrice) > parseFloat(item.product.price) && (
                            <span className="text-sm text-muted-foreground line-through">
                              {CURRENCY_SYMBOL}{parseFloat(item.product.compareAtPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 p-0"
                              data-testid={`decrease-quantity-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                              data-testid={`increase-quantity-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-lg font-semibold text-foreground">
                          Total: {CURRENCY_SYMBOL}{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-500 font-medium">Free</span>
                    ) : (
                      `${CURRENCY_SYMBOL}${shippingCost}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>{CURRENCY_SYMBOL}{tax.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{CURRENCY_SYMBOL}{total.toLocaleString()}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter code" className="flex-1" />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-accent" size="lg" data-testid="checkout-button">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button variant="outline" className="w-full" data-testid="continue-shopping-cart">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Trust Indicators */}
                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    Secure checkout with 256-bit SSL
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📦</span>
                    Free shipping on orders over {CURRENCY_SYMBOL}{FREE_SHIPPING_THRESHOLD.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">↩️</span>
                    30-day hassle-free returns
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
