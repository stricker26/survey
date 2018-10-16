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
            questions: []
        }
    }

    componentWillMount() {

        axios.get('/api/question').then(response => {
            this.setState({
                questions: response.data
            });
        }).catch(errors => {
            console.log(errors);
        })

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
                                            <input type="text" className="survey-name" placeholder="Untitled" />
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
                                        <div className="row">
                                            <div className="col">
                                                <p>TITLE</p>
                                            </div>
                                            <div className="col">
                                                <p>QUESTION TYPE</p>
                                            </div>
                                        </div>
                                        {this.state.questions.map(question => 
                                            <div className="row mr-1 ml-1 mb-3">
                                                <div className="col-lg-1 border">
                                                    <label className="question-label">Q</label>
                                                </div>
                                                <div className="col-lg-11 border">
                                                    <div className="row">
                                                        <div className="col-lg-4">
                                                            <label>{question.q_title}</label>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <label>{question.q_type}</label>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div className="question-tools">
                                                                <div className="question-tools-item">
                                                                    <img src={this.state.editIcon} />
                                                                </div>
                                                                <div className="question-tools-item">
                                                                    <img src={this.state.duplicateIcon} />
                                                                </div>
                                                                <div className="question-tools-item">
                                                                    <img src={this.state.dragIcon} />
                                                                </div>
                                                                <div className="question-tools-item">
                                                                    <img src={this.state.deleteIcon} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="row mt-5 mb-5">
                                        	<div className="col text-center">
                                        		<Link to="/dashboard/survey/add/1" className="nav-link">
                                        			<div className="btn add-question">Add a question</div>
                                        		</Link>
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
