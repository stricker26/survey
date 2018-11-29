import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import SurveyTitleModal from './Modal/SurveyTitleModal';

export default class ViewSurvey extends Component {
    constructor() {
        super();
        this.state = {
            editIcon: './../../../images/edit-icon.png',
            duplicateIcon: './../../../images/duplicate-icon.png',
            dragIcon: './../../../images/drag-drop-icon.png',
            deleteIcon: './../../../images/delete-icon.png',
            questions: [],
            surveysTitle: '',
            sTitle: '',
            surveyID: '',

            //modal
            warningHeader: '',
            warningContent: '',
            warningTheme: '',
            warningModal: false,
        }
    }

    handleChange = (e) => {
        this.setState({
            surveysTitle: e.target.value
        });
    }

    componentWillMount() {

        const { id } = this.props.match.params;
        this.setState({ surveyID: id });

        axios.get('/api/webmaster/question/' + id).then(response => {
            this.setState({
                questions: response.data.questions,
                surveysTitle: response.data.surveys.title,
            });
        }).catch(errors => {
            console.log(errors);
        })

    }

    editSurveyTitle = () => {
        const form = {
            survey_id: this.state.surveyID,
            new_name: this.state.surveysTitle,
        };

        axios.post('/api/webmaster/editSurveyQuestion', form).then(response => {
            if(response.data.success) {
                this.setState({
                    warningHeader: 'Success!',
                    warningContent: 'Edited Successfully!',
                    warningTheme: 'success',
                });
            } else {
                this.setState({
                    warningHeader: 'Warning!',
                    warningContent: 'Error Saving Survey Title',
                    warningTheme: 'warning',
                });
            }
            this.toggleWarnigModal();
        }).catch(errors => {
            console.log(errors);
        })

    }

    toggleWarnigModal() {
        this.setState({
            warningModal: !this.state.warningModal
        });
    }

    closeWarningModal = () => {
        this.toggleWarnigModal();
    }

    render() {
        let iterate = 1;
        return (
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header />
                        <SurveyTitleModal
                            isOpen = {this.state.warningModal}
                            closeSurvey = {this.closeWarningModal}
                            warningHeader = {this.state.warningHeader}
                            warningContent = {this.state.warningContent}
                            warningTheme = {this.state.warningTheme}
                        />
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
                                            <button type="button" className="btn btn-primary" onClick={this.editSurveyTitle}>Save Survey Title</button>
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
                                            <li className="active"><Link to={"/dashboard/survey/" + this.state.surveyID + "/view"}>Question List</Link></li>
                                            <li><Link to={"/dashboard/survey/" + this.state.surveyID + "/logic"}>Survey Logic</Link></li>
                                            <li><Link to={"/dashboard/survey/" + this.state.surveyID + "/branching"}>Question Branching</Link></li>
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
                                            <div className="row mr-1 ml-1 mb-3" key={question.id}>
                                                <div className="col-lg-1 border">
                                                    <label className="question-label">Q{iterate++}</label>
                                                </div>
                                                <div className="col-lg-11 border">
                                                    <div className="row">
                                                        <div className="col-lg-4">
                                                            <label>{question.q_title.replace(/<\/?[^>]+(>|$)/g, "")}</label>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <label>{question.q_type}</label>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div className="question-tools">
                                                                <div className="question-tools-item">
                                                                    <Link to={"/dashboard/survey/" + question.id + "/edit"}><img src={this.state.editIcon} /></Link>
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
                                        		<Link to="add" params={{ id: this.state.surveyID }} className="nav-link">
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
