import { Request, Response } from 'express';
import prisma from '../config/db';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, handleCodeforces, handleGithub, handleLinkedin } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    // Create user in Supabase Auth via Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Failed to create authentication account.' });
    }

    // Since the database trigger public.handle_new_user() automatically inserts into public.profiles,
    // we query and update the other optional handles on the newly created Profile record.
    const userProfile = await prisma.profile.update({
      where: { id: authData.user.id },
      data: {
        handleCodeforces,
        handleGithub,
        handleLinkedin,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        category: userProfile.category,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Sign in using Supabase Auth (note: backend admin client can trigger sign-in)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError || !sessionData.session) {
      return res.status(400).json({ error: sessionError?.message || 'Invalid email or password.' });
    }

    // Retrieve database profile
    const userProfile = await prisma.profile.findUnique({
      where: { id: sessionData.user.id },
    });

    if (!userProfile) {
      return res.status(400).json({ error: 'Profile not found in database.' });
    }

    return res.json({
      message: 'Login successful.',
      token: sessionData.session.access_token,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        category: userProfile.category,
        rating: userProfile.rating,
        avatarUrl: userProfile.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  return res.json({ user: req.user });
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    // Sign out the user from Supabase using their token
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await supabaseAdmin.auth.admin.signOut(token);
    }
  } catch {
    // Ignore signout errors — client will clear local token regardless
  }
  return res.json({ message: 'Logged out successfully.' });
}
