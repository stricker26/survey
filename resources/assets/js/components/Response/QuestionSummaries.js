import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
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
            data: [],
            doneRespondents: '',
            overallRespondents: '',

            //customize
            display: 'hidden',
            chart: 'Horizontal Bar',
            selectChart: 'Horizontal Bar',

            //select question
            // question_no: 0,
            // prevVisibility: 'hidden',
            // nextVisibility: 'shown',

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
                    title: response.data.surveyTitle,
                    dataTable: response.data.rowTable,
                    id: id,
                    doneRespondents: response.data.doneRespondents,
                    overallRespondents: response.data.overallRespondents,
                    data: response.data.data,
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

    // nextPrevQuestion = (e) => {
    //     if(e.target.value == 0) {
    //         this.setState({
    //             question_no: parseInt(e.target.value, 10),
    //             nextVisibility: 'shown',
    //             prevVisibility: 'hidden'
    //         });
    //     } else if(e.target.value == (this.state.totalCount - 1)) {
    //         this.setState({
    //             question_no: parseInt(e.target.value, 10),
    //             nextVisibility: 'hidden',
    //             prevVisibility: 'shown'
    //         });
    //     } else {
    //         this.setState({
    //             question_no: parseInt(e.target.value, 10),
    //             nextVisibility: 'shown',
    //             prevVisibility: 'shown'
    //         });
    //     }

    //     //get the next data
    //     const { id } = this.props.match.params;
    //     const form = {
    //         question_no: parseInt(e.target.value, 10)
    //     }

    //     axios.post('/api/response/question_summaries/' + id, form).then(response => {
    //         this.setState({
    //             title: response.data.title,
    //             question: response.data.data.question,
    //             answer: response.data.data.answer,
    //             answerCount: response.data.data.answerCount,
    //             totalCount: response.data.totalCount,
    //             dataTable: response.data.rowTable,
    //             questionType: response.data.data.questionType,
    //             responseCount: response.data.responseCount,
    //             bgColorChart: response.data.color,
    //             stackedData: response.data.data.stackedData
    //         });
    //     }).catch(error => {
    //         console.log(error);
    //     });

    //     var coloR = [];
    //     function colorPicker() {
    //         var r = Math.floor(Math.random() * 255);
    //         var g = Math.floor(Math.random() * 255);
    //         var b = Math.floor(Math.random() * 255);
    //         return "rgb(" + r + "," + g + "," + b + ")";
    //     }
    //     for(var x = 1; x <= this.state.answerCount.length; x++) {
    //         coloR.push(colorPicker());
    //     }

    //     this.setState({
    //         bgColorChart: coloR
    //     });
    // }

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

    normalData = (chartLabel, chartData, chartColor) => {
        if(chartColor == 'Slider') {
            var dataData = {
                labels: [],
                datasets: [{
                    data: chartData,
                    backgroundColor: 'rgba(255,99,132,1)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1
                }]
            };
        } else {
            var dataData = {
                labels: chartLabel,
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColor,
                    borderColor: chartColor,
                    borderWidth: 1
                }]
            };
        }

        return dataData;
    }

    lineData = (chartLabel, chartData, chartType) => {
        if(chartType == 'line') {
            var dataData = {
                labels: ['Answers'],
                datasets: [{
                    data: chartData,
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
            };
        } else {
            var dataData = {
                labels: chartLabel,
                datasets: [{
                    data: chartData,
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
            };
        }

        return dataData;
    }

    normalHorOptions = (q_type) => {
        if(q_type != 'Slider') {
            var optOptions = {
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
            };
        } else {
            var optOptions = {
                legend:{
                    display:false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
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
            };
        }

        return optOptions;
    }
    
	render() {

        // const stackedData = {
        //     labels: ['Answers'],
        //     datasets: this.state.stackedData
        // };
        
        const graph = (chartLabel, chartData, chartColor) => (
            <Choose>
                <When condition = {this.state.chart == 'Horizontal Bar'}>
                    <HorizontalBar
                        data={this.normalData(chartLabel, chartData, chartColor)}
                        options={this.normalHorOptions(chartColor)}
                    />
                </When>
                <When condition = {this.state.chart == 'Vertical Bar'}>
                    <Bar
                        data={this.normalData(chartLabel, chartData, chartColor)}
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
                        data={this.normalData(chartLabel, chartData, chartColor)}
                    />
                </When>
                <When condition = {this.state.chart == 'Donut Chart'}>
                    <Doughnut
                        data={this.normalData(chartLabel, chartData, chartColor)}
                    />
                </When>
                <When condition = {this.state.chart == 'Line Graph'}>
                    <Line
                        data={this.lineData(chartLabel, chartData, 'line')}
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
                        data={this.lineData(chartLabel, chartData, 'area')}
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

        // const tableData = (
        //     <Choose>
        //         <Otherwise>
        //             <div className="answers-part-2">
        //                 {this.state.answer.map((list, index) =>
        //                 <div className="ind-answers">
        //                     <div className="answers-title">
        //                         <span>{list.answer}</span>
        //                     </div>
        //                     <div className="yellow-div"></div>
        //                     <div className="answers-created">
        //                         <span>{list.created_at}</span>
        //                     </div>
        //                 </div>
        //                 )}
        //             </div>
        //         </Otherwise>
        //     </Choose>
        // );

        // const cardHeaderElement = (
        //     <Choose>
        //         <When condition = {this.state.activeHeader == 'ct'}>
        //             <div className={this.state.display}>
        //                 <div className="header-card">
        //                     <div className="row">
        //                         <div className="col">
        //                             <div className="d-flex justify-content-start">
        //                                 <div className="customize-nav-item cs-active" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
        //                                 <div className="customize-nav-item" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
        //                                 <div className="customize-nav-item" data-value="c" onClick={this.cardHeaderChange}>Colors</div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">
        //                     <div className="col">
        //                         <div className="chart-type">
        //                             <div className="d-flex justify-content-between">
        //                                 <div className="select-tag">
        //                                     <select value={this.state.selectChart} onChange={this.selectValue} disabled={this.state.questionType == 'Multiple Choice' ? false : this.state.questionType == 'Checkbox' ? false : this.state.questionType == 'Dropdown' ? false : this.state.questionType == 'Star' ? false : true}>
        //                                         <option value="Horizontal Bar">Horizontal Bar</option>
        //                                         <option value="Vertical Bar">Vertical Bar</option>
        //                                         <option value="Stacked Horizontal Bar">Stacked Horizontal Bar</option>
        //                                         <option value="Stacked Vertical Bar">Stacked Vertical Bar</option>
        //                                         <option value="Pie Chart">Pie Chart</option>
        //                                         <option value="Donut Chart">Donut Chart</option>
        //                                         <option value="Line Graph">Line Graph</option>
        //                                         <option value="Area Graph">Area Graph</option>
        //                                     </select>
        //                                 </div>
        //                                 <div className="buttons-save-cancel text-right">
        //                                     <button type="button" className="charttype-save" data-value="chartType" onClick={this.saveCustomize}>Save</button>
        //                                     <button type="button" className="charttype-cancel" data-value="chartType" onClick={this.cancelCustomize}>Cancel</button>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </When>
        //         <When condition = {this.state.activeHeader == 'do'}>
        //             <div className={this.state.display}>
        //                 <div className="header-card">
        //                     <div className="row">
        //                         <div className="col">
        //                             <div className="d-flex justify-content-start">
        //                                 <div className="customize-nav-item" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
        //                                 <div className="customize-nav-item cs-active" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
        //                                 <div className="customize-nav-item" data-value="o" onClick={this.cardHeaderChange}>Colors</div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">
        //                     <div className="col">
        //                         <div className="chart-type">
        //                             <div className="do-header">
        //                                 <span>Show</span>
        //                             </div>
        //                             <div className="display-options">
        //                                 <div className="row">
        //                                     <div className="col">
        //                                         <label className="Chart">
        //                                             <input type="checkbox" name="Chart" data-value="isCheckedC" checked={this.state.isCheckedC} onChange={this.handleCheckChange}/>
        //                                             &nbsp;&nbsp;Chart
        //                                         </label>
        //                                     </div>
        //                                     <div className="col">
        //                                         <label className="DataInChart">
        //                                             <input type="checkbox" name="DataInChart" data-value="isCheckedDC" checked={this.state.isCheckedDC} onChange={this.handleCheckChange}/>
        //                                             &nbsp;&nbsp;Data in Chart
        //                                         </label>
        //                                     </div>
        //                                     <div className="col">
        //                                         <label className="Z-RAnswerChoices">
        //                                             <input type="checkbox" name="Z-RAnswerChoices" data-value="isCheckedZRAC" checked={this.state.isCheckedZRAC} onChange={this.handleCheckChange}/>
        //                                             &nbsp;&nbsp;Zero-Response Answer Choices
        //                                         </label>
        //                                     </div>
        //                                 </div>
        //                                 <div className="row">
        //                                     <div className="col">
        //                                         <label className="BasicStatistics">
        //                                             <input type="checkbox" name="BasicStatistics" data-value="isCheckedBS" checked={this.state.isCheckedBS} onChange={this.handleCheckChange}/>
        //                                             &nbsp;&nbsp;Basic Statistics
        //                                         </label>
        //                                     </div>
        //                                     <div className="col">
        //                                         <label className="StatisticalSignificance">
        //                                             <input type="checkbox" name="StatisticalSignificance" data-value="isCheckedSS" checked={this.state.isCheckedSS} onChange={this.handleCheckChange}/>
        //                                             &nbsp;&nbsp;Statistical Significance
        //                                         </label>
        //                                     </div>
        //                                     <div className="col"></div>
        //                                 </div>
        //                             </div>
        //                             <div className="buttons-save-cancel">
        //                                 <button type="button" className="charttype-save" data-value="displayOptions" onClick={this.saveCustomize}>Save</button>
        //                                 <button type="button" className="charttype-cancel" data-value="displayOptions" onClick={this.cancelCustomize}>Cancel</button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </When>
        //         <Otherwise>
        //             <div className={this.state.display}>
        //                 <div className="header-card">
        //                     <div className="row">
        //                         <div className="col">
        //                             <div className="d-flex justify-content-start">
        //                                 <div className="customize-nav-item" data-value="ct" onClick={this.cardHeaderChange}>Chart Type</div>
        //                                 <div className="customize-nav-item" data-value="do" onClick={this.cardHeaderChange}>Display Options</div>
        //                                 <div className="customize-nav-item cs-active" data-value="o" onClick={this.cardHeaderChange}>Colors</div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">
        //                     <div className="col">
        //                         <div className="chart-type">
        //                             <div className="d-flex justify-content-between">
        //                                 <div className="colors-nav">
        //                                     <Choose>
        //                                         <When condition = {this.state.selectChart == 'Line Graph' || this.state.selectChart == 'Area Graph'}>
        //                                             <div className="color-div" style={{backgroundColor: 'rgba(255,99,132,1)'}}>
        //                                                 <img src={this.state.ddColorIcon} />
        //                                             </div>
        //                                         </When>
        //                                         <Otherwise>
        //                                             {this.state.bgColorChart.map((list, index) =>
        //                                                 <div key={index}>
        //                                                     <div className="color-div" style={{backgroundColor: this.state.bgColorChart[index]}}>
        //                                                         <img src={this.state.ddColorIcon} />
        //                                                     </div>
        //                                                 </div>
        //                                             )}
        //                                         </Otherwise>
        //                                     </Choose>
        //                                 </div>
        //                                 <div className="buttons-save-cancel text-right">
        //                                     <button type="button" className="charttype-save" data-value="colors" onClick={this.saveCustomize}>Save</button>
        //                                     <button type="button" className="charttype-cancel" data-value="colors" onClick={this.cancelCustomize}>Cancel</button>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </Otherwise>
        //     </Choose>
        // );

        const qsContent = this.state.data.map((e, key) =>
            <div className="response-qs-card" key={key}>
                <div className="response-qs-card-content">
                    {/*<div className="row">
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
                    </div>*/}
                    <div className="row">
                        <div className="col question-count">
                            <span>Q{key + 1}</span>
                        </div>
                    </div>
                    <div className="row pb-2">
                        <div className="col question-title">
                            <span>{e.title}</span><br/>
                            <span className="question-type">({e.type})</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col question-ans-skip">
                            <span className="qs-answered">
                                Answers: <strong>{e.answered_respondents}</strong>
                            </span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="qs-skipped">
                                Skipped: <strong>{e.skipped_respondents}</strong>
                            </span>
                        </div>
                    </div>
                    <Choose>{/*Check if it has respondents*/}
                        <When condition = {e.answerLength != 0}>
                            <Choose>
                                <When condition = {e.type == 'Multiple Choice' || e.type == 'Checkbox' || e.type == 'Star' || e.type == 'Dropdown'}>
                                    <div className="row">
                                        <div className="col graph-part">
                                            {graph(e.labelChart, e.percentage, e.color)}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col answers-part">
                                            <table className="response-table-answers">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>Answer Choices</span>
                                                        </th>
                                                        <th>
                                                            <span>Responses</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {e.dataTable.map((list, index) =>
                                                        <tr key={index}>
                                                            <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;{list.choice}</td>
                                                            <td><span>{list.answerPercentage}%</span><span className="float-right">{list.answerTotal}&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <th colSpan="2">Total Respondents: {e.answered_respondents}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </When>
                                <When condition = {e.type == 'Slider'}>
                                    <div className="row">
                                        <div className="col graph-part">
                                            {graph(e.labelChart, e.data, e.type)}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col answers-part">
                                            <table className="response-table-answers-slider">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>Responses</span>
                                                        </th>
                                                        <th>
                                                            <span>Average</span>
                                                        </th>
                                                        <th>
                                                            <span>Total</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;Responses
                                                        </td>
                                                        <td>{e.average}</td>
                                                        <td>{e.total}</td>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3">Total Respondents: {e.answered_respondents}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </When>
                                <When condition = {e.type == 'Essay' || e.type == 'Comment' || e.type == 'Textbox' || e.type == 'Date'}>
                                    <div className="answers-part-2">
                                        <div className="row">
                                            <div className="col">
                                                {e.answer.map((list, index) =>
                                                    <Choose>
                                                        <When condition = {index <= 2}>{/*2 is the length of the data that can be displayed on question summaries*/}
                                                            <div className="ind-answers" key={index}>
                                                                <div>
                                                                    <div className="answers-title">
                                                                        <span>{list.answer}</span>
                                                                    </div>
                                                                    <div className="yellow-div"></div>
                                                                    <div className="answers-created">
                                                                        <span>{list.created_at}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </When>
                                                        <When condition = {index == 3}>
                                                            <div className="text-center pt-2 pb-1" key={index}>
                                                                <span>.......</span>
                                                            </div>
                                                        </When>
                                                    </Choose>
                                                )}
                                            </div>
                                        </div>
                                        <If condition = {e.answerLength >= 4}>
                                            <div className="row">
                                                <div className="col text-center">
                                                    <div className="btn-view-question" >
                                                        <button type="button" data-surveyid={this.state.id} value={e.id}>View All Responses</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </If>
                                    </div>
                                </When>
                                <When condition = {e.type == 'Contact' || e.type == 'Textboxes'}>
                                    <div className="row pt-4">
                                        <div className="col answers-part">
                                            <table className="response-table-answers">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>Labels</span>
                                                        </th>
                                                        <th>
                                                            <span>Responses</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {e.dataTable.map((list, index) =>
                                                        <tr key={index}>
                                                            <td><FontAwesomeIcon icon={faCaretDown} />&nbsp;&nbsp;&nbsp;&nbsp;{list.choice}</td>
                                                            <td><span>{list.answerPercentage}%</span><span className="float-right">{list.answerTotal}&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <th colSpan="2">Total Respondents: {e.answered_respondents}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </When>
                            </Choose>
                        </When>
                        <Otherwise>
                            <div className="row">
                                <div className="col text-center">
                                    <h5><FontAwesomeIcon icon={faExclamationCircle} /> No Responses</h5>
                                </div>
                            </div>
                        </Otherwise>
                    </Choose>
                </div>
            </div>
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
                                        <span>Respondents: {this.state.doneRespondents + " out of " + this.state.overallRespondents}</span>
                                    </div>
                                </div>
                            </div>
                            {qsContent}
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