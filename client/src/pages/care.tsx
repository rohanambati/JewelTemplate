import { Link } from "wouter";
import { Sparkles, Droplets, Brush, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Care() {
  return (
    <div className="min-h-screen pt-8" data-testid="care-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Jewelry Care</h1>
            <p className="text-muted-foreground">Keep your treasures shining for years to come</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* General Care */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Daily Care Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Put jewelry on last and take off first to avoid contact with cosmetics and perfumes.</p>
            <p>• Remove jewelry before swimming, showering, or exercising.</p>
            <p>• Store separately in soft pouches to avoid scratches and tangling.</p>
          </CardContent>
        </Card>

        {/* Cleaning */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-primary" />
              Cleaning Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Gold & Platinum: Use mild soap and warm water. Pat dry with a lint-free cloth.</p>
            <p>• Diamonds & Sapphires: Soft brush with warm soapy water; avoid harsh chemicals.</p>
            <p>• Pearls: Wipe gently with a damp cloth. Avoid soaking and direct heat.</p>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brush className="h-5 w-5 mr-2 text-primary" />
              Maintenance & Inspection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Periodically check clasps, prongs, and links for wear.</p>
            <p>• Professional cleaning and inspection recommended every 6–12 months.</p>
            <Separator className="my-2" />
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-primary mr-2" />
              Covered issues may be serviced under our warranty policies.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
