import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET = process.env.JWT_SECRET;

// 🔹 Hash password before storing in the database
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// 🔹 Compare hashed password with user input
export function isCorrectPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 🔹 Generate JWT token
export function generateToken(props: { id: string; email: string; fullName: string }) {
  if (SECRET == null) throw new Error('Error while generating JWT token');

  return jwt.sign({ id: props.id, email: props.email, fullName: props.fullName }, SECRET, {
    expiresIn: '7d'
  }); // 7-day expiration
}

// 🔹 Verify JWT token (for checking logged-in user)
export function verifyToken(token: string) {
  if (SECRET == null) throw new Error('Error while verifying JWT token');

  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; fullName: string };
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('auth_token', token, {
    httpOnly: true, // Prevents JavaScript access (protects from XSS attacks)
    secure: false, // Ensures HTTPS-only in production // should be TRUE IN PROD;
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration: 7 days
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: false, // SHOULD BE TRUE IN PROD; process.env.isProd;
    sameSite: 'strict'
  });
}
