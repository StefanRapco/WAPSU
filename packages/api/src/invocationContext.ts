import { Response } from 'express';

interface Identity {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
}

export interface InvocationContext {
  readonly identity: Identity;
  readonly response: Response;
}

export function protectResolvers(resolvers: any, skip: ReadonlyArray<string> = []) {
  const protectedResolvers = Object.entries(resolvers).map(([fieldName, resolver]) => {
    if (skip.includes(fieldName)) return [fieldName, resolver];

    return [
      fieldName,
      (parent, args, context: InvocationContext) => {
        if (context.identity == null) {
          console.error('Unauthorized! No identity found!');
          throw new Error('Unauthorized! No identity found!');
        }
        // @ts-expect-error
        return resolver(parent, args, context);
      }
    ];
  });

  return Object.fromEntries(protectedResolvers);
}
