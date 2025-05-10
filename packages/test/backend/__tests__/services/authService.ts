import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { AuthService as IAuthService } from '../../../../api/src/types/services';

interface IAuthService {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
  generateToken: (user: { id: string; email: string; role: string }) => string;
  verifyToken: (token: string) => { id: string; email: string; role: string };
}

export class AuthService implements IAuthService {
  constructor(private prisma: PrismaClient) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as any,
      {
        expiresIn: '1d'
      }
    );
  }

  verifyToken(token: string): { id: string; email: string; role: string } {
    return jwt.verify(token, process.env.JWT_SECRET as any) as {
      id: string;
      email: string;
      role: string;
    };
  }
}
