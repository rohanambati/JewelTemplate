import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Configure passport local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Use email as username
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (user.length === 0) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user[0].password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user[0];
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (user.length === 0) {
      return done(null, false);
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user[0];
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});

export default passport;
