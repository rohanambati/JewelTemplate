import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      // In a real app, this would send the form data to your backend
      console.log("Inquiry submitted:", data);
      
      toast({
        title: "Inquiry sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-8" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visit our store, call us, or send us a message. We're here to help you find the perfect jewelry.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Visit Our Store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Terces Jewellery Flagship Store</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    123 Jewelry Street, Bandra West<br />
                    Mumbai, Maharashtra 400050<br />
                    India
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">+91 98765 43210</p>
                      <p className="text-sm text-muted-foreground">Main Store</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">hello@tercesjewellery.com</p>
                      <p className="text-sm text-muted-foreground">General Inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">WhatsApp Support</p>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Store Hours</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                        <p>Sunday: 11:00 AM - 7:00 PM</p>
                        <p className="text-xs">*Extended hours during festivals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embedded Map */}
            <Card>
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  {/* In a real app, you would embed a Google Maps iframe here */}
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Interactive map would be embedded here
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-accent underline text-sm"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a href="tel:+919876543210">
                <Button variant="outline" className="w-full h-auto py-4 flex-col space-y-2">
                  <Phone className="h-6 w-6" />
                  <span>Call Now</span>
                </Button>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full h-auto py-4 flex-col space-y-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Send Us an Inquiry</CardTitle>
                <p className="text-muted-foreground">
                  Have questions about our jewelry or need assistance? We'd love to hear from you.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="inquiry-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} data-testid="inquiry-email" />
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
                            <Input placeholder="+91 98765 43210" {...field} data-testid="inquiry-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="inquiry-subject">
                                <SelectValue placeholder="What can we help you with?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
                              <SelectItem value="custom-design">Custom Design</SelectItem>
                              <SelectItem value="store-visit">Store Visit</SelectItem>
                              <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                              <SelectItem value="repair-service">Repair Service</SelectItem>
                              <SelectItem value="certification">Certification Query</SelectItem>
                              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                              <SelectItem value="media-press">Media & Press</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="inquiry-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-accent"
                      size="lg"
                      data-testid="send-inquiry"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Why Choose Terces Jewellery?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">✨ Premium Quality</h4>
                    <p className="text-muted-foreground">
                      Handcrafted jewelry with certified gemstones and precious metals.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🎨 Custom Design</h4>
                    <p className="text-muted-foreground">
                      Personalized jewelry design services to bring your vision to life.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🛡️ Lifetime Support</h4>
                    <p className="text-muted-foreground">
                      Comprehensive warranty and after-sales service for all purchases.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🏆 Trusted Brand</h4>
                    <p className="text-muted-foreground">
                      Over 35 years of excellence in jewelry craftsmanship and service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Business Profile CTA */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Visit Our Google Business Profile
            </h3>
            <p className="text-muted-foreground mb-6">
              Read reviews from our satisfied customers and get directions to our store.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://business.google.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="google-business-link"
              >
                View on Google Business
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
