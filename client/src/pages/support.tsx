import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const faqs = [
  {
    id: "1",
    category: "Orders",
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the courier's website.",
  },
  {
    id: "2",
    category: "Orders",
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 24 hours of placement. After this time, orders are processed and cannot be changed. Please contact our support team immediately if you need to make changes.",
  },
  {
    id: "3",
    category: "Shipping",
    question: "What are your shipping options?",
    answer: "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping is available on orders over ₹5,000. All jewelry is shipped with insurance and signature confirmation.",
  },
  {
    id: "4",
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We are working on expanding our international shipping options and will update our customers when available.",
  },
  {
    id: "5",
    category: "Returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return policy. Items must be in original condition with all packaging and certificates. Custom or personalized items cannot be returned unless defective.",
  },
  {
    id: "6",
    category: "Returns",
    question: "How do I initiate a return?",
    answer: "Contact our customer service team with your order number and reason for return. We'll provide you with a prepaid return label and instructions for sending the item back.",
  },
  {
    id: "7",
    category: "Product Care",
    question: "How should I care for my jewelry?",
    answer: "Store jewelry in a cool, dry place away from direct sunlight. Clean with a soft cloth and avoid exposure to chemicals, perfumes, and lotions. Professional cleaning is recommended annually for diamonds and precious metals.",
  },
  {
    id: "8",
    category: "Product Care",
    question: "Do you provide certificates for your jewelry?",
    answer: "Yes, all our diamond and precious gemstone jewelry comes with certification from recognized gemological institutes. Gold jewelry includes purity certificates.",
  },
  {
    id: "9",
    category: "Warranty",
    question: "What warranty do you offer?",
    answer: "We provide a 2-year comprehensive warranty covering manufacturing defects. This includes free repairs for issues not caused by normal wear and tear or misuse.",
  },
  {
    id: "10",
    category: "Warranty",
    question: "Does the warranty cover damage?",
    answer: "The warranty covers manufacturing defects but does not cover damage from accidents, misuse, or normal wear and tear. We do offer repair services for damaged items at competitive rates.",
  },
];

const categories = ["All", "Orders", "Shipping", "Returns", "Product Care", "Warranty"];

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // In a real app, this would send the form data to your backend
      console.log("Form submitted:", data);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-8" data-testid="support-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Customer Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">
                Speak with our customer service team
              </p>
              <a href="tel:+919876543210" className="text-primary hover:text-accent font-medium">
                +91 98765 43210
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Mon-Sat, 9 AM - 7 PM IST
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">
                Send us a detailed message
              </p>
              <a href="mailto:support@tercesjewellery.com" className="text-primary hover:text-accent font-medium">
                support@tercesjewellery.com
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Response within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Chat with us instantly
              </p>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-accent font-medium"
              >
                Start Chat
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Mon-Sat, 9 AM - 7 PM IST
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>

            {/* Search and Filter */}
            <div className="space-y-4 mb-8">
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                data-testid="faq-search"
              />
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`category-${category.toLowerCase()}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary" className="mt-1">
                        {faq.category}
                      </Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No FAQs found matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Contact Us</CardTitle>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Send us a message and we'll get back to you soon.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} data-testid="contact-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} data-testid="contact-email" />
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
                              <SelectTrigger data-testid="contact-subject">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="order-inquiry">Order Inquiry</SelectItem>
                              <SelectItem value="product-question">Product Question</SelectItem>
                              <SelectItem value="shipping-issue">Shipping Issue</SelectItem>
                              <SelectItem value="return-request">Return Request</SelectItem>
                              <SelectItem value="warranty-claim">Warranty Claim</SelectItem>
                              <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
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
                              placeholder="Please describe your inquiry in detail..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-accent"
                      data-testid="send-message"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Store Policies */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Store Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Shipping Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over ₹5,000. Standard delivery 3-5 days, express 1-2 days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Return Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day hassle-free returns. Items must be in original condition.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Warranty</h4>
                  <p className="text-sm text-muted-foreground">
                    2-year comprehensive warranty on all jewelry against manufacturing defects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
