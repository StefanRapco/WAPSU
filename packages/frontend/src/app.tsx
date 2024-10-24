import { ApolloClient, ApolloProvider, gql, useQuery } from '@apollo/client';
import React from 'react';

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
  const { data, loading } = useQuery(query, { variables: { id: '1' } });

  if (loading) return <>loading</>;

  return <>{data.userOne.id}</>;
}

const query = gql`
  query IDK($id: ID!) {
    userOne(id: $id) {
      id
    }
  }
`;
