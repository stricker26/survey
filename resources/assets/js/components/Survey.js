import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import ShareModal from './Modal/ShareModal';
import surveyImage from './images/live-survey.jpg';
import NoResponseModal from './Modal/NoResponseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default class Survey extends Component {
    constructor() {
        super()
        this.state = {
            surveyLists: [],
            shareModal: false,
            shareSurveyURL: '',
            editIcon: './../../images/edit-icon.png',
            analyzeIcon: './../../images/analyze-icon.png',
            shareIcon: './../../images/share-default-icon.png',
            moreIcon: './../../images/more-icon.png',
            researcherIcon: './../../images/researcher-icon.png',
            token: sessionStorage.getItem('token'),
            responses: [],
            searchSurvey: '',

            //modal
            warningHeader: '',
            warningContent: '',
            warningTheme: '',
            warningModal: false,

            //survey select tag
            surveyType: 'all',
        }
    }

    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }

    shareSurvey = (id) => () => {
        this.setState({
            shareSurveyURL: id
        });
        this.toggleShareModal();
    }

    toggleShareModal = () => {
        this.setState({
            shareModal: !this.state.shareModal
        });
    }

    analyzeClick = (surveyId) => () => {
        axios.get('/api/webmaster/checkResponses/' + surveyId).then(response => {
            if(response.data.success) {
                this.props.history.push('/dashboard/response/question_summaries/'+ surveyId);
            } else {
                this.setState({
                    warningHeader: 'Warning!',
                    warningContent: 'No respondents',
                    warningTheme: 'warning',
                });

                this.toggleWarnigModal();
            }
        }).catch(error => { 
            console.log(error);
        });
    }

    toggleWarnigModal() {
        this.setState({
            warningModal: !this.state.warningModal
        });
    }

    closeWarningModal = () => {
        this.toggleWarnigModal();
    }

    surveyChange = (e) => {
        var surveyType = (e.target.value == 'all' ? e.target.value : (e.target.value == 'active' ? 1 : 0));
        this.setState({
            surveyType: surveyType
        });
    }

    searchSurvey = (e) => {
        this.setState({
            searchSurvey: e.target.value
        });
    }

    componentWillMount() {
        const form = {
            token: this.state.token
        }

        axios.post('/api/webmaster/lists', form).then(response => {
            this.setState({
                surveyLists: response.data.lists,
                responses: response.data.responses,
            });
        }).catch(error => { 
            console.log(error);
        });
    }

    render() {
        
        var checkSearchDrafted = false;
        var checkSearchActive = false;
        var csDrafted = false;
        var csActive = false;
        var csAll = false;
        for(var x = 0; x < this.state.surveyLists.length; x++) {
            if(this.state.surveyLists[x]['status'] == 1) {
                checkSearchActive = true;

                if(this.state.surveyLists[x]['title'].toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1) {
                    csActive = true;
                }
            }

            if(this.state.surveyLists[x]['status'] == 0) {
                checkSearchDrafted = true;

                if(this.state.surveyLists[x]['title'].toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1) {
                    csDrafted = true;
                }
            }

            if(this.state.surveyLists[x]['title'].toLowerCase().indexOf(this.state.searchSurvey.toLowerCase()) != -1) {
                csAll = true;
            }
        }

        return(
            <React.Fragment>
                {this.renderRedirect()}
                <header>
                    <div className="container">
                        <Header />
                        <ShareModal
                            isOpen = {this.state.shareModal}
                            closeSurvey = {this.toggleShareModal}
                            surveyID = {this.state.shareSurveyURL}
                        />
                        <NoResponseModal
                            isOpen = {this.state.warningModal}
                            closeSurvey = {this.closeWarningModal}
                            warningHeader = {this.state.warningHeader}
                            warningContent = {this.state.warningContent}
                            warningTheme = {this.state.warningTheme}
                        />
                    </div>
                </header>
                <section className="dashboard-survey">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <div className="row mt-5 mb-5">
                                    <div className="col-lg-2 mr-5">
                                        <select className="dropdown" onChange={this.surveyChange}>
                                            <option value="all">All Surveys</option>
                                            <option value="active">Active Survey</option>
                                            <option value="drafted">Drafted Survey</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-3">
                                        <input type="text" className="search" placeholder="Search Survey Name" onInput={this.searchSurvey}/>
                                    </div>
                                </div>
                                <div className="row mb-5">
                                    <div className="col-lg-12">
                                        <table className="table survey-list">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th scope="col" className="pl-4">Title</th>
                                                    <th scope="col">Modified</th>
                                                    <th scope="col">Responses</th>
                                                    <th scope="col">Edit</th>
                                                    <th scope="col">Analyze</th>
                                                    <th scope="col">Share</th>
                                                    <th scope="col">More</th>
                                                    <th scope="col">Field Researchers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <Choose>
                                                    <When condition = {this.state.surveyLists.length != 0 }>
                                                        <Choose>
                                                            <When condition = {(this.state.surveyType == 1 && checkSearchActive == false) || (this.state.surveyType == 0 && checkSearchDrafted == false)}>
                                                                <tr>
                                                                    <td colSpan="8" align="center"><span><FontAwesomeIcon icon={faExclamationCircle} /> No {this.state.surveyType == 1 ? "Active" : "Drafted"} Surveys</span></td>
                                                                </tr>
                                                            </When>
                                                            <Otherwise>
                                                                {this.state.surveyLists.map((list, key) => 
                                                                    <Choose>
                                                                        <When condition = {((this.state.surveyType == 'all' || this.state.surveyType == list.status) && list.title.toLowerCase().indexOf(this.state.searchSurvey) != -1) ||
                                                                                            ((this.state.surveyType == 'all' || this.state.surveyType == list.status) && this.state.searchSurvey == '')}>
                                                                            <tr key={list.id}>
                                                                                <td className="pl-4">
                                                                                    <div className={list.status == 1 ? "text-success" : "text-danger"}>{list.status == 1 ? "ACTIVE SURVEY" : "DRAFTED SURVEY"}</div>
                                                                                    <div><strong>{list.title.length >= 40 ? list.title.substring(0, 40) + "..." : list.title}</strong></div>
                                                                                    <div className="">Created on {list.created_at}.</div>
                                                                                </td>
                                                                                <td align="center">
                                                                                    <div>{list.updated_at}</div>
                                                                                </td>
                                                                                <td align="center">
                                                                                    <div>{this.state.responses[key]}</div>
                                                                                </td>
                                                                                <td align="center"><Link to={'/dashboard/survey/'+ list.survey_id +'/view'}><img src={this.state.editIcon} alt="Edit" /></Link></td>
                                                                                <td align="center"><img src={this.state.analyzeIcon} alt="Analyze" onClick={this.analyzeClick(list.survey_id)}/></td>
                                                                                <td align="center"><img src={this.state.shareIcon} alt="Share" onClick={this.shareSurvey(list.survey_id)} /></td>
                                                                                <td align="center"><img src={this.state.moreIcon} alt="More" /></td>
                                                                                <td align="center"><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                                            </tr>
                                                                        </When>
                                                                        <When condition = {key == 0 && (csAll == false || (csDrafted == false && this.state.surveyType == 0) || (csActive == false && this.state.surveyType == 1))}>
                                                                            <tr>
                                                                                <td colSpan="8" align="center"><span><FontAwesomeIcon icon={faExclamationCircle} /> No Survey Found</span></td>
                                                                            </tr>
                                                                        </When>
                                                                    </Choose>
                                                                )}
                                                            </Otherwise>
                                                        </Choose>
                                                    </When>
                                                    <Otherwise>
                                                        <tr>
                                                            <td colSpan="8" align="center" className="border-bottom">
                                                                <div>
                                                                    <span>No data..</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Otherwise>
                                                </Choose>
                                            </tbody>
                                        </table>
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