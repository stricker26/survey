import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Branching extends Component {
    constructor() {
        super();
        this.state = {
            editIcon: './../../../images/edit-icon.png',
            duplicateIcon: './../../../images/duplicate-icon.png',
            dragIcon: './../../../images/drag-drop-icon.png',
            deleteIcon: './../../../images/delete-icon.png',
            questions: [],
            surveysTitle: '',
            surveyID: '',
            tools: [
                { id: '', active: false }
            ]
        }
    }

    handleChange = (e) => {
        this.setState({
            surveysTitle: e.target.value
        });
    }

    hoverHandler = (e) => () => {
        //console.log(e);
        this.setState({
             tools: this.state.tools.filter((s, sidx) => e == sidx)
        });
    }

    componentWillMount() {

        const { id } = this.props.match.params;
        this.setState({ surveyID: id });

        axios.get('/api/webmaster/question/' + id).then(response => {
            this.setState({
                questions: response.data.questions,
                surveysTitle: response.data.surveys.title
            });
        }).catch(errors => {
            console.log(errors);
        })

    }

    render() {
        let iterate = 1;
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
                                            <input type="text" value={this.state.surveysTitle} onChange={this.handleChange} className="survey-name" />
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
                                    <div className="col pl-0 pr-0">
                                        <ul>
                                            <li><Link to={"/dashboard/survey/" + this.state.surveyID + "/view"}>Question List</Link></li>
                                            <li><Link to={"/dashboard/survey/" + this.state.surveyID + "/logic"}>Survey Logic</Link></li>
                                            <li className="active">Question Branching</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row content-inner-body">
                                    <div className="col">
                                        <div className="branching">
                                            {this.state.questions.map(question => 
                                                <div className="row" key={question.id} onMouseEnter={this.hoverHandler(question.id)} onMouseLeave={this.hoverHandler(question.id)}>
                                                    <div className="col-lg-1">
                                                        <label className="question-label">Q{iterate++}</label>
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <label>{question.q_title.replace(/<\/?[^>]+(>|$)/g, "")}</label>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <ul>
                                                            <li>Edit</li>
                                                            <li>Logic</li>
                                                            <li>Delete</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
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
