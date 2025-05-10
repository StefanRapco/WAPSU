import { MutationUserUpdateArgs, User } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { userProfileUpdatedEmail } from '../email/userProfileUpdated';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toUserSchema } from './mapping/toUserMapping';

export async function userUpdateResolver(
  _,
  { input }: MutationUserUpdateArgs,
  { identity }: InvocationContext
): Promise<User> {
  // Get the user before update to track changes
  const oldUser = await prisma.user.findUniqueOrThrow({
    where: { id: input.id },
    select: {
      firstName: true,
      lastName: true,
      title: true,
      phoneNumber: true,
      address: true,
      individualNotifications: true,
      teamNotifications: true,
      email: true
    }
  });

  const user = await prisma.user.update({
    where: { id: input.id },
    data: {
      firstName: input.firstName ?? undefined,
      lastName: input.lastName ?? undefined,
      title: input.title ?? undefined,
      phoneNumber: input.phoneNumber ?? undefined,
      address: input.address ?? undefined,
      individualNotifications: input.individualNotifications ?? undefined,
      teamNotifications: input.teamNotifications ?? undefined
    }
  });

  // Track changes for notification
  const changes: string[] = new Array();
  if (input.firstName && input.firstName !== oldUser.firstName)
    changes.push(`First name changed to "${input.firstName}"`);
  if (input.lastName && input.lastName !== oldUser.lastName)
    changes.push(`Last name changed to "${input.lastName}"`);
  if (input.title && input.title !== oldUser.title)
    changes.push(`Title changed to "${input.title}"`);
  if (input.phoneNumber && input.phoneNumber !== oldUser.phoneNumber)
    changes.push('Phone number updated');
  if (input.address && input.address !== oldUser.address) changes.push('Address updated');
  if (
    input.individualNotifications !== undefined &&
    input.individualNotifications !== oldUser.individualNotifications
  ) {
    changes.push(
      `Individual notifications ${input.individualNotifications ? 'enabled' : 'disabled'}`
    );
  }
  if (
    input.teamNotifications !== undefined &&
    input.teamNotifications !== oldUser.teamNotifications
  ) {
    changes.push(`Team notifications ${input.teamNotifications ? 'enabled' : 'disabled'}`);
  }

  // Send notification if there are changes
  if (changes.length > 0) {
    await sendEmail({
      htmlContent: userProfileUpdatedEmail({
        userFirstName: user.firstName,
        changes: changes.join('\n')
      }),
      subject: 'Your DoSync profile has been updated',
      to: [oldUser.email]
    });
  }

  return toUserSchema(user);
}
