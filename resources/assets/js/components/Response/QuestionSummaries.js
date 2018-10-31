import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HorizontalBar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default class Response extends Component {
    constructor(){
        super();
        this.state = {
            backIcon: './../../../images/back-icon.png',
            token: localStorage.getItem('token'),
            dataTable: [],
            title: '',
            question: '',
            answer: '',
            answerCount: '',
            totalCount: '',

            //customize
            display: 'hidden',
            chart: 'Horizontal Bar',
            selectChart: 'Horizontal Bar',

            //select question
            question_no: 0,
            prevVisibility: 'hidden',
            nextVisibility: 'shown'
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        const form = {
            question_no: this.state.question_no
        }

        axios.post('/api/response/question_summaries/' + id, form).then(response => {
            this.setState({
                title: response.data.title,
                question: response.data.data.question,
                answer: response.data.data.answer,
                answerCount: response.data.data.answerCount,
                totalCount: response.data.totalCount,
                dataTable: response.data.rowTable
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

    customizeClick = (e) => {
        this.setState({
            display: 'shown'
        });
    }

    saveCustomize = (e) => {
        this.setState({
            chart: this.state.selectChart
        });
    }

    cancelCustomize = (e) => {
        this.setState({
            display: 'hidden'
        });
    }

    selectValue = (e) => {
        this.setState({
            selectChart: e.target.value
        });
    }

    nextPrevQuestion = (e) => {
        if(e.target.value == 0) {
            this.setState({
                question_no: parseInt(e.target.value, 10),
                nextVisibility: 'shown',
                prevVisibility: 'hidden'
            });
        } else if(e.target.value == (this.state.totalCount - 1)) {
            this.setState({
                question_no: parseInt(e.target.value, 10),
                nextVisibility: 'hidden',
                prevVisibility: 'shown'
            });
        } else {
            this.setState({
                question_no: parseInt(e.target.value, 10),
                nextVisibility: 'shown',
                prevVisibility: 'shown'
            });
        }

        //get the next data
        const { id } = this.props.match.params;
        const form = {
            question_no: parseInt(e.target.value, 10)
        }

        axios.post('/api/response/question_summaries/' + id, form).then(response => {
            this.setState({
                title: response.data.title,
                question: response.data.data.question,
                answer: response.data.data.answer,
                answerCount: response.data.data.answerCount,
                totalCount: response.data.totalCount,
                dataTable: response.data.rowTable
            });
        }).catch(error => {
            console.log(error);
        });
    }
    
	render() {
        const data = {
            labels: this.state.answer,
            datasets: [{
                data: this.state.answerCount,
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

        const stackedData = {
            labels: ['Answers'],
            datasets: [
                {
                    label: 'Online Ads',
                    data: [(2/4)*100],
                    backgroundColor: 'rgba(255,99,132,1)',
                    borderWidth: 1
                },{
                    label: 'TV',
                    data: [(0/4)*100],
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },{
                    label: 'Referral',
                    data: [(1/4)*100],
                    backgroundColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },{
                    label: 'Google',
                    data: [(1/4)*100],
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },{
                    label: 'Other (please specify)',
                    data: [(0/4)*100],
                    backgroundColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        };

        const graphData = {
            labels: ['Online Ads', 'TV', 'Referral', 'Google', 'Other (please specify)'],
            datasets: [{
                data: [(2/4)*100, (0/4)*100, (1/4)*100, (1/4)*100, (0/4)*100],
                backgroundColor: 'rgba(255,255,255,0)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                lineTension: 0,
                pointBorderWidth: 5
            }]
        };
        
        const graph = (
            <Choose>
                <When condition = {this.state.chart == 'Horizontal Bar'}>
                    <HorizontalBar
                        data={data}
                        options={{
                            legend:{
                                display:false
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Percentage"
                                    }
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chart == 'Vertical Bar'}>
                    <Bar
                        data={data}
                        options={{
                            legend:{
                                display:false
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Percentage"
                                    }
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chart == 'Stacked Horizontal Bar'}>
                    <HorizontalBar
                        data={stackedData}
                        options={{
                            legend:{
                                display:true
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    stacked: true
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chart == 'Stacked Vertical Bar'}>
                    <Bar
                        data={stackedData}
                        options={{
                            legend:{
                                display:true
                            },
                            scales: {
                                xAxes: [{
                                    stacked: true
                                }],
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    stacked: true
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chart == 'Pie Chart'}>
                    <Pie
                        data={data}
                    />
                </When>
                <When condition = {this.state.chart == 'Donut Chart'}>
                    <Doughnut
                        data={data}
                    />
                </When>
                <When condition = {this.state.chart == 'Line Graph'}>
                    <Line
                        data={graphData}
                        options={{
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    scaleLabel: {
                                    display: true,
                                    labelString: "Percentage"
                                    }
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chart == 'Area Graph'}>
                    <Line
                        data={graphData}
                        options={{
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100,
                                        callback: function(value) {
                                            return value + "%"
                                        }
                                    },
                                    scaleLabel: {
                                    display: true,
                                    labelString: "Percentage"
                                    }
                                }]
                            }
                        }}
                    />
                </When>
            </Choose>
        );

        const rowContent = this.state.dataTable.map(list =>
            <tr>
            </tr>
        );

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
                                    <div className="hover-questions d-flex justify-content-between">
                                        <div className="prev-question">
                                            <button type="button" className={this.state.prevVisibility} value={this.state.question_no - 1} onClick={this.nextPrevQuestion}><FontAwesomeIcon icon={ faArrowLeft } />&nbsp;&nbsp;&nbsp;Previous Question</button>
                                        </div>
                                        <div className="next-question">
                                            <button type="button" className={this.state.nextVisibility} value={this.state.question_no + 1} onClick={this.nextPrevQuestion}>Next Question&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={ faArrowRight } /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="response-qs-card">
                                <div className={this.state.display}>
                                    <div className="header-card">
                                        <div className="row">
                                            <div className="col">
                                                <div className="d-flex justify-content-start">
                                                    <div className="customize-nav-item cs-active">Chart Type</div>
                                                    <div className="customize-nav-item">Display Options</div>
                                                    <div className="customize-nav-item">Colors</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="chart-type">
                                                <div className="d-flex justify-content-between">
                                                    <div className="select-tag">
                                                        <select value={this.state.selectChart} onChange={this.selectValue}>
                                                            <option value="Horizontal Bar">Horizontal Bar</option>
                                                            <option value="Vertical Bar">Vertical Bar</option>
                                                            <option value="Stacked Horizontal Bar">Stacked Horizontal Bar</option>
                                                            <option value="Stacked Vertical Bar">Stacked Vertical Bar</option>
                                                            <option value="Pie Chart">Pie Chart</option>
                                                            <option value="Donut Chart">Donut Chart</option>
                                                            <option value="Line Graph">Line Graph</option>
                                                            <option value="Area Graph">Area Graph</option>
                                                        </select>
                                                    </div>
                                                    <div className="buttons-save-cancel text-right">
                                                        <button type="button" className="charttype-save" onClick={this.saveCustomize}>Save</button>
                                                        <button type="button" className="charttype-cancel" onClick={this.cancelCustomize}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="response-qs-card-content">
                                    <div className="row">
                                        <div className="col question-count">
                                            <span>Q{this.state.question_no + 1}</span>
                                        </div>
                                        <div className="col text-right page-actions">
                                            <button type="button" className="page-actions-customize" onClick={this.customizeClick}>Customize</button>
                                            <a className="page-actions-exportas dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Export As
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                <a className="dropdown-item" href="#">Question Summary Data</a>
                                                <a className="dropdown-item" href="#">Question Chart Only</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col question-title">
                                            <span>{this.state.question}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col graph-part">
                                            {graph}
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