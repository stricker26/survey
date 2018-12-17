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

            token: sessionStorage.getItem('token'),
            lists: [],

        }

    }

    componentWillMount() {

        const form = {

            token: this.state.token

        };

        axios.post('/api/webmaster/getFieldResearchers/all' , form).then(response => {

            this.setState({

                lists: response.data.lists,

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
                                    <div className="col-lg-4 fr-search">
                                        <input type="text" className="search" placeholder="Search Researchers Name" onInput={this.searchSurvey}/>
                                    </div>
                                    <div className="col-lg-8 fr-create text-right">
                                        <Link to={'/dashboard/register/researcher'}><button type="button" className="btn btn-primary">Create Account</button></Link>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col fr-table-div">
                                        <table className="table fr-table">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th className="pl-4">Researchers Name</th>
                                                    <th>Online</th>
                                                    <th>Device Serial</th>
                                                    <th>Device Model</th>
                                                    <th>Current Survey</th>
                                                    <th>Location</th>
                                                    <th>View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <Choose>
                                                    <When condition = {this.state.lists.length != 0}>
                                                        {this.state.lists.map((e, index) =>
                                                            <tr key={index}>
                                                                <td className="pl-4">{e.name}</td>
                                                                <td><span className="text-danger"><FontAwesomeIcon icon={faTimes} /></span></td>
                                                                <td>{e.serial}</td>
                                                                <td>{e.model}</td>
                                                                <td>{e.survey}</td>
                                                                <td>Lorem Ipsum Dolor</td>
                                                                <td><FontAwesomeIcon icon={faEye} className="faEye" /></td>
                                                            </tr>
                                                        )}
                                                    </When>
                                                    <Otherwise>
                                                        <tr>
                                                            <td colSpan="7" align="center" className="border-bottom">
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