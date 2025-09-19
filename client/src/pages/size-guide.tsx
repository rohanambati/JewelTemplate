import { Link } from "wouter";
import { Ruler, Gem, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SizeGuide() {
  return (
    <div className="min-h-screen pt-8" data-testid="size-guide-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Size Guide</h1>
            <p className="text-muted-foreground">Find your perfect fit for rings, bracelets, and necklaces</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Ring Size */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gem className="h-5 w-5 mr-2 text-primary" />
              Ring Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              • Wrap a strip of paper around the base of your finger. Mark where the ends meet and measure the length in mm.
            </p>
            <p>
              • Use the chart below to convert the circumference to the India ring size.
            </p>
            <div className="mt-2 p-4 border border-border rounded-lg text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium text-foreground">Circumference (mm)</div>
                <div className="font-medium text-foreground">Diameter (mm)</div>
                <div className="font-medium text-foreground">Ring Size (India)</div>
                <div>51.8</div>
                <div>16.5</div>
                <div>12</div>
                <div>54.4</div>
                <div>17.3</div>
                <div>14</div>
                <div>57.0</div>
                <div>18.1</div>
                <div>16</div>
                <div>59.5</div>
                <div>18.9</div>
                <div>18</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bracelet Size */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ruler className="h-5 w-5 mr-2 text-primary" />
              Bracelet Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              • Measure your wrist just above the wrist bone. Add 1.5–2 cm for comfort.
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium text-foreground">Wrist (cm)</div>
              <div className="font-medium text-foreground">Bracelet Size</div>
              <div>14–15</div>
              <div>Small</div>
              <div>16–17</div>
              <div>Medium</div>
              <div>18–19</div>
              <div>Large</div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Tips for Accurate Sizing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Measure at the end of the day when your fingers are largest.</p>
            <p>• Avoid measuring when hands are cold; sizes may be smaller.</p>
            <p>• If you’re between sizes, choose the larger size for comfort.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
