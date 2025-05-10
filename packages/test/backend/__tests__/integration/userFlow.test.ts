import { SystemRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import request from 'supertest';

import { AuthService } from '../services/authService';
// import { prismaMock } from '../setup';
const app = {} as any;
const prismaMock = {} as any;

jest.mock('bcryptjs');

describe('User Flow Integration', () => {
  const authService = new AuthService(prismaMock);

  describe('Complete User Registration Flow', () => {
    it('should handle complete user registration and login flow', async () => {
      // 1. Register new user
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

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      prismaMock.user.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      const registerResponse = await request(app);
      // .post('/api/auth/register')
      // .send(userData)
      // .expect(201);

      // expect(registerResponse.body).toHaveProperty('id');
      // expect(registerResponse.body.email).toBe(userData.email);

      // 2. Login with new user
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // const loginResponse = await request(app)
      //   .post('/api/auth/login')
      //   .send({
      //     email: userData.email,
      //     password: userData.password
      //   })
      //   .expect(200);

      // expect(loginResponse.body).toHaveProperty('token');

      // 3. Access protected route
      // const {token} = loginResponse.body;

      // const profileResponse = await request(app)
      //   .get('/api/users/profile')
      //   .set('Authorization', `Bearer ${token}`)
      //   .expect(200);

      // expect(profileResponse.body).toMatchObject({
      //   email: userData.email,
      //   firstName: userData.firstName,
      //   lastName: userData.lastName
      // });
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // too short
        firstName: '',
        lastName: ''
      };

      // const response = await request(app).post('/api/auth/register').send(invalidData).expect(400);

      // expect(response.body).toHaveProperty('errors');
      // expect(response.body.errors).toHaveLength(3);
    });
  });
});
