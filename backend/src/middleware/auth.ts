import { Request, Response, NextFunction } from 'express';
import { Role, Profile } from '@prisma/client';
import prisma from '../config/db';
import { supabaseAdmin } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: Profile;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    // Verify token with Supabase Auth
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      console.error('Supabase auth verification failed:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    // Retrieve database profile linked to auth.users
    const userProfile = await prisma.profile.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!userProfile) {
      return res.status(401).json({ error: 'User profile not found in database.' });
    }

    req.user = userProfile;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
}

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    next();
  };
}
