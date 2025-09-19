import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertCartItemSchema, insertWishlistItemSchema, insertOrderSchema, insertUserSchema, users, wishlistItems } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import passport from "./auth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed data on startup
  await storage.seedData();

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, username, firstName, lastName, phone } = req.body;

      // Validate input
      const signupSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        phone: z.string().optional(),
      });

      const validatedData = signupSchema.parse({ email, password, username, firstName, lastName, phone });

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const existingUsername = await db.select().from(users).where(eq(users.username, validatedData.username)).limit(1);
      if (existingUsername.length > 0) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user
      const newUser = await db.insert(users).values({
        email: validatedData.email,
        password: hashedPassword,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
      }).returning();

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser[0];
      
      res.status(201).json({ 
        message: "User created successfully", 
        user: userWithoutPassword 
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/signin", passport.authenticate('local'), (req, res) => {
    res.json({ 
      message: "Signed in successfully", 
      user: req.user 
    });
  });

  app.post("/api/auth/signout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error signing out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/collections/:slug", async (req, res) => {
    try {
      const collection = await storage.getCollectionBySlug(req.params.slug);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        collectionId,
        category,
        metal,
        gemstone,
        minPrice,
        maxPrice,
        search,
        sortBy,
        page = "1",
        limit = "12"
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters = {
        collectionId: collectionId as string,
        category: category as string,
        metal: metal as string,
        gemstone: gemstone as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        sortBy: sortBy as 'popularity' | 'newest' | 'price-asc' | 'price-desc' | 'rating',
        limit: limitNum,
        offset
      };

      const result = await storage.getProducts(filters);
      res.json({
        products: result.products,
        total: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limitNum)
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      const items = await storage.getCartItems(userId, sessionId);
      // Enrich each cart item with full product details for client consumption
      const itemsWithProduct = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      res.json(itemsWithProduct);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId,
        sessionId: userId ? undefined : sessionId
      });

      const item = await storage.addToCart(validatedData);
      res.json(item);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateCartItem(req.params.id, quantity);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      await storage.clearCart(userId, sessionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Promo code validation
  app.post("/api/promocode/validate", async (req, res) => {
    try {
      const { code } = req.body as { code?: string };
      if (!code) {
        return res.status(400).json({ message: "Promo code is required" });
      }
      const normalized = code.trim().toUpperCase();
      if (normalized === "DIWALI25") {
        return res.json({
          valid: true,
          code: normalized,
          type: "percent",
          value: 25,
          description: "Festival Offer: 25% off on cart subtotal",
        });
      }
      return res.status(400).json({ valid: false, message: "Invalid or expired promo code" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      const items = await storage.getWishlistItems(userId, sessionId);

      // Enrich items with product details
      const enriched = await Promise.all(
        items.map(async (item: any) => {
          try {
            const product = await storage.getProduct(item.productId);
            return { ...item, product };
          } catch {
            return { ...item, product: undefined };
          }
        })
      );

      res.json(enriched);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      
      // Require authentication: favourites must be tied to the signed-in user
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const validatedData = insertWishlistItemSchema.parse({
        ...req.body,
        userId,
        sessionId: undefined,
      });

      // Prevent duplicates for the same user/product
      const existing = await db
        .select()
        .from(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, validatedData.productId)));

      let item;
      if (existing.length > 0) {
        item = existing[0];
      } else {
        item = await storage.addToWishlist(validatedData);
      }

      // Enrich with product data
      const product = await storage.getProduct(item.productId);
      res.json({ ...item, product });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.issues });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      await storage.removeFromWishlist(userId, sessionId, req.params.productId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paise for INR
        currency: "inr",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Orders route
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after successful order
      const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
      const userId = (req as any).user?.id;
      await storage.clearCart(userId, sessionId);
      
      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reviews routes
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
