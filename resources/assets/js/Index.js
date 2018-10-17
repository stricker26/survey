import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Survey from './components/Survey';
import Response from './components/Response';
import CreateSurvey from './components/CreateSurvey';
import AddQuestions from './components/AddQuestions';
import ViewSurvey from './components/ViewSurvey';

//Frontend
import StartSurvey from './components/Frontend/StartSurvey';

export default class Index extends Component {
	render() {
		return(
			<Router>
				<React.Fragment>
					<Route exact path={"/dashboard/home"} component={Dashboard} />
					<Route exact path={"/dashboard/survey"} component={Survey} />
					<Route exact path={"/dashboard/response"} component={Response} />
					<Route exact path={"/dashboard/survey/add"} component={CreateSurvey} />
					<Route exact path={"/dashboard/survey/:id/view"} component={ViewSurvey} />
					<Route exact name="add" path={"/dashboard/survey/:id/add"} component={AddQuestions} />
					<Route exact path={"/survey/:id"} component={StartSurvey} />
				</React.Fragment>
			</Router>
		);
	}
}

if (document.getElementById('app')) {
    ReactDOM.render(<Index />, document.getElementById('app'));
}