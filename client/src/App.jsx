import './App.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';


const httpLink = createHttpLink({
    uri: '/graphql',
    });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function App() {
    const token = localStorage.getItem('id_token');
//   console.log('Token from localStorage:', token);
    return (
        <ApolloProvider client={client}>
            <NavBar />
        <Outlet />
    </ApolloProvider>
    );
}

export default App;