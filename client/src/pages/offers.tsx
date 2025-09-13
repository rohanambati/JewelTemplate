import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Tag, Gift, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product/product-card";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { Product } from "@shared/schema";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  type: 'percentage' | 'fixed';
  minOrderValue: number;
  expiresAt: Date;
  isActive: boolean;
}

export default function Offers() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [couponCode, setCouponCode] = useState("");

  // Mock offers data - in a real app, this would come from an API
  const offers: Offer[] = [
    {
      id: "1",
      title: "DIWALI25",
      description: "Celebrate Diwali with 25% off on all jewelry",
      discount: 25,
      code: "DIWALI25",
      type: "percentage",
      minOrderValue: 10000,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
    {
      id: "2",
      title: "FIRSTBUY",
      description: "First-time buyer special - ₹5000 off",
      discount: 5000,
      code: "FIRSTBUY",
      type: "fixed",
      minOrderValue: 15000,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
    {
      id: "3",
      title: "DIAMOND15",
      description: "15% off on all diamond jewelry",
      discount: 15,
      code: "DIAMOND15",
      type: "percentage",
      minOrderValue: 25000,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isActive: true,
    },
  ];

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured", { limit: 6 }],
  });

  // Countdown timer for the main offer
  useEffect(() => {
    const mainOfferExpiry = offers[0]?.expiresAt;
    if (!mainOfferExpiry) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = mainOfferExpiry.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offers]);

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCouponCode(code);
  };

  const formatDiscount = (offer: Offer) => {
    return offer.type === 'percentage' 
      ? `${offer.discount}% OFF`
      : `${CURRENCY_SYMBOL}${offer.discount.toLocaleString()} OFF`;
  };

  return (
    <div className="min-h-screen pt-8" data-testid="offers-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Special Offers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing deals on our exquisite jewelry collections. Limited time offers you don't want to miss!
          </p>
        </div>

        {/* Hero Offer with Countdown */}
        {offers[0] && (
          <Card className="mb-16 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2 mb-4">
                  <Gift className="h-5 w-5 mr-2" />
                  {formatDiscount(offers[0])}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  {offers[0].title}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {offers[0].description}
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="flex justify-center items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex items-center space-x-3 bg-background/50 rounded-lg px-4 py-3 border border-border">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="font-mono text-lg font-bold">{offers[0].code}</span>
                </div>
                <Button
                  onClick={() => copyCouponCode(offers[0].code)}
                  variant="outline"
                  data-testid={`copy-code-${offers[0].code}`}
                >
                  Copy Code
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                *Minimum order value: {CURRENCY_SYMBOL}{offers[0].minOrderValue.toLocaleString()}
              </p>

              <Link href="/shop">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Other Offers */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
            More Great Offers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {offers.slice(1).map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-primary" />
                      {offer.code}
                    </CardTitle>
                    <Badge className="bg-accent text-accent-foreground">
                      {formatDiscount(offer)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Expires: {offer.expiresAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      <span>Min. order: {CURRENCY_SYMBOL}{offer.minOrderValue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-center">
                      {offer.code}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCouponCode(offer.code)}
                      data-testid={`copy-code-${offer.code}`}
                    >
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coupon Entry Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center">Have a Coupon Code?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                  data-testid="coupon-input"
                />
                <Button variant="outline" data-testid="apply-coupon">
                  Apply
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Enter your coupon code to see if it's still valid and get additional savings!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Featured Products
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Perfect pieces to use your discount codes on
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Never Miss an Offer
            </h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and be the first to know about exclusive deals and promotions.
            </p>
            <div className="max-w-md mx-auto flex space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="bg-primary text-primary-foreground hover:bg-accent">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
