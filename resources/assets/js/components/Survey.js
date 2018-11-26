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
            token: sessionStorage.getItem('token')
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

    componentWillMount() {
        const form = {
            token: this.state.token
        }

        axios.post('/api/webmaster/lists', form).then(response => {
            this.setState({
                surveyLists: response.data
            });
        }).catch(error => { 
            console.log(error);
        });
    }

    render() {
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
                    </div>
                </header>
                <section className="dashboard-survey">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <div className="row mt-5 mb-5">
                                    <div className="col-lg-2 mr-5">
                                        <select className="dropdown">
                                            <option value="All Surveys">All Surveys</option>
                                            <option value="Digital Survey">Digital Survey</option>
                                            <option value="Live Survey">Live Survey</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-3">
                                        <input type="text" className="search" placeholder="Search Survey Name" />
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
                                                    <When condition = {this.state.surveyLists.length != 0}>
                                                        {this.state.surveyLists.map(list => 
                                                            <tr key={list.id}>
                                                                <td className="pl-4">
                                                                    <div className="text-success">DIGITAL SURVEY</div>
                                                                    <div>{list.title}</div>
                                                                    <div className="">Created on {list.created_at}.</div>
                                                                </td>
                                                                <td><div>{list.updated_at}</div></td>
                                                                <td><div>0</div></td>
                                                                <td><Link to={'/dashboard/survey/'+ list.survey_id +'/view'}><img src={this.state.editIcon} alt="Edit" /></Link></td>
                                                                <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                                <td><img src={this.state.shareIcon} alt="Share" onClick={this.shareSurvey(list.survey_id)} /></td>
                                                                <td><img src={this.state.moreIcon} alt="More" /></td>
                                                                <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                            </tr>
                                                        )}
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