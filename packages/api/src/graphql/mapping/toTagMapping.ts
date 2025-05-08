import { Tag as TagSchema } from '@app/frontend/src/gql-generated/graphql';
import { Tag } from '@prisma/client';
import { prisma } from '../../prisma';
import { toTaskSchema } from './toTaskMapping';
import { toTeamSchema } from './toTeamMapping';
import { toUserSchema } from './toUserMapping';

export function toTagSchema(props: Tag): TagSchema {
  return {
    id: props.id,
    name: props.name,
    // @ts-expect-error
    team: async () => {
      if (props.teamId == null) return null;
      const team = await prisma.team.findUniqueOrThrow({
        where: { id: props.teamId }
      });
      return toTeamSchema(team);
    },
    // @ts-expect-error
    user: async () => {
      if (props.userId == null) return null;
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: props.userId }
      });
      return toUserSchema(user);
    },
    // @ts-expect-error
    tasks: async () => {
      const tasks = await prisma.task.findMany({
        where: { tags: { some: { tagId: props.id } } },
        include: {
          assignees: true,
          tags: true,
          comments: true,
          checklist: true
        },
        orderBy: { sortOrder: 'asc' }
      });
      return tasks.map(toTaskSchema);
    }
  };
}
