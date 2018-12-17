import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default class FieldResearcher extends Component {
    constructor() {

        super()
        this.state = {

            surveyTitle: 'Loading..',
            token: sessionStorage.getItem('token'),

        }

    }

    componentWillMount() {
        
        const { id } = this.props.match.params;
        this.setState({ surveyID: id });

        axios.get('/api/webmaster/getSurveyName/' + id).then(response => {

            this.setState({

                surveyTitle: response.data.surveyTitle,

            });
            
        }).catch(error => {
            console.log(error);
        });
        
    }

    renderRedirect = () => {

        if(!this.state.token) {

            return <Redirect to='/dashboard/login' />

        }

    }

    render() {

        return(
            <React.Fragment>
                {this.renderRedirect()}
                <header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section className="field-researcher-section">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <div className="row">
                                    <div className="col fr-search">
                                        <div className="row">
                                            <div className="col text-center">
                                                <h3 className="mb-3">{this.state.surveyTitle}</h3>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <input type="text" className="search" placeholder="Search Researchers Name" onInput={this.searchSurvey}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col fr-table-div">
                                        <table className="table fr-table">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th className="pl-4">Researchers Name</th>
                                                    <th>Online</th>
                                                    <th>Location</th>
                                                    <th>View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><span className="text-danger"><FontAwesomeIcon icon={faTimes} /></span></td>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><FontAwesomeIcon icon={faEye} className="faEye" /></td>
                                                </tr>
                                                <tr>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><span className="text-success"><FontAwesomeIcon icon={faCheck} /></span></td>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><FontAwesomeIcon icon={faEye} className="faEye" /></td>
                                                </tr>
                                                <tr>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><span className="text-success"><FontAwesomeIcon icon={faCheck} /></span></td>
                                                    <td>Lorem Ipsum dolor</td>
                                                    <td><FontAwesomeIcon icon={faEye} className="faEye" /></td>
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