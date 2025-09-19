import { Link } from "wouter";
import { ShieldCheck, Wrench, Clock, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Warranty() {
  return (
    <div className="min-h-screen pt-8" data-testid="warranty-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Warranty</h1>
            <p className="text-muted-foreground">Peace of mind with every purchase</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Coverage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              What Our Warranty Covers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Manufacturing defects in materials and workmanship</p>
            <p className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Loose stones due to setting issues (within warranty period)</p>
            <p className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Clasp, link, or fastener defects</p>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Warranty Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Most items are covered for 1–2 years depending on the product category. Your invoice will specify the exact term.
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              What Isn't Covered
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Normal wear and tear, scratches, or tarnish</p>
            <p>• Damage due to impact, misuse, or accident</p>
            <p>• Alterations or repairs by unauthorized third parties</p>
            <p>• Loss or theft</p>
          </CardContent>
        </Card>

        {/* Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-primary" />
              How to Request Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Contact support with your order number, photos, and a description of the issue.</p>
            <p>• Our team will assess eligibility and provide next steps within 2–3 business days.</p>
            <Separator className="my-2" />
            <p className="text-sm">Email: support@tercesjewellery.com • Phone: +91 98765 43210</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
