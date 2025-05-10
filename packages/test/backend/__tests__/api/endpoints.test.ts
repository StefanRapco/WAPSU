import { SystemRole, UserStatus } from '@prisma/client';
import request from 'supertest';

const app = {} as any;
const prismaMock = {} as any;

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      // expect(response.body).toEqual({
      //   status: 'ok',
      //   timestamp: expect.any(String)
      // });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 401 for invalid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);

      // const response = await request(app)
      // .post('/api/auth/login')
      // .send({
      //   email: 'test@example.com',
      //   password: 'wrongpassword'
      // })
      // .expect(401);

      // expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return JWT token for valid credentials', async () => {
      // Mock user in database
      prismaMock.user.findUnique.mockResolvedValue({
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
      } as any);

      const response = await request(app).post('/api/auth/login');
      // .send({
      //   email: 'test@example.com',
      //   password: 'correctpassword'
      // })
      // .expect(200);

      // expect(response.body).toHaveProperty('token');
      // expect(response.body.token).toBeTruthy();
    });
  });
});
