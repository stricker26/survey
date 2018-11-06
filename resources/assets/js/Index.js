import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Survey from './components/Survey';
import Response from './components/Response';
import CreateSurvey from './components/CreateSurvey';
import AddQuestions from './components/AddQuestions';
import ViewSurvey from './components/ViewSurvey';
import SurveyLogic from './components/SurveyLogic';
import Branching from './components/Branching';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';
import QuestionSummaries from './components/Response/QuestionSummaries';
import IndividualResponses from './components/Response/IndividualResponses';
import DataTrends from './components/Response/DataTrends';

//Frontend
import StartSurvey from './components/Frontend/StartSurvey';
import StartSurveyWelcome from './components/Frontend/StartSurveyWelcome';

export default class Index extends Component {
	render() {
		return(
			<Router>
				<React.Fragment>
					<Route exact path={"/dashboard/register"} component={Register} />
					<Route exact path={"/dashboard/login"} component={Login} />
					<Route exact path={"/dashboard/logout"} component={Logout} />
					<Route exact path={"/dashboard/home"} component={Dashboard} />
					<Route exact path={"/dashboard/survey"} component={Survey} />
					<Route exact path={"/dashboard/response"} component={Response} />
					<Route exact path={"/dashboard/response/question_summaries/:id"} component={QuestionSummaries} />
					<Route exact path={"/dashboard/response/data_trends/:id"} component={DataTrends} />
					<Route exact path={"/dashboard/response/individual_responses/:id"} component={IndividualResponses} />
					<Route exact path={"/dashboard/survey/add"} component={CreateSurvey} />
					<Route exact path={"/dashboard/survey/:id/view"} component={ViewSurvey} />
					<Route exact name="add" path={"/dashboard/survey/:id/add"} component={AddQuestions} />
					<Route exact name="edit" path={"/dashboard/survey/:id/edit"} component={AddQuestions} />
					<Route exact path={"/dashboard/survey/:id/logic"} component={SurveyLogic} />
					<Route exact path={"/dashboard/survey/:id/branching"} component={Branching} />
					<Route exact path={"/survey/:id"} component={StartSurvey} />
					<Route exact path={"/survey/welcome/:id"} component={StartSurveyWelcome} />
				</React.Fragment>
			</Router>
		);
	}
}

if (document.getElementById('app')) {
    ReactDOM.render(<Index />, document.getElementById('app'));
}