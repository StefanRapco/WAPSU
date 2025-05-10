import { PrismaClient, User as PrismaUser } from '@prisma/client';
// import { UserService as IUserService } from '../../../../api/src/types/services';

interface IUserService {
  createUser: (data: any) => Promise<Omit<PrismaUser, 'password'>>;
}

export class UserService implements IUserService {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    mfa?: string | null;
    title?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    status?: 'active' | 'archived' | 'invited';
    systemRole?: 'admin' | 'user';
    individualNotifications?: boolean;
    teamNotifications?: boolean;
  }): Promise<Omit<PrismaUser, 'password'>> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        status: data.status || 'active',
        systemRole: data.systemRole || 'user',
        individualNotifications: data.individualNotifications ?? true,
        teamNotifications: data.teamNotifications ?? true
      } as any
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<Omit<PrismaUser, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
