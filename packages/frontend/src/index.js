import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import ReactDOM from 'react-dom/client';
import { App } from './app.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql', credentials: 'include' });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

root.render(<App apollo={client} />);
