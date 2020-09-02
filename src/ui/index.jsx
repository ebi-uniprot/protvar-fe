import React from 'react';
import ReactDOM from 'react-dom';
// import ApolloClient from 'apollo-boost';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
// import ApolloClient  from 'apollo-boost';

import '../styles/index.scss';

import App from './App';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: 'http://localhost:8091/graphql'
});

ReactDOM.render(
	<Router>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</Router>,
	document.getElementById('root')
);
