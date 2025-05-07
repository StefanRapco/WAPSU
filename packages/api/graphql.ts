import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'fs';
import { gql } from 'graphql-tag';
import { verifyToken } from './src/auth';
import { identityResolver } from './src/graphql/identityResolver';
import { identityUpdateResolver } from './src/graphql/identityUpdateResolver';
import { signInCodeCompleteResolver } from './src/graphql/signInCodeCompleteResolver';
import { signInCodeRequestResolver } from './src/graphql/signInCodeRequestResolver';
import { signOutResolver } from './src/graphql/signOutResolver';
import { teamCreateResolver } from './src/graphql/teamCreateResolver';
import { teamEditResolver } from './src/graphql/teamEditResolver';
import { teamManyResolver } from './src/graphql/teamManyResolver';
import { teamOneResolver } from './src/graphql/teamOneResolver';
import { teamUserAddResolver } from './src/graphql/teamUserAddResolver';
import { teamUserEditResolver } from './src/graphql/teamUserEditResolver';
import { userManyResolver } from './src/graphql/userManyResolver';
import { userOneResolver } from './src/graphql/userOneResolver';
import { userUpdateResolver } from './src/graphql/userUpdateResolver';
import { InvocationContext, protectResolvers } from './src/invocationContext';

const typeDefs = gql(fs.readFileSync('./schema.graphql', 'utf8'));

const queries = {
  identity: identityResolver,
  teamOne: teamOneResolver,
  teamMany: teamManyResolver,
  userOne: userOneResolver,
  userMany: userManyResolver
};

const mutations = {
  identityUpdate: identityUpdateResolver,
  signInCodeRequest: signInCodeRequestResolver,
  signInCodeComplete: signInCodeCompleteResolver,
  signOut: signOutResolver,
  teamCreate: teamCreateResolver,
  teamEdit: teamEditResolver,
  teamUserAdd: teamUserAddResolver,
  teamUserEdit: teamUserEditResolver,
  userUpdate: userUpdateResolver
};

const resolvers = {
  Query: protectResolvers(queries, []),
  Mutation: protectResolvers(mutations, ['signInCodeRequest', 'signInCodeComplete'])
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: false,
  csrfPrevention: true
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Start the server
async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({
        req,
        res
      }: {
        req?: Request;
        res?: Response;
      }): Promise<{
        identity: InvocationContext['identity'] | null;
        response: InvocationContext['response'];
      }> => {
        if (req == null) throw new Error('❌ `Request` is undefined in context');
        if (res == null) throw new Error('❌ `Response` is undefined in context');

        const noIdentity = { identity: null, response: res };

        // console.log('🔥 Incoming Request Headers:', req.headers || 'No headers');
        // console.log('🔥 Cookies Received:', req.headers.cookie || 'No cookies');

        if (req.headers.cookie == null) return noIdentity;

        const cookies = cookie.parse(req.headers.cookie);

        if (cookies.auth_token == null) return noIdentity;

        const token = verifyToken(cookies.auth_token);

        return { identity: token, response: res };
      }
    })
  );

  app.listen(4000, () => console.info('🚀 Server running on http://localhost:4000/graphql'));
}

startServer();
