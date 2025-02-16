import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { User } from '@app/frontend/src/gql-generated/graphql';
import { prisma } from './src/prisma';

export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
type User {
  id: ID!
  firstName: String!
  lastName: String!
}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
   userOne(id: ID!): User!
  }
  type Mutation {
  userUpdate(id: ID!): User!
}
`;

const resolvers = {
  Query: {
    userOne: async (): Promise<User> => {
      const x = await prisma.user.findFirst();

      // await sendEmail({
      //   htmlContent: codeSignInEmail({ code: '42134' }),
      //   subject: 'SignInCodeTest',
      //   to: ['stefanrapco@gmail.com']
      // });

      return { id: '1', firstName: 'Jozko', lastName: 'Ferko' };
    }
  },
  Mutation: {
    userUpdate: () => {
      return { id: '1', firstName: 'Jozko', lastName: 'Ferko' };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.info(`🚀  Server ready at: ${url}`);
