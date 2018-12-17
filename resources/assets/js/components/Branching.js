import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import LogicModal from './Modal/LogicModal';
import SurveyTitleModal from './Modal/SurveyTitleModal';
import { Redirect } from 'react-router-dom';

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
            surveyStatus: 0,
            surveyID: '',
            questionID: '',
            question_iterate: '',
            answers: [],
            logicModal: false,

            //modal
            warningHeader: '',
            warningContent: '',
            warningTheme: '',
            warningModal: false,

            //session
            token: sessionStorage.getItem('token'),
        }
    }
    
    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }

    handleChange = (e) => {
        this.setState({
            surveysTitle: e.target.value
        });
    }

    openLogicModal = (e) => {
        var q_iterate = e.target.dataset.qnumber;
        axios.get('/api/webmaster/answers/' + e.target.dataset.id).then(response => {
             this.setState({
                answers: response.data.answers,
                questionID: e,
                logicModal: !this.state.logicModal,
                question_iterate: q_iterate
            });
        }).catch(errors => {
            console.log(errors);
        });
    }

    toggleLogicModal = () => {
        this.setState({
            logicModal: !this.state.logicModal
        });
    }

    componentWillMount() {

        const { id } = this.props.match.params;
        this.setState({ surveyID: id });

        axios.get('/api/webmaster/question/' + id).then(response => {
            this.setState({
                questions: response.data.questions,
                surveysTitle: response.data.surveys.title,
                surveyStatus: response.data.surveyStatus,
            });
        }).catch(errors => {
            console.log(errors);
        });

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

    statusChange = (e) => {
        if(this.state.surveyStatus == 0) {
            var surveyCurrStat = 1;
        } else {
            var surveyCurrStat = 0;
        }
        this.setState({
            surveyStatus: surveyCurrStat
        });

        axios.get('/api/webmaster/surveyStatus/' + this.state.surveyID + '/' + surveyCurrStat).catch(errors => {
            console.log(errors);
        })
    }

    render() {
        let iterate = 1;
        const isViewModal = this.state.logicModal;
        let viewModal;
        if(isViewModal === true) {
            viewModal = <LogicModal isOpen={this.state.logicModal} closeModal={this.toggleLogicModal} questionList={this.state.questions} answerList={this.state.answers} q_no={this.state.question_iterate} surveyId={this.state.surveyID} />
        } else {
            viewModal = '';
        }

        return (
            <React.Fragment>
                {this.renderRedirect()}
                <header>
                    <div className="container">
                        <Header />
                        {viewModal}
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
												    <input className="tgl tgl-ios" id="cb2" type="checkbox" checked={this.state.surveyStatus == 0 ? false : true} onChange={this.statusChange}/>
												    <label className="tgl-btn" htmlFor="cb2"></label>
												    <label>Survey is {this.state.surveyStatus == 0 ? "Inactive" : "Active"}.</label>
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
                                            {/*<li><Link to={"/dashboard/survey/" + this.state.surveyID + "/logic"}>Survey Logic</Link></li>*/}
                                            <li className="active">Question Branching</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row content-inner-body">
                                    <div className="col">
                                        <div className="branching">
                                            {this.state.questions.map(question => 
                                                <div className="row" key={question.id}>
                                                    <div className="col-lg-1">
                                                        <label className="question-label">Q{iterate++}</label>
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <label>{question.q_title.replace(/<\/?[^>]+(>|$)/g, "")}</label>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <ul>
                                                            <li><button type="button" className="btn btn-primary">Edit</button></li>
                                                            {
                                                                question.q_type == 'Multiple Choice'
                                                                    ? <li><button type="button" className="btn btn-warning" data-qnumber={iterate - 1} data-id={question.id} onClick = {this.openLogicModal}>Logic</button></li>
                                                                    : ''
                                                                ||  
                                                                question.q_type == 'Checkbox'
                                                                    ? <li><button type="button" className="btn btn-warning" data-qnumber={iterate - 1} data-id={question.id} onClick = {this.openLogicModal}>Logic</button></li>
                                                                    : ''
                                                            }
                                                            <li><button type="button" className="btn btn-secondary">Delete</button></li>
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
