import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class CreateSurvey extends Component {
    constructor() {
        super();
        this.state = {
            editIcon: './../../images/edit-icon.png',
            duplicateIcon: './../../images/duplicate-icon.png',
            dragIcon: './../../images/drag-drop-icon.png',
            deleteIcon: './../../images/delete-icon.png',
            questions: [],
            sTitle: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            sTitle: e.target.value
        });
    }

    addSurveyTitle = (e) => {
        e.preventDefault();
        const form = {
            title: this.state.sTitle
        }

        axios.post('/api/webmaster/survey', form).then(response => {
            if(response.data.success) {
                this.props.history.push('/dashboard/survey/'+ response.data.id +'/add/');
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {

        return (
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section>
                    <div className="container-fluid">
                        <div className="row">
                        </div>
                        <div className="row">
                            <div className="col-lg-3 bg-dark">
                                <div className="sidebar">
                                    <div className="row">
                                        <div className="col">
                                            <input type="text" value={this.state.value} onChange={this.handleChange} className="survey-name" placeholder="Untitled" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <ul className="survey-properties">
                                            <li className="question-icon active"><span></span>Questions</li>
                                            <li className="settings-icon"><span></span>Settings</li>
                                            <li className="preview-icon"><span></span>Preview</li>
                                            <li className="share-icon"><span></span>Share</li>
                                        </ul>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="hr-full"></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    	<div className="checkbox">
											<ul className="tg-list mt-5">
										    	<li className="tg-list-item">
												    <input className="tgl tgl-ios" id="cb2" type="checkbox"/>
												    <label className="tgl-btn" htmlFor="cb2"></label>
												    <label>Survey is Inactive.</label>
												</li>
										  	</ul>
										</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 content-inner">
                                <div className="row content-inner-head">
                                    <div className="col">
                                        <ul>
                                            <li>Question List</li>
                                            <li>Survey Logic</li>
                                            <li>Question Branching</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row content-inner-body">
                                    <div className="col-lg-12">
                                        <div className="row mt-5 mb-5">
                                        	<div className="col text-center">
                                        		<button type="submit" className="btn add-question" onClick={this.addSurveyTitle}>Add a question</button>
                                        	</div>
                                        </div>
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
