import { SystemRole, UserStatus } from '@prisma/client';
import { UserService } from '../services/userService';
// import { prismaMock } from '../setup';

const prismaMock = {} as any;

describe('Database Operations', () => {
  const userService = new UserService(prismaMock);

  describe('User Operations', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        mfa: null,
        title: null,
        phoneNumber: null,
        address: null,
        status: UserStatus.active,
        systemRole: SystemRole.user,
        individualNotifications: true,
        teamNotifications: true
      };

      prismaMock.user.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      const user = await userService.createUser(userData);

      expect(user).toMatchObject({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      expect(user).not.toHaveProperty('password');
    });

    it('should find user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        mfa: null,
        title: null,
        phoneNumber: null,
        address: null,
        status: UserStatus.active,
        systemRole: SystemRole.user,
        individualNotifications: true,
        teamNotifications: true
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const user = await userService.findByEmail('test@example.com');

      expect(user).toMatchObject({
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName
      });
    });

    it('should handle user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);

      await expect(userService.findByEmail('nonexistent@example.com')).rejects.toThrow(
        'User not found'
      );
    });
  });
});
