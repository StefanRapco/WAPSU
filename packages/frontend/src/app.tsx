import { ApolloClient, ApolloProvider, useQuery } from '@apollo/client';
import { gql } from './gql-generated/gql';
import { useIdentity } from './hooks/useIdentity';

interface AppProps {
  readonly apollo: ApolloClient<any>;
}

export function App(props: AppProps) {
  return (
    <ApolloProvider client={props.apollo}>
      <UserOne />
    </ApolloProvider>
  );
}

function UserOne() {
  const { identity } = useIdentity();

  if (identity == null) return <>NOT LOGGED IN</>;

  const { data } = useQuery(query, { variables: { id: 'gOwvk7rRRdeZtnq4XxDJWQ' } });

  if (data == null) return <>loading</>;

  return (
    <div>
      ID: {data.userOne.id} &nbsp; FirstName: {data.userOne.firstName} &nbsp; LastName:{' '}
      {data.userOne.lastName}
    </div>
  );
}

const query = gql(`
  query GetUser($id: ID!) {
    userOne(id: $id) {
      id
      firstName
      lastName
    }
  }
`);
