import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

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
    userOne: () => {
      return { id: '2', firstName: '1', lastName: '1' } as any;
    }
  },
  Mutation: {
    userUpdate: () => {
      return { id: '1', firstName: '1', lastName: '1' } as any;
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

console.log(`🚀  Server ready at: ${url}`);
