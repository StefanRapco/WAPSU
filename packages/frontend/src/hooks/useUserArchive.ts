import { useMutation } from '@apollo/client';
import { gql } from '../gql-generated/gql';

export function useUserArchive() {
  const [archiveUser, { loading, error }] = useMutation(userArchiveMutation);

  return {
    archiveUser: (userId: string) =>
      archiveUser({
        variables: {
          input: {
            userId
          }
        }
      }),
    loading,
    error
  };
}

const userArchiveMutation = gql(`
  mutation UserArchive($input: UserArchiveInput!) {
    userArchive(input: $input) {
      id
      firstName
      lastName
      fullName
      email
      systemRole {
        label
        value
      }
    }
  }
`);
