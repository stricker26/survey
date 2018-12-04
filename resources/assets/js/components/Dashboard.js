import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import surveyImage from './images/live-survey.jpg';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default class Dashboard extends Component {

	constructor() {
		super()
		this.state = {
			logo: 'https://picsum.photos/200',
            token: sessionStorage.getItem('token'),
            user: '',
            searchSurvey: '',

            //dashboard data
            data: '',
            overview: [],
            activeSurveys: [],
            draftedSurveys: [],
		};
	}

	componentWillMount() {

        const form = {
            token: sessionStorage.getItem('token')
        };

        axios.post('/api/webmaster/dashboard' , form).then(response => {

        	if(response.data.data) {
	            this.setState({
	            	data: true,
	                overview: response.data.overview,
	                activeSurveys: response.data.activeSurveys,
	                draftedSurveys: response.data.draftedSurveys,
	            });
	        } else {
	            this.setState({
	            	data: false,
	            });
	        }
            
        }).catch(error => {
            console.log(error);
        });

	}

    renderRedirect = () => {
        if(!this.state.token) {
        	return <Redirect to='/dashboard/login' />
        }
    }

    nameUser = (user) => {
    	this.setState({
    		user: user
    	});
    }

    searchSurvey = (e) => {
    	this.setState({
    		searchSurvey: e.target.value
    	});
    }

	render() {
		
		var checkSearchDrafted = false;
		for(var x = 0; x < this.state.draftedSurveys.length; x++) {
			if(this.state.draftedSurveys[x]['title'].toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1) {
				checkSearchDrafted = true;
			}
		}

		var checkSearchActive = false;
		for(var x = 0; x < this.state.activeSurveys.length; x++) {
			if(this.state.activeSurveys[x]['title'].toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1) {
				checkSearchActive = true;
			}
		}

		return(
			<React.Fragment>
                {this.renderRedirect()}
				<header>
                    <div className="container">
                        <Header name={this.nameUser}/>
                    </div>
                </header>
                <section>
                	<div className="container-fluid">
                		<div className="row justify-content-center">
                			<div className="col-lg-10">
                				<div className="row pt-5 pb-5">
                					<div className="col">
										<h1>Welcome back, {this.state.user}.</h1>
									</div>
                				</div>
                			</div>
						</div>
						<div className="row justify-content-center section-bg-gray">
                			<div className="col-lg-10">
                				<div className="row pt-5">
                					<div className="col">
										<h3>Overview</h3>
									</div>
                				</div>
                				<Choose>
	                				<When condition = {this.state.data}>
		                				<div className="row overview">
		                					<div className="col-lg-1 border">
												<label>Active</label>
												<label>{this.state.overview.active}</label>
											</div>
											<div className="col-lg-1 border">
												<label>Drafts</label>
												<label>{this.state.overview.drafts}</label>
											</div>
		                					<div className="col-lg-2 border">
												<label>Average Age</label>
												<label>{this.state.overview.averageAge} years old</label>
											</div>
											<div className="col-lg-1 border">
												<label>Male</label>
												<label>{this.state.overview.male}</label>
											</div>
											<div className="col-lg-1 border">
												<label>Female</label>
												<label>{this.state.overview.female}</label>
											</div>
											<div className="col-lg-2 border">
												<label>Total Responses</label>
												<label>{this.state.overview.totalResponses}</label>
											</div>
											<div className="col-lg-2 border">
												<label>Average Completion Rate</label>
												<label>{this.state.overview.completionRate}</label>
											</div>
											<div className="col-lg-2 border">
												<label>Usual Time Spent</label>
												<label>{this.state.overview.timeSpent}</label>
											</div>
		                				</div>
		                				<div className="row mt-5 mb-5">
											<div className="col-lg-4">
												<h3>Recent Surveys</h3>
										    	<input className="search bg-light" type="text" placeholder="Search Surveys by Name" onInput={this.searchSurvey} />
											</div>
										</div>
										<Choose>
											<When condition = {checkSearchActive == true || checkSearchDrafted == true}>
												<If condition = {checkSearchActive == true}>
													<div className="row mt-5 mb-5">
														<div className="col">
															<button className="btn btn-success mb-2">Active Surveys</button>
															<Choose>
																<When condition = {this.state.activeSurveys.length != 0}>
																	{this.state.activeSurveys.map((value, key) =>
																		<If condition = {value.title.toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1}>
																			<div className="row surveys border mb-2" key={key}>
																				<div className="col-3 text-left">
																					<span className="font-weight-bold survey-title">{value.title.length >= 40 ? value.title.substring(0, 40) + "..." : value.title}</span><br/>
																					<span>Date created: {value.created_at}</span><br/>
																					<span>Last Modified: {value.updated_at}</span><br/>
																					<Link to={"/dashboard/survey/" + value.survey_id + "/view"}>Manage</Link>
																				</div>
											                					<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Average Age</label>
																					<label>{value.averageAge} years old</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Male</label>
																					<label>{value.male}</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Female</label>
																					<label>{value.female}</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Questions</label>
																					<label>{value.questionCount}</label>
																				</div>
																				<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Completion Rate</label>
																					<label>{value.completionRate}</label>
																				</div>
																				<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Usual Time for Completion</label>
																					<label>{value.timeSpent <= 1 ? value.timeSpent + " min" : value.timeSpent + " mins"} </label>
																				</div>
																			</div>
																		</If>
																	)}
																</When>
																<Otherwise>
																	<div className="row surveys border mb-2">
																		<div className="col-sm-12 text-center">
																			<h5 className="mt-2"><FontAwesomeIcon icon={faExclamationCircle} /> No Active Surveys</h5>
																		</div>
																	</div>
																</Otherwise>
															</Choose>
														</div>
													</div>
												</If>
												<If condition = {checkSearchDrafted == true}>
													<div className="row mt-5 mb-5">
														<div className="col">
															<button className="btn btn-danger mb-2">Drafted Surveys</button>
															<Choose>
																<When condition = {this.state.draftedSurveys.length != 0}>
																	{this.state.draftedSurveys.map((value, key) =>
																		<If condition = {value.title.toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1}>
																			<div className="row surveys border mb-2" key={key}>
																				<div className="col-3 text-left">
																					<span className="font-weight-bold survey-title">{value.title.length >= 40 ? value.title.substring(0, 40) + "..." : value.title}</span><br/>
																					<span>Date created: {value.created_at}</span><br/>
																					<span>Last Modified: {value.updated_at}</span>
																					<Link to={"/dashboard/survey/" + value.survey_id + "/view"}>Manage</Link>
																				</div>
											                					<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Average Age</label>
																					<label>{value.averageAge} years old</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Male</label>
																					<label>{value.male}</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Female</label>
																					<label>{value.female}</label>
																				</div>
																				<div className="col-1">
											                						<span>&nbsp;</span>
																					<label>Questions</label>
																					<label>{value.questionCount}</label>
																				</div>
																				<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Completion Rate</label>
																					<label>{value.completionRate}</label>
																				</div>
																				<div className="col-2">
											                						<span>&nbsp;</span>
																					<label>Usual Time for Completion</label>
																					<label>{value.timeSpent <= 1 ? value.timeSpent + " min" : value.timeSpent + " mins"} </label>
																				</div>
																			</div>
																		</If>
																	)}
																</When>
																<Otherwise>
																	<div className="row surveys border mb-2">
																		<div className="col-sm-12 text-center">
																			<h5 className="mt-2"><FontAwesomeIcon icon={faExclamationCircle} /> No Drafted Surveys</h5>
																		</div>
																	</div>
																</Otherwise>
															</Choose>
														</div>
													</div>
												</If>
											</When>
											<Otherwise>
												<div className="row surveys border mb-5">
													<div className="col-sm-12 text-center">
														<h5 className="mt-3"><FontAwesomeIcon icon={faExclamationCircle} /> No Survey Found..</h5>
													</div>
												</div>
											</Otherwise>
										</Choose>
									</When>
									<Otherwise>
										<div className="row overview">
											<div className="col-sm-12 text-center border mb-5">
												<h5 className="mt-2"><FontAwesomeIcon icon={faExclamationCircle} /> No Responses</h5>
											</div>
										</div>
									</Otherwise>
								</Choose>
                			</div>
						</div>
						<div className="row justify-content-center bg-white">
							<div className="col-lg-10">
								<div className="row mb-5 pt-5">
									<div className="col-lg-6 pr-5">
										<h3>Try out Live Surveys Today!</h3>
										<p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
										<button className="btn btn-primary">Make Live Survey</button>
									</div>
									<div className="col-lg-6">
										<img src={surveyImage} alt="Live Survey" className="full" />
									</div>
								</div>
							</div>
						</div>
                	</div>
                </section>
                <footer>
                    <div className="container">
                        <Footer />
                    </div>
                </footer>
			</React.Fragment>
		);
	}
}