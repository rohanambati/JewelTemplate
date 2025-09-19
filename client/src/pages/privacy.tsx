import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="min-h-screen pt-8" data-testid="privacy-page">
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Terces Jewellery, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase from us.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Name, email address, and phone number</li>
                <li>• Billing and shipping addresses</li>
                <li>• Payment information (processed securely through our payment providers)</li>
                <li>• Account credentials and preferences</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Automatically Collected Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• IP address and browser information</li>
                <li>• Device information and operating system</li>
                <li>• Website usage patterns and preferences</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Process and fulfill your orders, including shipping and customer service</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Communicate with you about your orders, account, and our services</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Improve our website, products, and customer experience</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Send you marketing communications (with your consent)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Prevent fraud and ensure the security of our platform</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span>Comply with legal obligations and resolve disputes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Information Sharing and Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Service Providers:</strong> Trusted partners who assist in operating our website and conducting business</li>
              <li>• <strong>Payment Processors:</strong> Secure payment gateways to process your transactions</li>
              <li>• <strong>Shipping Partners:</strong> Delivery services to fulfill your orders</li>
              <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure servers and databases</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal information on a need-to-know basis</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Access and update your personal information</li>
              <li>• Request deletion of your personal data</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Request a copy of your data</li>
              <li>• Lodge a complaint with relevant authorities</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                privacy@tercesjewellery.com
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                +91 98765 43210
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center py-8">
          <Link href="/terms">
            <Button variant="outline">
              Terms of Service
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
