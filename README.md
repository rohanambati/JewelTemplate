# JewelTemplate 💎

A modern, full-stack e-commerce jewelry store built with React, Node.js, Express, and PostgreSQL. This template provides a complete foundation for luxury jewelry retailers.

![JewelTemplate](https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400)

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse jewelry by collections, categories, metals, and gemstones
- **Shopping Cart**: Add/remove items with persistent session storage
- **Wishlist**: Save favorite items for later
- **Product Search**: Advanced filtering and search capabilities
- **Product Reviews**: Customer rating and review system

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing
- **Order Management**: Complete order tracking and management

### 🎨 User Experience
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Performance Optimized**: Fast loading with Vite and optimized queries
- **SEO Friendly**: Proper meta tags and structured data

### 🔒 Security & Admin
- **User Authentication**: Secure login and registration
- **Session Management**: Secure session handling
- **Database Security**: Protected against SQL injection
- **Environment Variables**: Secure configuration management

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust database
- **Stripe** - Payment processing
- **Passport** - Authentication middleware

### Database
- **PostgreSQL** - Primary database
- **Neon** - Serverless PostgreSQL hosting
- **Drizzle Kit** - Database migrations and management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/JewelTemplate.git
   cd JewelTemplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NODE_ENV=development
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
JewelTemplate/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # Global styles
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── db.ts              # Database connection
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── migrations/            # Database migrations
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## 🎯 Usage

### Adding Products
Products are managed through the database. Use the seeded data as examples or extend the admin functionality.

### Customizing Design
- Modify `tailwind.config.js` for theme customization
- Update components in `client/src/components/`
- Customize pages in `client/src/pages/`

### Payment Setup
1. Create a Stripe account
2. Get your API keys from Stripe Dashboard
3. Update the `STRIPE_SECRET_KEY` in your environment variables
4. Configure webhooks for production

### Database Management
- Use Drizzle Studio for visual database management
- Modify `shared/schema.ts` for schema changes
- Run `npm run db:push` to apply changes

## 🌟 Key Features Explained

### Product Management
- Hierarchical collections system
- Flexible product variants (size, metal, gemstone)
- Image gallery support
- SEO-optimized product pages

### Shopping Experience
- Persistent cart across sessions
- Real-time inventory tracking
- Advanced search and filtering
- Wishlist functionality

### Payment Processing
- Secure Stripe integration
- Multiple payment methods
- Order confirmation and tracking
- Automated email receipts

## 🚀 Deployment

### Environment Setup
1. Set up a PostgreSQL database (recommended: Neon, Supabase, or Railway)
2. Get Stripe API keys
3. Configure environment variables for production

### Deploy Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Deploy with continuous integration
- **Railway**: Full-stack deployment with database included
- **Heroku**: Traditional cloud platform deployment

### Production Checklist
- [ ] Set up production database
- [ ] Configure Stripe webhook endpoints  
- [ ] Set up SSL certificates
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Payment processing by [Stripe](https://stripe.com/)

## 📞 Support

For support, email support@example.com or join our Slack channel.

---

**Built with ❤️ for jewelry retailers worldwide**