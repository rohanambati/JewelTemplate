import { Link } from "wouter";
import { ArrowLeft, FileText, Scale, CreditCard, Truck, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="min-h-screen pt-8" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to Terces Jewellery. These Terms of Service govern your use of our website and the purchase of our products. 
              By accessing our website or making a purchase, you agree to be bound by these terms and conditions.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Acceptance of Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              By using our website, you confirm that you:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Are at least 18 years old or have parental consent</li>
              <li>• Have the legal capacity to enter into binding agreements</li>
              <li>• Will provide accurate and complete information</li>
              <li>• Will comply with all applicable laws and regulations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Products and Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Products and Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Product Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All jewelry is handcrafted and may have slight variations</li>
                <li>• Product images are for illustration purposes and may vary slightly</li>
                <li>• We reserve the right to modify or discontinue products</li>
                <li>• Availability is subject to stock and may change without notice</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Pricing</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All prices are in Indian Rupees (INR) and include applicable taxes</li>
                <li>• Prices are subject to change without prior notice</li>
                <li>• Special offers and discounts are subject to terms and conditions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Orders and Payment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Orders and Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Order Process</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Orders are subject to acceptance and availability</li>
                <li>• We reserve the right to refuse or cancel orders</li>
                <li>• Order confirmation will be sent via email</li>
                <li>• Processing time is 2-5 business days for most items</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Payment Terms</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Payment is required at the time of order</li>
                <li>• We accept major credit cards, debit cards, and digital wallets</li>
                <li>• All transactions are processed securely through encrypted channels</li>
                <li>• Failed payments may result in order cancellation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Shipping and Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Free shipping on orders over ₹5,000 within India</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Standard delivery takes 3-7 business days</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Express delivery available for select locations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>International shipping available with additional charges</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Risk of loss passes to you upon delivery</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Returns and Exchanges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>Returns and Exchanges</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Return Policy</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 30-day return policy from date of delivery</li>
                <li>• Items must be in original condition with tags and packaging</li>
                <li>• Custom or personalized items are non-returnable</li>
                <li>• Return shipping costs are borne by the customer unless item is defective</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Refund Process</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Refunds will be processed within 7-10 business days</li>
                <li>• Refunds will be credited to the original payment method</li>
                <li>• Shipping charges are non-refundable unless item is defective</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranties */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Warranties and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Product Warranty</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Manufacturing defects covered for 1-2 years depending on product</li>
                <li>• Warranty does not cover normal wear, damage, or misuse</li>
                <li>• Warranty void if item is repaired by unauthorized parties</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h4>
                  <p className="text-amber-700 text-sm">
                    Products are sold "as is" without warranties beyond those expressly stated. 
                    We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All content on this website, including designs, text, graphics, logos, and images, 
              is the property of Terces Jewellery and is protected by copyright and trademark laws.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You may not reproduce, distribute, or modify our content</li>
              <li>• Our jewelry designs are original and protected</li>
              <li>• Unauthorized use may result in legal action</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, Terces Jewellery shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to loss of profits, 
              data, or use, arising out of or relating to your use of our website or products.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting on our website. Your continued use of our services constitutes 
              acceptance of the modified terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: legal@tercesjewellery.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: Mumbai, India</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center py-8">
          <Link href="/privacy">
            <Button variant="outline">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/cookies">
            <Button variant="outline">
              Cookie Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
