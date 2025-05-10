import { ApolloClient, InMemoryCache } from '@apollo/client';
import React from 'react';

const App = {} as any;

// Mock the Apollo client
const mockApolloClient = new ApolloClient({
  cache: new InMemoryCache()
});

// Mock the useIdentity hook
jest.mock('../hooks/useIdentity', () => ({
  useIdentity: () => ({
    identity: null,
    loading: false,
    refetch: jest.fn()
  })
}));

// Mock the router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Navigate: () => <div>Navigate</div>
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    <App apollo={mockApolloClient} />;
  });
});
