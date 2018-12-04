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

            name: '',
            className: 'asterisk-default',
            age: '',
            classAge: 'asterisk-default',
            gender: '',
            classGender: 'asterisk-default',
            sec: '',

            asteriskClass: 'asterisk-default',
            errorClass: 'error-hide',
            topImage: './../../images/startsurvey.png'
        };
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/front/welcome/' + id).then(response => {
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
            [e.target.name]: e.target.value
        });
    }

    submitForm = (e) => {
    	e.preventDefault();
        const form = {
            survey_id: this.state.surveyId,
            name: this.state.name,
            age: this.state.age,
            gender: this.state.gender,
            sec: this.state.sec,
        }

        axios.post('/api/webmaster/emailRespondent', form).then(response => {
        	if(response.data.success) {
                this.props.history.push('/survey/'+ this.state.surveyId + '_' + response.data.id);
        	} else {
        		this.setState({
		            asteriskClass: 'asterisk-error',
		            errorClass: 'error-show'
        		});

                if(this.state.name == '') {
                    this.setState({
                        className: 'asterisk-error'
                    });
                } else {
                    this.setState({
                        className: 'asterisk-default'
                    });
                }

                if(this.state.age == '') {
                    this.setState({
                        classAge: 'asterisk-error'
                    });
                } else {
                    this.setState({
                        className: 'asterisk-default'
                    });
                }
                
                if(this.state.gender == '') {
                    this.setState({
                        classGender: 'asterisk-error'
                    });
                } else {
                    this.setState({
                        className: 'asterisk-default'
                    });
                }
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
		                        		<span>Please fill up the fields to proceed.<span className={this.state.asteriskClass}>*</span></span>
		                        		<small className={this.state.errorClass}>*This field is required.</small>
		                        	</div>
		                        	<div className="inputDiv-welcomeSurvey">
                                        <div className="row pb-3">
                                            <div className="col">
                                                <div className="label-text">
                                                    <span>Name: <span className={this.state.className}>*</span></span>
                                                </div>
                                                <div className="input-field">
                                                    <input type="text" name="name" onChange={this.handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row pb-3">
                                            <div className="col-6">
                                                <div className="label-text">
                                                    <span>Age: <span className={this.state.classAge}>*</span></span>
                                                </div>
                                                <div className="input-field">
                                                    <input type="number" name="age" onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="label-text text-center">
                                                    <span>Gender: <span className={this.state.classGender}>*</span></span>
                                                </div>
                                                <div className="input-field">
                                                    <select defaultValue="" name="gender" onChange={this.handleChange}>
                                                        <option value="" disabled>--Gender--</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="label-text">
                                                    <span>Socio Economic Class:</span>
                                                </div>
                                                <div className="input-field">
                                                    <input type="text" name="sec" onChange={this.handleChange} />
                                                </div>
                                            </div>
                                        </div>
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