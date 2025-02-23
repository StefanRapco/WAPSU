import {
  ApolloClient,
  ApolloProvider,
  ApolloQueryResult,
  useMutation,
  useQuery
} from '@apollo/client';
import { Button, CircularProgress, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { gql } from './gql-generated/gql';
import { IdentityQueryQuery } from './gql-generated/graphql';
import { Identity, useIdentity } from './hooks/useIdentity';
import { useModeContext } from './modeContext';
import { SignIn } from './pages/signIn';
import { useTheme } from './theme';

interface AppProps {
  readonly apollo: ApolloClient<any>;
}

export function App(props: AppProps) {
  const [{ mode }] = useModeContext();
  const theme = useTheme({ mode });

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={props.apollo}>
        <Router>
          <Routes>
            <Route
              path="/sign-in"
              element={
                <RedirectHomeIfSignedIn>
                  <SignIn />
                </RedirectHomeIfSignedIn>
              }
            />
            <Route path="/*" element={<ProtectedRoutesParent mode={mode} />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  );
}

function ProtectedRoutesParent(props: { mode: 'light' | 'dark' }) {
  const { identity, loading, refetch } = useIdentity();

  if (loading) return <CircularProgress size="40px" />;

  if (identity == null) return <Navigate to="/sign-in" />;

  return (
    <ProtectedRoutes mode={props.mode} identity={identity} refetchIdentity={() => refetch()} />
  );
}

function ProtectedRoutes(props: {
  mode: 'light' | 'dark';
  identity: NonNullable<Identity>;
  refetchIdentity: () => Promise<ApolloQueryResult<IdentityQueryQuery>>;
}) {
  return (
    <Routes>
      <Route path="/" element={<UserOne />} />

      {/* <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}

function RedirectHomeIfSignedIn(props: { children: React.ReactNode }) {
  const { identity } = useIdentity();
  const isLoggedIn = identity != null;

  if (isLoggedIn) return <Navigate to="/" />;
  return <>{props.children}</>;
}

function UserOne() {
  const { identity } = useIdentity();
  const { data } = useQuery(query, { variables: { id: identity?.id ?? '' } });
  const [signOut] = useMutation(signOutMutation);

  if (data == null) return <>loading</>;

  return (
    <>
      <Typography>
        ID: {data.userOne.id} &nbsp; FirstName: {data.userOne.firstName} &nbsp; LastName:{' '}
        {data.userOne.lastName}
      </Typography>

      <Button
        onClick={async () => {
          await signOut({ variables: { input: { email: data.userOne.email } } });
          window.location.reload();
        }}
      >
        LOG OUT
      </Button>
    </>
  );
}

const query = gql(`
  query GetUser($id: ID!) {
    userOne(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`);

const signOutMutation = gql(`
  mutation SignOut($input: SignOutInput!) {
    signOut(input: $input)
  }
`);

// {((): string => {
//   if (screen.type === 'signInCode') return 'Send a code';
//   return isSubmitting ? 'Signing In...' : 'Sign In';
// })()}
