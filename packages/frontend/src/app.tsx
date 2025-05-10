import { ApolloClient, ApolloProvider, ApolloQueryResult } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactNode } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { DarkModeLogo, LightModeLogo } from './components/logos';
import { AccountMenu } from './components/navigation/accountMenu';
import { DefaultLayout } from './components/navigation/defaultLayout';
import { Footer } from './components/navigation/footer';
import { toNavigation } from './components/navigation/toNavigation';
import { TopBar } from './components/navigation/topBar';
import { PageNotFound } from './components/pageNotFound';
import { ScrollToTop } from './components/scrollToTop';
import { IdentityQueryQuery } from './gql-generated/graphql';
import { Identity, useIdentity } from './hooks/useIdentity';
import { useModeContext } from './modeContext';
import { Analytics } from './pages/analytics';
import { Dashboard } from './pages/dashboard';
import { SettingsIndex } from './pages/settingsAdmin';
import { AccountSettingsIndex } from './pages/settingsPersonal';
import { SignIn } from './pages/signIn';
import { TaskList } from './pages/taskList';
import { TeamRoutes } from './pages/team/teamRoutes';
import { useTheme } from './theme';

interface AppProps {
  readonly apollo: ApolloClient<any>;
}

export function App(props: AppProps) {
  const [{ mode }] = useModeContext();
  const theme = useTheme({ mode });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ApolloProvider client={props.apollo}>
          <Router>
            <ScrollToTop />
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
      </LocalizationProvider>
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
  const navigation = toNavigation(props.identity);

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
        <Route path="/" element={<Dashboard identity={props.identity} />} />
        <Route
          path="/account-settings/*"
          element={<AccountSettingsIndex identity={props.identity} />}
        />
        <Route path="/tasks/*" element={<TaskList identity={props.identity} />} />
        <Route path="/teams/*" element={<TeamRoutes identity={props.identity} />} />
        <Route path="/analytics/*" element={<Analytics />} />
        <Route
          path="/settings/*"
          element={
            <EnsureRouteRole identity={props.identity} sufficientRoles={['admin']}>
              <SettingsIndex />
            </EnsureRouteRole>
          }
        />
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

function EnsureRouteRole(props: {
  readonly children: React.ReactNode;
  readonly identity: Pick<NonNullable<Identity>, 'systemRole'>;
  readonly sufficientRoles: string[];
}) {
  if (props.sufficientRoles.includes(props.identity.systemRole.value)) return <>{props.children}</>;

  return <Navigate to="/" replace />;
}
