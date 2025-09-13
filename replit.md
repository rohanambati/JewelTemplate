# Terces Jewellery E-commerce Platform

## Overview

This is a modern, full-stack e-commerce platform for Terces Jewellery, designed to showcase and sell premium jewelry with a focus on luxury and elegance. The application features a sophisticated dark theme with gold accents, comprehensive product management, shopping cart functionality, payment processing through Stripe, and a complete user experience from browsing to checkout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI built with React 18 and TypeScript for type safety
- **Routing**: Client-side routing using Wouter for lightweight navigation
- **UI Framework**: Shadcn/UI components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS for utility-first styling with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe integration for secure payment handling
- **Development Setup**: Vite for development server and build tooling

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **ORM**: Drizzle ORM with type-safe schema definitions in TypeScript
- **Schema Design**: Normalized relational schema with tables for users, products, collections, cart items, wishlist items, orders, and reviews
- **Connection Pooling**: Neon serverless connection pooling for optimal performance

### Authentication and Authorization
- **Session-based Authentication**: Traditional session-based auth with secure HTTP-only cookies
- **User Management**: Complete user registration, login, and profile management
- **Guest Shopping**: Anonymous cart and wishlist functionality using session IDs
- **Stripe Customer Integration**: User accounts linked to Stripe customer records for payment processing

## External Dependencies

### Third-party Services
- **Stripe**: Payment processing and subscription management for secure transactions
- **Neon Database**: Serverless PostgreSQL hosting for scalable data storage
- **Unsplash API**: High-quality jewelry and lifestyle images for product catalogs

### Key Libraries and Frameworks
- **React Query**: Server state management and caching for optimal data fetching
- **Radix UI**: Accessible, unstyled UI primitives for building the design system
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Drizzle ORM**: Type-safe database operations and migrations
- **React Hook Form**: Performant forms with easy validation
- **Zod**: Schema validation for forms and API data
- **Wouter**: Lightweight client-side routing
- **Date-fns**: Date manipulation and formatting utilities