import { ApolloClient, ApolloProvider, useQuery } from '@apollo/client';
import { gql } from './gql-generated/gql';

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
  const { data } = useQuery(query, { variables: { id: '1' } });

  if (data == null) return <>loading</>;

  return (
    <>
      {data.userOne.id}
      {data.userOne.firstName}
      {data.userOne.lastName}
    </>
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
