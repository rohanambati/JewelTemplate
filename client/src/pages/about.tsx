import { Link } from "wouter";
import { Award, Gem, Users, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="min-h-screen pt-8" data-testid="about-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">About Us</h1>
            <p className="text-muted-foreground">Crafting exceptional jewelry since 1985</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Story */}
        <Card className="mb-8">
          <CardContent className="p-6 grid md:grid-cols-2 gap-6">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=900"
              alt="Workshop"
              className="w-full h-72 object-cover rounded-lg"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vishwanath Jewellers was founded with a vision to blend timeless elegance with modern design. Each piece is
                handcrafted by master artisans, using ethically sourced materials and meticulous attention to detail.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From concept to creation, our design philosophy centers around creating meaningful pieces that celebrate
                life's most cherished moments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gem className="h-5 w-5 mr-2 text-primary" />
                Craftsmanship
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Handcrafted precision with a focus on longevity, comfort, and beauty.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Ethics & Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Responsibly sourced gemstones and recycled precious metals where possible.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Quality Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Every piece undergoes rigorous quality checks and comes with warranty support.
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Our Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We are a team of designers, gemologists, and craftspeople who share a love for jewelry and a commitment to
              excellence.
            </p>
            <Separator />
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="p-4 border border-border rounded-lg">Design Studio • Mumbai</div>
              <div className="p-4 border border-border rounded-lg">Goldsmith Workshop • Jaipur</div>
              <div className="p-4 border border-border rounded-lg">Customer Care • Pan-India</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
