import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Parser from 'html-react-parser';
import Header from './Layouts/Header';

export default class Survey extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            surveyId: '',
            respondentEmail: '',
            asteriskClass: 'asterisk-default',
            errorClass: 'error-hide',
            topImage: './../../images/startsurvey.png'
        };
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/front/' + id).then(response => {
            this.setState({
                title: response.data.title,
                surveyId: id
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleChange = (e) => {
    	this.setState({
    		respondentEmail: e.target.value
    	});
    }

    submitForm = (e) => {
    	e.preventDefault();
        const form = {
            survey_id: this.state.surveyId,
            respondentEmail: this.state.respondentEmail
        }

        axios.post('/api/webmaster/emailRespondent', form).then(response => {
        	if(response.data.success) {
                this.props.history.push('/survey/'+ this.state.surveyId);
        	} else {
        		this.setState({
		            asteriskClass: 'asterisk-error',
		            errorClass: 'error-show'
        		});
        	}
        }).catch(error => {
            console.log(error);
        });
    }

	render() {
		return(
			<React.Fragment>
                <header>
                    <div className="container">
                        <Header 
                            title = {this.state.title}
                        />
                    </div>
                </header>
                <section>
                	<div className="top-image-welcomeSurvey">
                        <img src={this.state.topImage}/>
                	</div>
                	<div className="container-welcomeSurvey">
	                    <div className="container">
	                        <div className="body-welcomeSurvey">
	                        	<h1 className="welcomeheader-welcomeSurvey">Welcome!</h1>
	                        	<div className="welcomebody-welcomeSurvey">
	                        		<p>
	                        			This is a survey about Lorem ipsum dolor sit amet, consectetur adipiscing elit,
	                        			sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
	                        			quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
	                        			irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
	                        			Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
	                        			anim id laborum.
	                        		</p>
	                        	</div>
		                        <div className="form-welcomeSurvey">
		                        	<div className="label-form-welcomeSurvey">
		                        		<span>Please input your Email Address to proceed.<span className={this.state.asteriskClass}>*</span></span>
		                        		<small className={this.state.errorClass}>*This field is required.</small>
		                        	</div>
		                        	<div className="inputDiv-welcomeSurvey">
			                        	<input type="text" className="input-welcomeSurvey" onChange={this.handleChange} />
		                        	</div>
		                        	<div className="submitDiv-welcomeSurvey">
		                        		<button type="submit" className="submit-welcomeSurvey" onClick={this.submitForm}>Begin</button>
		                        	</div>
		                        </div>
	                        </div>
	                    </div>
                    </div>
                </section>
			</React.Fragment>
		);
	}
}