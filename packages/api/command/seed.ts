import dotenv from 'dotenv';
import { hashPassword } from '../src/auth';
import { uuid } from '../src/helpers';
import { prisma } from '../src/prisma';

dotenv.config();

export async function seedDatabase(): Promise<void> {
  if (process.env.DEFAULT_PASSWORD == null) throw new Error('Default password not found.');

  const password = await hashPassword(process.env.DEFAULT_PASSWORD);

  await prisma.user
    .create({
      data: { id: uuid(), email: 'test1@test.com', firstName: 'Jozko', lastName: 'Vajda', password }
    })
    .catch(() => {
      const error = `User with email already exists!`;
      console.error(error);
      throw new Error(error);
    });
}
