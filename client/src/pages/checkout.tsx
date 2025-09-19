import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

// Load Stripe
const stripePromise = loadStripe("pk_test_51S6rKgLR42FfBY3TBQlxMKV3W0T6WeAcgyMM5Q7mPskxwWy6zIiJKOq15kTeAQ7JKl681YrFTT9k0m40vyABZz7100JwQTcSSq");

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Please enter a valid pincode"),
  country: z.string().default("India"),
  sameAsBilling: z.boolean().default(true),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingPincode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, totalAmount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "India",
      sameAsBilling: true,
    },
  });

  const subtotal = totalAmount;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        email: data.email,
        total: total.toString(),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shippingCost.toString(),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.sameAsBilling ? data.address : (data.shippingAddress || data.address),
          city: data.sameAsBilling ? data.city : (data.shippingCity || data.city),
          state: data.sameAsBilling ? data.state : (data.shippingState || data.state),
          pincode: data.sameAsBilling ? data.pincode : (data.shippingPincode || data.pincode),
          country: data.sameAsBilling ? data.country : (data.shippingCountry || data.country),
          phone: data.phone,
        },
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          phone: data.phone,
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.product?.name || '',
          price: item.product?.price || '0',
          quantity: item.quantity,
          variant: item.variant,
        })),
      };

      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const order = await orderResponse.json();

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order_id=${order.id}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Payment successful - cart will be cleared by the backend
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      });

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} data-testid="email-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} data-testid="firstName-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} data-testid="lastName-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} data-testid="phone-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                <h3 className="text-lg font-semibold">Billing Address</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} data-testid="address-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} data-testid="city-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} data-testid="state-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" {...field} data-testid="pincode-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sameAsBilling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="same-as-billing"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Shipping address same as billing address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Separator />
                <h3 className="text-lg font-semibold flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Payment Information
                </h3>
                
                <div className="p-4 border border-border rounded-lg">
                  <PaymentElement />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-accent"
                  size="lg"
                  disabled={!stripe || isProcessing}
                  data-testid="place-order"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    `Place Order • ${CURRENCY_SYMBOL}${total.toLocaleString()}`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={
                      Array.isArray(item.product.images) && item.product.images.length > 0
                        ? item.product.images[0]
                        : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {CURRENCY_SYMBOL}{parseFloat(item.product.price).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-medium">
                    {CURRENCY_SYMBOL}{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
            </div>

            {/* Security Notice */}
            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex items-center mb-2">
                <Lock className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium">Secure Checkout</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    // Create PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const subtotal = totalAmount;
        const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 200;
        const tax = subtotal * 0.18;
        const total = subtotal + shippingCost + tax;

        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: total 
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [items, totalAmount]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-3 text-muted-foreground">Loading checkout...</span>
          </div>
        </div>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#0A0A0A',
        colorText: '#FAFAFA',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, sans-serif',
      },
    },
  };

  return (
    <div className="min-h-screen pt-8" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your order securely</p>
          </div>
          <Link href="/cart">
            <Button variant="outline" data-testid="back-to-cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <Elements stripe={stripePromise} options={stripeOptions}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
