import { ApolloClient, ApolloProvider, ApolloQueryResult, useQuery } from '@apollo/client';
import { CircularProgress, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { DarkModeLogo, LightModeLogo } from './components/logos';
import { AccountMenu } from './components/navigation/accountMenu';
import { DefaultLayout } from './components/navigation/defaultLayout';
import { Footer } from './components/navigation/footer';
import { toNavigation } from './components/navigation/toNavigation';
import { TopBar } from './components/navigation/topBar';
import { PageNotFound } from './components/pageNotFound';
import { gql } from './gql-generated/gql';
import { IdentityQueryQuery } from './gql-generated/graphql';
import { Identity, useIdentity } from './hooks/useIdentity';
import { useModeContext } from './modeContext';
import { Analytics } from './pages/analytics';
import { Dashboard } from './pages/dashboard';
import { Settings } from './pages/settingsAdmin/settings';
import { AccountSettings } from './pages/settingsPersonal/accountSettings';
import { SignIn } from './pages/signIn';
import { Tasks } from './pages/tasks';
import { Teams } from './pages/teams';
import { Users } from './pages/users';
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
  const navigation = toNavigation();

  return (
    <DefaultLayout
      navigation={navigation}
      footer={<Footer variant="simple" />}
      topBar={
        <TopBar
          variant="default"
          desktopLogo={((): ReactNode => {
            if (props.mode === 'light') return <LightModeLogo sx={{ width: '70px' }} />;
            if (props.mode === 'dark') return <DarkModeLogo sx={{ width: '70px' }} />;

            return null;
          })()}
          actions={<AccountMenu identity={props.identity} />}
        />
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/account-settings/*" element={<AccountSettings identity={props.identity} />} />
        <Route path="/tasks/*" element={<Tasks />} />
        <Route path="/teams/*" element={<Teams />} />
        <Route path="/users/*" element={<Users />} />
        <Route path="/analytics/*" element={<Analytics />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </DefaultLayout>
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

  if (data == null) return <>loading</>;

  return (
    <>
      <Typography>
        ID: {data.userOne.id} &nbsp; FirstName: {data.userOne.firstName} &nbsp; LastName:{' '}
        {data.userOne.lastName}
      </Typography>
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

// {((): string => {
//   if (screen.type === 'signInCode') return 'Send a code';
//   return isSubmitting ? 'Signing In...' : 'Sign In';
// })()}
