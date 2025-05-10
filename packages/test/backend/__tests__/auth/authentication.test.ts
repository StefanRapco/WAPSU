import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';
// import { prismaMock } from '../setup';

const prismaMock = {} as any;

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Authentication Service', () => {
  const authService = new AuthService(prismaMock);

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await authService.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should verify password correctly', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.verifyPassword(password, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('JWT Operations', () => {
    it('should generate valid JWT token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'user'
      };

      const token = 'generated.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = authService.generateToken(user);

      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    });

    it('should verify JWT token', () => {
      const token = 'valid.jwt.token';
      const decoded = {
        id: '1',
        email: 'test@example.com',
        role: 'user'
      };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = authService.verifyToken(token);

      expect(result).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid.token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken(token)).toThrow('Invalid token');
    });
  });
});
