import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';

export type Identity = ReturnType<typeof useIdentity>['identity'];

export function useIdentity() {
  const { data, refetch, loading } = useQuery(identityQuery, { fetchPolicy: 'network-only' });

  if (loading) return { identity: undefined, refetch, loading };

  if (data == null) return { identity: null, refetch, loading };

  return { identity: data.identity, refetch, loading };
}

export const identityQuery = gql(`
  query IdentityQuery {
    identity {
      id
      firstName
      lastName
      email
    }
  }
`);
