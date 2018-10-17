import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import surveyImage from './images/live-survey.jpg';

export default class Survey extends Component {
    constructor() {
        super()
        this.state = {
            surveyLists: [],
            editIcon: './../../images/edit-icon.png',
            analyzeIcon: './../../images/analyze-icon.png',
            shareIcon: './../../images/share-default-icon.png',
            moreIcon: './../../images/more-icon.png',
            researcherIcon: './../../images/researcher-icon.png',
        }
    }

    componentWillMount() {

        axios.get('/api/webmaster/lists').then(response => {
            this.setState({
                surveyLists: response.data
            });
            console.log(response);
        }).catch(error => { 
            console.log(error);
        });

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
                                                {this.state.surveyLists.map(list => 
                                                    <tr>
                                                        <td className="pl-4">
                                                            <div className="text-success">DIGITAL SURVEY</div>
                                                            <div>{list.title}</div>
                                                            <div className="">Created on {list.created_at}.</div>
                                                        </td>
                                                        <td><div>{list.updated_at}</div></td>
                                                        <td><div>0</div></td>
                                                        <td><Link to={'/dashboard/survey/'+ list.survey_id +'/view'}><img src={this.state.editIcon} alt="Edit" /></Link></td>
                                                        <td><img src={this.state.analyzeIcon} alt="Analyze" /></td>
                                                        <td><img src={this.state.shareIcon} alt="Share" /></td>
                                                        <td><img src={this.state.moreIcon} alt="More" /></td>
                                                        <td><img src={this.state.researcherIcon} alt="Researcher" /></td>
                                                    </tr>
                                                )}
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