import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';

import App from './ui/App';
import NewApp from "./ui/NewApp";

ReactDOM.render(
	<BrowserRouter basename={process.env.PUBLIC_URL}>
		<Switch>
			<Route exact path="/">
				<App />
			</Route>
			<Route path="/v2">
				<NewApp />
			</Route>
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();