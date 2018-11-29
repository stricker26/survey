import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import surveyImage from './images/live-survey.jpg';

export default class Dashboard extends Component {

	constructor() {
		super()
		this.state = {
			logo: 'https://picsum.photos/200',
            token: sessionStorage.getItem('token')
		};

        const form = {
            token: sessionStorage.getItem('token')
        };

        axios.post('/api/webmaster/getName', form).then(response => {
            this.setState({
                user: response.data.user
            });
        }).catch(error => {
            console.log(error);
        });
	}

    renderRedirect = () => {
        if(!this.state.token) {
        	return <Redirect to='/dashboard/login' />
        }
    }

	render() {
		return(
			<React.Fragment>
                {this.renderRedirect()}
				<header>
                    <div className="container">
                        <Header />
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
                				<div className="row overview">
                					<div className="col-lg-1 border">
										<label>Active</label>
										<label>2</label>
									</div>
									<div className="col-lg-1 border">
										<label>Drafts</label>
										<label>1</label>
									</div>
									<div className="col-lg-3 border">
										<label>Total Responses</label>
										<label>100</label>
									</div>
									<div className="col-lg-4 border">
										<label>Average Completion Rate</label>
										<label>100%</label>
									</div>
									<div className="col-lg-3 border">
										<label>Usual Time Spent</label>
										<label>00:15:30</label>
									</div>
                				</div>
                				<div className="row mt-5 mb-5">
									<div className="col-lg-4">
										<h3>Recent Surveys</h3>
										<form className="form-inline">
									    	<input className="search bg-light" type="text" placeholder="Search Surveys by Name" />
									  	</form>
									</div>
								</div>
								<div className="row mt-5">
									<div className="col">
										<button className="btn btn-success mb-2">Active Surveys</button>
										<div className="row surveys border">
											<div className="col-7">
												<label>Health Survey Questionnaire</label>
												<span>Date created: 04/06/2018</span> <span className="ml-3">Last Modified: 04/11/2018</span>
												<a href="#">Manage</a>
											</div>
											<div className="col-1">
												<label>Questions</label>
												<label>17</label>
											</div>
											<div className="col-2">
												<label>Completion Rate</label>
												<label>100%</label>
											</div>
											<div className="col-2">
												<label>Usual Time for Completion</label>
												<label>15 mins</label>
											</div>
										</div>
										<div className="row surveys border mt-2">
											<div className="col-7">
												<label>Marketing Survey Questionnaire</label>
												<span>Date created: 04/06/2018</span> <span className="ml-3">Last Modified: 04/11/2018</span>
												<a href="#">Manage</a>
											</div>
											<div className="col-1">
												<label>Questions</label>
												<label>12</label>
											</div>
											<div className="col-2">
												<label>Completion Rate</label>
												<label>90%</label>
											</div>
											<div className="col-2">
												<label>Usual Time for Completion</label>
												<label>17 mins</label>
											</div>
										</div>
									</div>
								</div>
								<div className="row mt-5">
									<div className="col">
										<button className="btn btn-primary mb-2">Live Surveys</button>
										<div className="row surveys border">
											<div className="col-7">
												<label>Seminar Questionnaire</label>
												<span>Date created: 04/06/2018</span> <span className="ml-3">Last Modified: 04/11/2018</span>
												<a href="#">Manage</a>
											</div>
											<div className="col-1">
												<label>Questions</label>
												<label>10</label>
											</div>
											<div className="col-2">
												<label>Completion Rate</label>
												<label>100%</label>
											</div>
											<div className="col-2">
												<label>Usual Time for Completion</label>
												<label>13 mins</label>
											</div>
										</div>
									</div>
								</div>
								<div className="row mt-5 mb-5">
									<div className="col">
										<button className="btn btn-danger mb-2">Drafted Surveys</button>
										<div className="row surveys border">
											<div className="col-7">
												<label>Work Culture Questionnaire</label>
												<span>Date created: 04/06/2018</span> <span className="ml-3">Last Modified: 04/11/2018</span>
												<a href="#">Manage</a>
											</div>
											<div className="col-1">
												<label>Questions</label>
												<label>5</label>
											</div>
											<div className="col-2">
												<label>Completion Rate</label>
												<label>2%</label>
											</div>
											<div className="col-2">
												<label>Usual Time for Completion</label>
												<label>5 mins</label>
											</div>
										</div>
									</div>
								</div>
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