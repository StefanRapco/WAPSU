import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { hashPassword } from '../src/auth';
import { uuid } from '../src/helpers';
import { Prisma, prisma } from '../src/prisma';

dotenv.config();

export async function seedRandomUsers(count = 20) {
  if (process.env.DEFAULT_PASSWORD == null) throw new Error('Default password not found.');

  const users: Prisma.UserCreateManyInput[] = await Promise.all(
    Array.from({ length: count }, async () => {
      if (process.env.DEFAULT_PASSWORD == null) throw new Error('Default password not found.');
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const password = await hashPassword(process.env.DEFAULT_PASSWORD);

      return {
        id: uuid(),
        firstName,
        lastName,
        email,
        password
      };
    })
  );

  try {
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true
    });

    console.info(`✅ Successfully seeded ${createdUsers.count} random users`);
  } catch (error) {
    console.error('❌ Error seeding random users:', error);
  } finally {
    await prisma.$disconnect();
  }
}
