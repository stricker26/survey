import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import surveyImage from './images/live-survey.jpg';

export default class Survey extends Component {
    constructor() {
        super()
        this.state = {
            editIcon: './../../images/edit-icon.png',
            analyzeIcon: './../../images/analyze-icon.png',
            shareIcon: './../../images/share-default-icon.png',
            moreIcon: './../../images/more-icon.png',
            researcherIcon: './../../images/researcher-icon.png',
        }
    }

    render() {
        return(
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section>
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
                                        <table className="table">
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
                                                <tr>
                                                    <td className="pl-4">
                                                        <div className="text-success">DIGITAL SURVEY</div>
                                                        <div>Marketing Survey Questionnaire</div>
                                                        <div className="">Created on 02/11/2018.</div>
                                                    </td>
                                                    <td><div>04/11/2018</div></td>
                                                    <td><div>5</div></td>
                                                    <td><img src={this.state.editIcon} alt="Edit" /></td>
                                                    <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                    <td><img src={this.state.shareIcon} alt="Share" /></td>
                                                    <td><img src={this.state.moreIcon} alt="More" /></td>
                                                    <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-4">
                                                        <div className="text-primary">LIVE SURVEY</div>
                                                        <div>Seminar Questionnaire</div>
                                                        <div className="">Created on 02/11/2018.</div>
                                                    </td>
                                                    <td><div>04/11/2018</div></td>
                                                    <td><div>30</div></td>
                                                    <td><img src={this.state.editIcon} alt="Edit" /></td>
                                                    <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                    <td><img src={this.state.shareIcon} alt="Share" /></td>
                                                    <td><img src={this.state.moreIcon} alt="More" /></td>
                                                    <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-4">
                                                        <div className="text-success">LIVE SURVEY</div>
                                                        <div>Health Survey Questionnaire</div>
                                                        <div className="">Created on 02/11/2018.</div>
                                                    </td>
                                                    <td><div>04/11/2018</div></td>
                                                    <td><div>5</div></td>
                                                    <td><img src={this.state.editIcon} alt="Edit" /></td>
                                                    <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                    <td><img src={this.state.shareIcon} alt="Share" /></td>
                                                    <td><img src={this.state.moreIcon} alt="More" /></td>
                                                    <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-4">
                                                        <div className="text-danger">DRAFTED SURVEY</div>
                                                        <div>Work Culture Questionnaire</div>
                                                        <div className="">Created on 02/11/2018.</div>
                                                    </td>
                                                    <td><div>04/11/2018</div></td>
                                                    <td><div>0</div></td>
                                                    <td><img src={this.state.editIcon} alt="Edit" /></td>
                                                    <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                    <td><img src={this.state.shareIcon} alt="Share" /></td>
                                                    <td><img src={this.state.moreIcon} alt="More" /></td>
                                                    <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                </tr>
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