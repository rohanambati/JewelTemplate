import { 
  users, products, collections, cartItems, wishlistItems, orders, reviews,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Collection, type InsertCollection, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder,
  type Review, type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;

  // Collections
  getCollections(): Promise<Collection[]>;
  getCollection(id: string): Promise<Collection | undefined>;
  getCollectionBySlug(slug: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;

  // Products
  getProducts(filters?: {
    collectionId?: string;
    category?: string;
    metal?: string;
    gemstone?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'popularity' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductRating(productId: string): Promise<void>;

  // Cart
  getCartItems(userId?: string, sessionId?: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId?: string, sessionId?: string): Promise<void>;

  // Wishlist
  getWishlistItems(userId?: string, sessionId?: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string | undefined, sessionId: string | undefined, productId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;

  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Seed data
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        ...(subscriptionId && { stripeSubscriptionId: subscriptionId })
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getCollections(): Promise<Collection[]> {
    return await db.select().from(collections).where(eq(collections.isActive, true)).orderBy(asc(collections.sortOrder));
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection || undefined;
  }

  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.slug, slug));
    return collection || undefined;
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const [newCollection] = await db.insert(collections).values(collection).returning();
    return newCollection;
  }

  async getProducts(filters?: {
    collectionId?: string;
    category?: string;
    metal?: string;
    gemstone?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'popularity' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let conditions = [eq(products.isActive, true)];

    if (filters?.collectionId) {
      conditions.push(eq(products.collectionId, filters.collectionId));
    }
    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.metal) {
      conditions.push(eq(products.metal, filters.metal));
    }
    if (filters?.gemstone) {
      conditions.push(eq(products.gemstone, filters.gemstone));
    }
    if (filters?.minPrice) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }
    if (filters?.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Determine sorting
    let orderByClause;
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          orderByClause = desc(products.createdAt);
          break;
        case 'price-asc':
          orderByClause = asc(products.price);
          break;
        case 'price-desc':
          orderByClause = desc(products.price);
          break;
        case 'rating':
          orderByClause = desc(products.rating);
          break;
        default: // popularity
          orderByClause = desc(products.reviewCount);
      }
    } else {
      orderByClause = desc(products.reviewCount);
    }

    // Get total count
    const totalQuery = await db.select({ count: products.id }).from(products).where(whereClause);
    const total = totalQuery.length;

    // Build the main query
    let query = db.select().from(products).where(whereClause).orderBy(orderByClause);

    // Add pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const productList = await query;
    return { products: productList, total };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return await db.select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.rating), desc(products.reviewCount))
      .limit(limit);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProductRating(productId: string): Promise<void> {
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, productId));
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0 
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    await db.update(products)
      .set({ 
        rating: averageRating.toFixed(1),
        reviewCount: totalReviews 
      })
      .where(eq(products.id, productId));
  }

  async getCartItems(userId?: string, sessionId?: string): Promise<CartItem[]> {
    if (userId) {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
    return [];
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItems = await db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.productId, item.productId),
          item.userId ? eq(cartItems.userId, item.userId) : eq(cartItems.sessionId, item.sessionId!)
        )
      );

    if (existingItems.length > 0) {
      // Update quantity
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: existingItems[0].quantity + item.quantity })
        .where(eq(cartItems.id, existingItems[0].id))
        .returning();
      return updatedItem;
    } else {
      // Create new item
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }
    const [updatedItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId?: string, sessionId?: string): Promise<void> {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  async getWishlistItems(userId?: string, sessionId?: string): Promise<WishlistItem[]> {
    if (userId) {
      return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
    } else if (sessionId) {
      return await db.select().from(wishlistItems).where(eq(wishlistItems.sessionId, sessionId));
    }
    return [];
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db.insert(wishlistItems).values(item).returning();
    return newItem;
  }

  async removeFromWishlist(userId: string | undefined, sessionId: string | undefined, productId: string): Promise<void> {
    if (userId) {
      await db.delete(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
    } else if (sessionId) {
      await db.delete(wishlistItems)
        .where(and(eq(wishlistItems.sessionId, sessionId), eq(wishlistItems.productId, productId)));
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    await this.updateProductRating(review.productId);
    return newReview;
  }

  async seedData(): Promise<void> {
    // Check if data already exists
    const existingCollections = await db.select().from(collections);
    if (existingCollections.length > 0) {
      return; // Data already seeded
    }

    // Seed collections
    const collectionsData = [
      { name: "Emerald Dreams", slug: "emerald-dreams", description: "Enchanting emerald pieces that capture the essence of nature's most precious green gems.", imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", sortOrder: 1 },
      { name: "Timeless Diamonds", slug: "timeless-diamonds", description: "Classic diamond pieces that embody eternal elegance and sophisticated brilliance.", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", sortOrder: 2 },
      { name: "Golden Essence", slug: "golden-essence", description: "Sophisticated gold jewelry that celebrates the warmth and luxury of precious metals.", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", sortOrder: 3 },
      { name: "Sapphire Nights", slug: "sapphire-nights", description: "Deep blue sapphires that capture the mystery and elegance of twilight hours.", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", sortOrder: 4 },
      { name: "Pearl Classics", slug: "pearl-classics", description: "Timeless pearl jewelry representing purity, elegance, and sophisticated charm.", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", sortOrder: 5 },
    ];

    const createdCollections = await Promise.all(
      collectionsData.map(collection => db.insert(collections).values(collection).returning())
    );

    // Seed products
    const productsData = [
      {
        name: "Emerald Cocktail Ring",
        slug: "emerald-cocktail-ring",
        description: "An exquisite statement ring featuring a brilliant emerald center stone surrounded by diamonds. This cocktail ring embodies luxury and sophistication, perfect for special occasions and elegant evenings.",
        shortDescription: "Statement ring featuring a brilliant emerald center stone surrounded by diamonds.",
        price: "104999.00",
        sku: "ECR-001",
        collectionId: createdCollections[0][0].id,
        category: "Rings",
        metal: "White Gold",
        gemstone: "Emerald",
        images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 5,
        rating: "4.8",
        reviewCount: 24,
        materials: "18k White Gold, Natural Emerald, Diamonds",
        craftsmanship: "Handcrafted by master jewelers with attention to detail",
        warranty: "2-year comprehensive warranty"
      },
      {
        name: "Diamond Tennis Bracelet",
        slug: "diamond-tennis-bracelet",
        description: "A classic tennis bracelet featuring a continuous line of round brilliant diamonds. Each diamond is carefully selected for maximum brilliance and fire, creating a timeless piece that complements any outfit.",
        shortDescription: "Continuous line of round brilliant diamonds in an elegant tennis bracelet setting.",
        price: "269999.00",
        sku: "DTB-002",
        collectionId: createdCollections[1][0].id,
        category: "Bracelets",
        metal: "Platinum",
        gemstone: "Diamond",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 3,
        rating: "5.0",
        reviewCount: 18,
        materials: "Platinum, Round Brilliant Diamonds",
        craftsmanship: "Precision-set diamonds with secure clasping mechanism",
        warranty: "Lifetime warranty on setting and craftsmanship"
      },
      {
        name: "Gold Pearl Necklace",
        slug: "gold-pearl-necklace",
        description: "Cultured pearls elegantly strung with a sophisticated gold clasp design. This necklace represents timeless elegance and can be worn for both formal and casual occasions.",
        shortDescription: "Cultured pearls elegantly strung with a sophisticated gold clasp design.",
        price: "71999.00",
        sku: "GPN-003",
        collectionId: createdCollections[2][0].id,
        category: "Necklaces",
        metal: "Yellow Gold",
        gemstone: "Pearl",
        images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 8,
        rating: "4.4",
        reviewCount: 32,
        materials: "18k Yellow Gold, Cultured Freshwater Pearls",
        craftsmanship: "Hand-knotted between each pearl for security",
        warranty: "1-year warranty on clasp and stringing"
      },
      {
        name: "Sapphire Drop Earrings",
        slug: "sapphire-drop-earrings",
        description: "Elegant drop earrings featuring deep blue sapphires with diamond accents. These earrings capture the mystery of twilight and add sophistication to any ensemble.",
        shortDescription: "Blue sapphires with diamond accents in elegant drop earring design.",
        price: "121999.00",
        sku: "SDE-004",
        collectionId: createdCollections[3][0].id,
        category: "Earrings",
        metal: "White Gold",
        gemstone: "Sapphire",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 6,
        rating: "4.7",
        reviewCount: 15,
        materials: "18k White Gold, Natural Blue Sapphires, Diamonds",
        craftsmanship: "Secure lever-back closure with precision setting",
        warranty: "2-year comprehensive warranty"
      },
      {
        name: "Diamond Solitaire Necklace",
        slug: "diamond-solitaire-necklace",
        description: "A timeless brilliant-cut solitaire diamond pendant on a delicate chain. This classic piece represents pure elegance and is perfect for everyday wear or special occasions.",
        shortDescription: "Brilliant-cut solitaire diamond pendant on delicate chain.",
        price: "183999.00",
        sku: "DSN-005",
        collectionId: createdCollections[1][0].id,
        category: "Necklaces",
        metal: "Platinum",
        gemstone: "Diamond",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 4,
        rating: "4.9",
        reviewCount: 28,
        materials: "Platinum, Brilliant-Cut Diamond",
        craftsmanship: "Four-prong setting for maximum light reflection",
        warranty: "Lifetime warranty on setting"
      },
      {
        name: "Gold Chain Bracelet",
        slug: "gold-chain-bracelet",
        description: "A modern chain bracelet with secure lobster clasp. This versatile piece can be worn alone or layered with other bracelets for a contemporary look.",
        shortDescription: "Modern chain bracelet with secure lobster clasp design.",
        price: "54999.00",
        sku: "GCB-006",
        collectionId: createdCollections[2][0].id,
        category: "Bracelets",
        metal: "Yellow Gold",
        gemstone: "",
        images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"],
        stock: 12,
        rating: "4.3",
        reviewCount: 41,
        materials: "18k Yellow Gold",
        craftsmanship: "Machine-finished links with hand-polished lobster clasp",
        warranty: "1-year warranty on clasp mechanism"
      }
    ];

    await Promise.all(
      productsData.map(product => db.insert(products).values(product))
    );
  }
}

export const storage = new DatabaseStorage();
