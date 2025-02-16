import { ApolloClient, InMemoryCache } from '@apollo/client';
import ReactDOM from 'react-dom/client';
import { App } from './app.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

root.render(<App apollo={client} />);
