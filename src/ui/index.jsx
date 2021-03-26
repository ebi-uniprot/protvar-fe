import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import '../styles/index.scss';

import App from './App';
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: BASE_URL + '/graphql'
});

ReactDOM.render(
	<Router>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</Router>,
	document.getElementById('root')
);
