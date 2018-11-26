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
            ddColorIcon: './../../../images/dropdown-color-icon.png',
            token: sessionStorage.getItem('token'),
            dataTable: [],
            id: '',
            title: '',
            question: '',
            answer: [],
            answerCount: '',
            totalCount: '',
            questionType: '',
            responseCount: '',
            respondentsOverall: '',

            //customize
            display: 'hidden',
            chart: 'Horizontal Bar',
            selectChart: 'Horizontal Bar',
            bgColorChart: [],
            stackedData: [],

            //select question
            question_no: 0,
            prevVisibility: 'hidden',
            nextVisibility: 'shown',

            //card header
            activeHeader: 'ct',

            //display options header inside card
            isCheckedC: false,
            isCheckedDC: false,
            isCheckedZRAC: false,
            isCheckedBS: false,
            isCheckedSS: false,
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        const form = {
            question_no: this.state.question_no
        }

        axios.post('/api/response/question_summaries/' + id, form).then(response => {
            if(response.data.error) {
                this.props.history.push('/dashboard/response');
            } else {
                this.setState({
                    title: response.data.title,
                    question: response.data.data.question,
                    answer: response.data.data.answer,
                    answerCount: response.data.data.answerCount,
                    totalCount: response.data.totalCount,
                    dataTable: response.data.rowTable,
                    questionType: response.data.data.questionType,
                    id: id,
                    responseCount: response.data.responseCount,
                    bgColorChart: response.data.color,
                    stackedData: response.data.data.stackedData,
                    respondentsOverall: response.data.respondentsOverall
                });
            }
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
        if(e.target.dataset.value == 'chartType') {
            this.setState({
                chart: this.state.selectChart
            });
        } else if(e.target.dataset.value == 'displayOptions') {

        } else {

        }
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
                dataTable: response.data.rowTable,
                questionType: response.data.data.questionType,
                responseCount: response.data.responseCount,
                bgColorChart: response.data.color,
                stackedData: response.data.data.stackedData
            });
        }).catch(error => {
            console.log(error);
        });

        var coloR = [];
        function colorPicker() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        for(var x = 1; x <= this.state.answerCount.length; x++) {
            coloR.push(colorPicker());
        }

        this.setState({
            bgColorChart: coloR
        });
    }

    cardHeaderChange = (e) => {
        this.setState({
            activeHeader: e.target.dataset.value
        });
    }

    handleCheckChange = (e) => {
        this.setState({
            [e.target.dataset.value]: !this.state[e.target.dataset.value]
        });
    }

    responseNav = (e) => {
        this.props.history.push('/dashboard/response/' + e.target.id + '/' + this.state.id);
    }
    
	render() {
        const data = {
            labels: this.state.answer,
            datasets: [{
                data: this.state.answerCount,
                backgroundColor: this.state.bgColorChart,
                borderColor: this.state.bgColorChart,
                borderWidth: 1
            }]
        };

        const stackedData = {
            labels: ['Answers'],
            datasets: this.state.stackedData
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
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
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
                                }],
                                xAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
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
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
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
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
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
                        data={{
                            labels: this.state.answer,
                            datasets: [{
                                data: this.state.answerCount,
                                backgroundColor: 'rgba(255,99,132,0)',
                                borderColor: 'rgba(255,99,132,1)',
                                borderWidth: 3,
                                lineTension: 0,
                                borderJoinStyle: 'round',
                                pointBorderWidth: 1,
                                pointRadius: 4,
                                pointHoverBorderWidth: 10,
                                pointHoverRadius: 2
                            }]
                        }}
                        options={{
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
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
                        data={{
                            labels: this.state.answer,
                            datasets: [{
                                data: this.state.answerCount,
                                backgroundColor: 'rgba(255,99,132,0.25)',
                                borderColor: 'rgba(255,99,132,1)',
                                borderWidth: 3,
                                lineTension: 0.25,
                                borderJoinStyle: 'round',
                                pointBorderWidth: 1,
                                pointRadius: 4,
                                pointHoverBorderWidth: 10,
                                pointHoverRadius: 2
                            }]
                        }}
                        options={{
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
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

        const tableData = (
            <Choose>
                <When condition = {this.state.questionType == 'Checkbox' || this.state.questionType == 'Multiple Choice' || this.state.questionType == 'Dropdown' || this.state.questionType == 'Star'}>
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
                                    {this.state.dataTable.map((list, index) =>
                                        <tr key={index}>
                                            <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;{list.answer}</td>
                                            <td><span>{list.answerPercentage}%</span><span className="float-right">{list.answerCount}&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                        </tr>
                                    )}
                                    <tr>
                                        <th colSpan="2">Total Respondents: {this.state.responseCount}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </When>
                <Otherwise>
                    <div className="answers-part-2">
                        {this.state.answer.map((list, index) =>
                        <div className="ind-answers">
                            <div className="answers-title">
                                <span>{list.answer}</span>
                            </div>
                            <div className="yellow-div"></div>
                            <div className="answers-created">
                                <span>{list.created_at}</span>
                            </div>
                        </div>
                        )}
                    </div>
                </Otherwise>
            </Choose>
        );

        const cardData = (
            <Choose>
                <When condition = {this.state.questionType == 'Checkbox' || this.state.questionType == 'Multiple Choice' || this.state.questionType == 'Dropdown' || this.state.questionType == 'Star'}>
                    <div className="row">
                        <div className="col graph-part">
                            {graph}
                        </div>
                    </div>
                </When>
            </Choose>
        );

        const cardHeaderElement = (
            <Choose>
                <When condition = {this.state.activeHeader == 'ct'}>
                    <div className={this.state.display}>
                        <div className="header-card">
                            <div className="row">
                                <div className="col">
                                    <div className="d-flex justify-content-start">
                                        <div className="customize-nav-item cs-active" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
                                        <div className="customize-nav-item" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
                                        <div className="customize-nav-item" data-value="c" onClick={this.cardHeaderChange}>Colors</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="chart-type">
                                    <div className="d-flex justify-content-between">
                                        <div className="select-tag">
                                            <select value={this.state.selectChart} onChange={this.selectValue} disabled={this.state.questionType == 'Multiple Choice' ? false : this.state.questionType == 'Checkbox' ? false : this.state.questionType == 'Dropdown' ? false : this.state.questionType == 'Star' ? false : true}>
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
                                            <button type="button" className="charttype-save" data-value="chartType" onClick={this.saveCustomize}>Save</button>
                                            <button type="button" className="charttype-cancel" data-value="chartType" onClick={this.cancelCustomize}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </When>
                <When condition = {this.state.activeHeader == 'do'}>
                    <div className={this.state.display}>
                        <div className="header-card">
                            <div className="row">
                                <div className="col">
                                    <div className="d-flex justify-content-start">
                                        <div className="customize-nav-item" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
                                        <div className="customize-nav-item cs-active" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
                                        <div className="customize-nav-item" data-value="o" onClick={this.cardHeaderChange}>Colors</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="chart-type">
                                    <div className="do-header">
                                        <span>Show</span>
                                    </div>
                                    <div className="display-options">
                                        <div className="row">
                                            <div className="col">
                                                <label className="Chart">
                                                    <input type="checkbox" name="Chart" data-value="isCheckedC" checked={this.state.isCheckedC} onChange={this.handleCheckChange}/>
                                                    &nbsp;&nbsp;Chart
                                                </label>
                                            </div>
                                            <div className="col">
                                                <label className="DataInChart">
                                                    <input type="checkbox" name="DataInChart" data-value="isCheckedDC" checked={this.state.isCheckedDC} onChange={this.handleCheckChange}/>
                                                    &nbsp;&nbsp;Data in Chart
                                                </label>
                                            </div>
                                            <div className="col">
                                                <label className="Z-RAnswerChoices">
                                                    <input type="checkbox" name="Z-RAnswerChoices" data-value="isCheckedZRAC" checked={this.state.isCheckedZRAC} onChange={this.handleCheckChange}/>
                                                    &nbsp;&nbsp;Zero-Response Answer Choices
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <label className="BasicStatistics">
                                                    <input type="checkbox" name="BasicStatistics" data-value="isCheckedBS" checked={this.state.isCheckedBS} onChange={this.handleCheckChange}/>
                                                    &nbsp;&nbsp;Basic Statistics
                                                </label>
                                            </div>
                                            <div className="col">
                                                <label className="StatisticalSignificance">
                                                    <input type="checkbox" name="StatisticalSignificance" data-value="isCheckedSS" checked={this.state.isCheckedSS} onChange={this.handleCheckChange}/>
                                                    &nbsp;&nbsp;Statistical Significance
                                                </label>
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                    </div>
                                    <div className="buttons-save-cancel">
                                        <button type="button" className="charttype-save" data-value="displayOptions" onClick={this.saveCustomize}>Save</button>
                                        <button type="button" className="charttype-cancel" data-value="displayOptions" onClick={this.cancelCustomize}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </When>
                <Otherwise>
                    <div className={this.state.display}>
                        <div className="header-card">
                            <div className="row">
                                <div className="col">
                                    <div className="d-flex justify-content-start">
                                        <div className="customize-nav-item" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
                                        <div className="customize-nav-item" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
                                        <div className="customize-nav-item cs-active" data-value="o" onClick={this.cardHeaderChange}>Colors</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="chart-type">
                                    <div className="d-flex justify-content-between">
                                        <div className="colors-nav">
                                            <Choose>
                                                <When condition = {this.state.selectChart == 'Line Graph' || this.state.selectChart == 'Area Graph'}>
                                                    <div className="color-div" style={{backgroundColor: 'rgba(255,99,132,1)'}}>
                                                        <img src={this.state.ddColorIcon} />
                                                    </div>
                                                </When>
                                                <Otherwise>
                                                    {this.state.bgColorChart.map((list, index) =>
                                                        <div key={index}>
                                                            <div className="color-div" style={{backgroundColor: this.state.bgColorChart[index]}}>
                                                                <img src={this.state.ddColorIcon} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Otherwise>
                                            </Choose>
                                        </div>
                                        <div className="buttons-save-cancel text-right">
                                            <button type="button" className="charttype-save" data-value="colors" onClick={this.saveCustomize}>Save</button>
                                            <button type="button" className="charttype-cancel" data-value="colors" onClick={this.cancelCustomize}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Otherwise>
            </Choose>
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
                                    <div className="response-nav-item qs-active" id="question_summaries" onClick={this.responseNav}>Question Summaries</div>
                                    <div className="response-nav-item" id="data_trends" onClick={this.responseNav}>Data Trends</div>
                                    <div className="response-nav-item" id="individual_responses" onClick={this.responseNav}>Individual Responses</div>
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
                                        <span>Respondents: {this.state.responseCount + " out of " + this.state.respondentsOverall}</span>
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
                                {cardHeaderElement}
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
                                            <span>{this.state.question}</span><br/>
                                            <span className="question-type">({this.state.questionType})</span>
                                        </div>
                                    </div>
                                    {cardData}
                                    {tableData}
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