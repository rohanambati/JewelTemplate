import { Link } from "wouter";
import { ArrowLeft, Cookie, Settings, Eye, BarChart3, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Cookies() {
  return (
    <div className="min-h-screen pt-8" data-testid="cookies-page">
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
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              This Cookie Policy explains how Terces Jewellery uses cookies and similar technologies when you visit our website. 
              We use cookies to enhance your browsing experience, analyze website traffic, and provide personalized content.
            </p>
          </CardContent>
        </Card>

        {/* What Are Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cookie className="h-5 w-5 text-primary" />
              <span>What Are Cookies?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are stored on your device when you visit a website. They help websites 
              remember information about your visit, such as your preferences and login status, making your next visit 
              easier and the site more useful to you.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Cookies do not contain any information that personally identifies you, 
                but personal information that we store about you may be linked to the information stored in cookies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Essential Cookies */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Essential Cookies</h3>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Required</Badge>
              </div>
              <p className="text-green-700 mb-3">
                These cookies are necessary for the website to function properly and cannot be disabled.
              </p>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• Authentication and security</li>
                <li>• Shopping cart functionality</li>
                <li>• Form submission and validation</li>
                <li>• Load balancing and performance</li>
              </ul>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Analytics Cookies</h3>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-800">Optional</Badge>
              </div>
              <p className="text-blue-700 mb-3">
                These cookies help us understand how visitors interact with our website.
              </p>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Website usage statistics</li>
                <li>• Popular pages and products</li>
                <li>• User journey analysis</li>
                <li>• Performance optimization</li>
              </ul>
            </div>

            {/* Functional Cookies */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">Functional Cookies</h3>
                </div>
                <Badge variant="outline" className="border-purple-300 text-purple-800">Optional</Badge>
              </div>
              <p className="text-purple-700 mb-3">
                These cookies enable enhanced functionality and personalization.
              </p>
              <ul className="space-y-1 text-purple-700 text-sm">
                <li>• Language and region preferences</li>
                <li>• Wishlist and favorites</li>
                <li>• Recently viewed products</li>
                <li>• Customized user experience</li>
              </ul>
            </div>

            {/* Marketing Cookies */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-800">Marketing Cookies</h3>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-800">Optional</Badge>
              </div>
              <p className="text-orange-700 mb-3">
                These cookies are used to deliver relevant advertisements and track campaign effectiveness.
              </p>
              <ul className="space-y-1 text-orange-700 text-sm">
                <li>• Personalized advertisements</li>
                <li>• Social media integration</li>
                <li>• Retargeting campaigns</li>
                <li>• Marketing performance tracking</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Third-Party Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use trusted third-party services that may set their own cookies:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Helps us understand website usage and improve user experience.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Payment Processors</h4>
                <p className="text-sm text-muted-foreground">
                  Secure payment processing and fraud prevention.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Social Media</h4>
                <p className="text-sm text-muted-foreground">
                  Social sharing buttons and embedded content.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Customer Support</h4>
                <p className="text-sm text-muted-foreground">
                  Live chat and customer service tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Managing Your Cookie Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Browser Settings</h3>
              <p className="text-muted-foreground mb-3">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• View and delete existing cookies</li>
                <li>• Block cookies from specific websites</li>
                <li>• Block third-party cookies</li>
                <li>• Delete all cookies when you close your browser</li>
                <li>• Receive notifications when cookies are set</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Browser-Specific Instructions</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Chrome:</p>
                  <p className="text-muted-foreground">Settings → Privacy and Security → Cookies</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Firefox:</p>
                  <p className="text-muted-foreground">Options → Privacy & Security → Cookies</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Safari:</p>
                  <p className="text-muted-foreground">Preferences → Privacy → Cookies</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Edge:</p>
                  <p className="text-muted-foreground">Settings → Site Permissions → Cookies</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Disabling certain cookies may affect website functionality 
                and your user experience. Essential cookies cannot be disabled as they are necessary 
                for the website to function properly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Consent */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              By continuing to use our website, you consent to our use of cookies as described in this policy. 
              You can withdraw your consent at any time by adjusting your browser settings or contacting us directly.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-primary text-primary-foreground hover:bg-accent">
                Accept All Cookies
              </Button>
              <Button variant="outline">
                Manage Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by posting the updated policy on our website.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: privacy@tercesjewellery.com</p>
              <p>Phone: +91 98765 43210</p>
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
          <Link href="/terms">
            <Button variant="outline">
              Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
