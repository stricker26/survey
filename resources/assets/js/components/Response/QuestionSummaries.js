import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { HorizontalBar } from 'react-chartjs-2';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

const data = {
    labels: ['Online Ads', 'TV', 'Referral', 'Google', 'Other (please specify)'],
    datasets: [{
        data: [2, 0, 1, 1, 0],
        backgroundColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
};

const options = {
    options: {
        scales: {
            xAxes: [{
                ticks: {
                   min: 0,
                   max: 100,
                   callback: function(value){return value+ "%"}
                }
            }]
        }
    }
};

export default class Response extends Component {
    constructor(){
        super();
        this.state = {
            backIcon: './../../../images/back-icon.png',
            token: localStorage.getItem('token'),
            title: '',
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/response/question_summaries/' + id).then(response => {
            this.setState({
                title: response.data.title
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

    backResponse = (e) => {
        this.props.history.push('/dashboard/response');
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
                <section className="response-qs-section">
                    <div className="response-qs-header">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-start">
                                    <div className="response-nav-item" onClick={this.backResponse}><img src={this.state.backIcon} onClick={this.backResponse} />&nbsp;&nbsp;&nbsp;Back</div>
                                    <div className="response-nav-item qs-active">Question Summaries</div>
                                    <div className="response-nav-item">Data Trends</div>
                                    <div className="response-nav-item">Individual Responses</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="response-qs-body">
                        <div className="container">
                            <div className="response-qs-body-header">
                                <div className="row">
                                    <div className="col">
                                        <h3>{this.state.title}</h3>
                                        <span>Respondents: 4 out of 4</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <span>Page: 1</span>
                                </div>
                            </div>
                            <div className="response-qs-card">
                                <div className="row">
                                    <div className="col question-count">
                                        <span>Q1</span>
                                    </div>
                                    <div className="col text-right page-actions">
                                        <button type="button" className="page-actions-customize">Customize</button>
                                        <button type="button" className="page-actions-exportas">Export As</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col question-title">
                                        <span>How did you find our website?</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col graph-part">
                                        <HorizontalBar data={data} options={options} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col answers-part">
                                        <table className="response-table-answers">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <span>ANSWER CHOICES</span>
                                                        <span className="float-right"><FontAwesomeIcon icon={faCaretDown} /></span>
                                                    </th>
                                                    <th>
                                                        <span>RESPONSES</span>
                                                        <span className="float-right"><FontAwesomeIcon icon={faCaretDown} /></span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;Online Ads</td>
                                                    <td><span>50.00%</span><span className="float-right">2&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                </tr>
                                                <tr>
                                                    <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;TV</td>
                                                    <td><span>0.00%</span><span className="float-right">0&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                </tr>
                                                <tr>
                                                    <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;Referral</td>
                                                    <td><span>25.00%</span><span className="float-right">1&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                </tr>
                                                <tr>
                                                    <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;Google</td>
                                                    <td><span>25.00%</span><span className="float-right">1&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                </tr>
                                                <tr>
                                                    <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;Others(Please specify)</td>
                                                    <td><span>0.00%</span><span className="float-right">0&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                </tr>
                                                <tr>
                                                    <th colSpan="2">Total Respondents: 4</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div>&nbsp;</div>
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