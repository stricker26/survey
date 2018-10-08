import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Survey from './components/Survey';
import Response from './components/Response';
import CreateSurvey from './components/CreateSurvey';
import AddQuestion from './components/AddQuestions';

export default class Index extends Component {
	render() {
		return(
			<Router>
				<React.Fragment>
					<Route exact path={"/dashboard/home"} component={Dashboard} />
					<Route exact path={"/dashboard/survey"} component={Survey} />
					<Route exact path={"/dashboard/response"} component={Response} />
					<Route exact path={"/dashboard/survey/add"} component={CreateSurvey} />
					<Route exact path={"/dashboard/survey/add/1"} component={AddQuestion} />
				</React.Fragment>
			</Router>
		);
	}
}

if (document.getElementById('app')) {
    ReactDOM.render(<Index />, document.getElementById('app'));
}