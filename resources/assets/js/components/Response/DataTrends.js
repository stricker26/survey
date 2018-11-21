import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default class Response extends Component {
    constructor(){
        super();
        var coloR= [];
        function colorPicker() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        for(var x = 1; x <= 24; x++) {
            coloR.push(colorPicker());
        }
        this.state = {
            backIcon: './../../../images/back-icon.png',
            token: sessionStorage.getItem('token'),
            id: '',
            title: '',
            bgColorsFirstCard: coloR,
            yMax1: '',

            //first card
            nextGraph: 'show',
            prevGraph: 'hidden',
            lengthGraph: '',
            countGraph: 1,
            buttonFirstCardDisplay: 'hidden',

            chartType: 'Bar',
            trendBy: 'Hour',

            labelsFirstCard: '',
            dataFirstCard: '',

            //header buttons
            zoomData: [],
            zoomData2: [],

            //secondcard
            nextQuestion: 'show',
            prevQuestion: 'hidden',
            lengthQuestion: '',
            countQuestion: 1,
            buttonSecondCardDisplay: 'hidden',

            chartType2: 'Bar',
            trendBy2: 'Hour',
            
            labelsSecondCard: '',
            dataSecondCard: '',
            nextSecondGraph: 'show',
            prevSecondGraph: 'hidden',
            lengthSecondGraph: '',
            countSecondGraph: 1,

            firstResponse: '',
            respondentCount: '',
            respondentSkipped: 0,
            question: '',
            answers: '',
            lengthAnswer: '',
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/response/data_trends/' + id).then(response => {
            this.setState({
                title: response.data.title,
                id: id,

                //first card
                labelsFirstCard: response.data.labelsFirstCard,
                dataFirstCard: response.data.dataFirstCard,
                zoomData: response.data.zoomData,
                zoomData2: response.data.zoomData,
                yMax1: response.data.yMax1,
                lengthGraph: response.data.lengthCard1,

                //second card
                firstResponse: response.data.firstResponse,

                question: response.data.secondCard.question[0],
                respondentCount: response.data.secondCard.answerCount,
                respondentsTotalCount: response.data.respondentsOverall,
                respondentsCount: response.data.respondentsTotal,
                respondentSkipped: response.data.secondCard.skippedCount,

                labelsSecondCard: response.data.secondCard.labelsSecondCard,
                lengthQuestion: response.data.secondCard.questionCount,
                lengthAnswer: response.data.secondCard.lengthAnswer,
                dataSecondCard: response.data.secondCard.dataSecondCard,
                lengthSecondGraph: response.data.lengthCard1,
            });

            if(response.data.lengthCard1 <= 1) {
                this.setState({
                    buttonFirstCardDisplay: 'hidden',
                    nextGraph: 'hidden',
                    prevGraph: 'hidden',

                    nextSecondGraph: 'hidden',
                    prevSecondGraph: 'hidden',
                    buttonSecondCardDisplayGraph: 'hidden'
                });
            } else {
                this.setState({
                    buttonFirstCardDisplay: 'show',
                    buttonSecondCardDisplayGraph: 'show'
                });
            }

            if(response.data.secondCard.question.length <= 1) {
                this.setState({
                    buttonSecondCardDisplay: 'hidden',
                    nextQuestion: 'hidden',
                    prevQuestion: 'hidden'

                });
            } else {
                this.setState({
                    buttonSecondCardDisplay: 'show'
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    chartType = (e) => {
        this.setState({
            chartType: e.target.dataset.value
        });
    }

    trendByBtn = (e) => {
        if(this.state.trendBy != e.target.dataset.value) {
            function colorPicker() {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            }
            var coloR = [];

            if(e.target.dataset.value == 'Month') {
                for(var x = 1; x <= 12; x++) {
                    coloR.push(colorPicker());
                }
                this.setState({
                    trendBy: e.target.dataset.value
                });
            } else if(e.target.dataset.value == 'Day') {
                for(var x = 1; x <= 31; x++) {
                    coloR.push(colorPicker());
                }
                this.setState({
                    trendBy: e.target.dataset.value
                });
            } else {
                for(var x = 1; x <= 24; x++) {
                    coloR.push(colorPicker());
                }

                this.setState({
                    trendBy: e.target.dataset.value
                });
            }

            const form = {
                trendOption: e.target.dataset.value
            }

            axios.post('/api/response/data_trends/getTrend/' + this.state.id, form).then(response => {
                if(response.data.lengthCard1 <= 1) {
                    this.setState({
                        labelsFirstCard: response.data.labelsFirstCard,
                        dataFirstCard: response.data.dataFirstCard,
                        zoomData: response.data.zoomData,
                        lengthGraph: response.data.lengthCard1,
                        buttonFirstCardDisplay: 'hidden',
                        countGraph: 1,
                        nextGraph: 'hidden',
                        prevGraph: 'hidden',
                        yMax1: response.data.yMax
                    });
                } else if(response.data.lengthCard1 > 1){
                    this.setState({
                        labelsFirstCard: response.data.labelsFirstCard,
                        dataFirstCard: response.data.dataFirstCard,
                        zoomData: response.data.zoomData,
                        lengthGraph: response.data.lengthCard1,
                        buttonFirstCardDisplay: 'show',
                        countGraph: 1,
                        prevGraph: 'hidden',
                        nextGraph: 'show',
                        yMax1: response.data.yMax
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    trendByBtn2 = (e) => {
        if(this.state.trendBy2 != e.target.dataset.value) {
            function colorPicker() {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            }
            var coloR = [];

            if(e.target.dataset.value == 'Month') {
                for(var x = 1; x <= 12; x++) {
                    coloR.push(colorPicker());
                }
                this.setState({
                    trendBy2: e.target.dataset.value,
                });
            } else if(e.target.dataset.value == 'Day') {
                for(var x = 1; x <= 31; x++) {
                    coloR.push(colorPicker());
                }
                this.setState({
                    trendBy2: e.target.dataset.value,
                });
            } else {
                for(var x = 1; x <= 24; x++) {
                    coloR.push(colorPicker());
                }

                this.setState({
                    trendBy2: e.target.dataset.value,
                });
            }

            const form = {
                trendOption: e.target.dataset.value,
                q_id: this.state.question['q_id'],
            }
            axios.post('/api/response/data_trends/getTrend2/' + this.state.id, form).then(response => {
                this.setState({
                    zoomData2: response.data.zoomData,
                    labelsSecondCard: response.data.labelsSecondCard,
                    dataSecondCard: response.data.dataSecondCard,
                    prevSecondGraph: 'hidden',
                    countSecondGraph: 1,
                    lengthSecondGraph: response.data.lengthCard1
                });

                if(response.data.lengthCard1 <= 1) {
                    this.setState({
                        buttonSecondCardDisplayGraph: 'hidden',
                        nextSecondGraph: 'hidden',
                    });
                } else if(response.data.lengthCard1 > 1){
                    this.setState({
                        buttonSecondCardDisplayGraph: 'show',
                        nextSecondGraph: 'show',
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    nextPrevGraph = (e) => {
        if(e.target.dataset.value == 'graph') {
            if(e.target.dataset.name == 'prev') {
                var newCount = this.state.countGraph - 1;
            } else if(e.target.dataset.name == 'next') {
                var newCount = this.state.countGraph + 1;
            }

            if(newCount == 1) {
                this.setState({
                    countGraph: newCount,
                    prevGraph: 'hidden',
                    nextGraph: 'show'
                });
                var passCount = 1;
            } else if(newCount == this.state.lengthGraph) {
                this.setState({
                    countGraph: newCount,
                    prevGraph: 'show',
                    nextGraph: 'hidden'
                });
                var passCount = this.state.lengthGraph;
            } else if(newCount > 1 || newCount < this.state.lengthGraph) {
                this.setState({
                    countGraph: newCount,
                    prevGraph: 'show',
                    nextGraph: 'show'
                });
                var passCount = newCount;
            } else {
                var passCount = false;
            }

            if(passCount) {
                const form = {
                    count: newCount,
                    trend: this.state.trendBy,
                    type: 'firstGraph'
                };

                axios.post('/api/response/data_trends/nextGraph/' + this.state.id, form).then(response => {
                    this.setState({
                        labelsFirstCard: response.data.labelsFirstCard,
                        dataFirstCard: response.data.dataFirstCard,
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        } else if(e.target.dataset.value == 'question'){
            if(e.target.dataset.name == 'prev') {
                var newCount = this.state.countQuestion - 1;
            } else if(e.target.dataset.name == 'next') {
                var newCount = this.state.countQuestion + 1;
            }

            if(newCount == 1) {
                this.setState({
                    countQuestion: newCount,
                    prevQuestion: 'hidden',
                    nextQuestion: 'show'
                });
                var passCount = 1;
            } else if(newCount == this.state.lengthQuestion) {
                this.setState({
                    countQuestion: newCount,
                    prevQuestion: 'show',
                    nextQuestion: 'hidden'
                });
                var passCount = this.state.lengthQuestion;
            } else if(newCount > 1 || newCount < this.state.lengthQuestion) {
                this.setState({
                    countQuestion: newCount,
                    prevQuestion: 'show',
                    nextQuestion: 'show'
                });
                var passCount = newCount;
            } else {
                var passCount = false;
            }

            if(passCount) {
                const form = {
                    count: newCount,
                    trend: this.state.trendBy2,
                    type: 'secondQuestion'
                };

                axios.post('/api/response/data_trends/nextGraph/' + this.state.id, form).then(response => {
                    if(response.data.isArray) {
                        if(response.data.lengthCard2 <= 1) {
                            this.setState({
                                question: response.data.secondCard.question,
                                countSecondGraph: 1,
                                respondentCount: response.data.respondentCount,
                                respondentSkipped: response.data.respondentSkipped,

                                dataSecondCard: response.data.secondCard.dataSecondCard,
                                labelsSecondCard: response.data.secondCard.labelsSecondCard,
                                buttonSecondCardDisplayGraph: 'hidden',
                                prevSecondGraph: 'hidden',
                                nextSecondGraph: 'hidden',
                                lengthSecondGraph: response.data.lengthCard2,
                            });
                        } else {
                            this.setState({
                                question: response.data.secondCard.question,
                                countSecondGraph: 1,
                                prevSecondGraph: 'hidden',
                                nextSecondGraph: 'show',
                                respondentCount: response.data.respondentCount,
                                respondentSkipped: response.data.respondentSkipped,

                                dataSecondCard: response.data.secondCard.dataSecondCard,
                                labelsSecondCard: response.data.secondCard.labelsSecondCard,
                                buttonSecondCardDisplayGraph: 'show',
                                lengthSecondGraph: response.data.lengthCard2,
                            });
                        }
                    } else {
                        this.setState({
                            question: response.data.secondCard.question,
                            respondentCount: response.data.respondentCount,
                            respondentSkipped: response.data.respondentSkipped,
                            countSecondGraph: 1,
                            prevSecondGraph: 'hidden',
                            nextSecondGraph: 'show',
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        } else if(e.target.dataset.value == 'secondGraph'){
            if(e.target.dataset.name == 'prev') {
                var newCount = this.state.countSecondGraph - 1;
            } else if(e.target.dataset.name == 'next') {
                var newCount = this.state.countSecondGraph + 1;
            }

            if(newCount == 1) {
                this.setState({
                    countSecondGraph: newCount,
                    prevSecondGraph: 'hidden',
                    nextSecondGraph: 'show'
                });
                var passCount = 1;
            } else if(newCount == this.state.lengthSecondGraph) {
                this.setState({
                    countSecondGraph: newCount,
                    prevSecondGraph: 'show',
                    nextSecondGraph: 'hidden'
                });
                var passCount = this.state.lengthSecondGraph;
            } else if(newCount > 1 || newCount < this.state.lengthSecondGraph) {
                this.setState({
                    countSecondGraph: newCount,
                    prevSecondGraph: 'show',
                    nextSecondGraph: 'show'
                });
                var passCount = newCount;
            } else {
                var passCount = false;
            }

            if(passCount) {
                const form = {
                    count: newCount,
                    trend: this.state.trendBy2,
                    type: 'secondGraph',
                    q_type: this.state.question['q_type'],
                    q_id: this.state.question['q_id']
                };

                axios.post('/api/response/data_trends/nextGraph/' + this.state.id, form).then(response => {
                    this.setState({
                        labelsSecondCard: response.data.labelsSecondCard,
                        dataSecondCard: response.data.dataSecondCard,
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }

    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }

    backResponse = (e) => {
        this.props.history.push('/dashboard/response');
    }

    responseNav = (e) => {
        this.props.history.push('/dashboard/response/' + e.target.id + '/' + this.state.id);
    }
    
	render() {
        var data = {
            labels: this.state.labelsFirstCard,
            datasets: [{
                data: this.state.dataFirstCard,
                backgroundColor: this.state.bgColorsFirstCard,
                borderColor: this.state.bgColorsFirstCard,
                borderWidth: 1
            }]
        };

        const chartData = (
            <Choose>
                <When condition = {this.state.chartType == 'Bar'}>
                    <Bar
                        data={data}
                        options={{
                            legend:{
                                display:false
                            },
                            responsive: true,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0, // it is for ignoring negative step.
                                        max: this.state.yMax1,
                                        beginAtZero: true,
                                        callback: function(value, index, values) {
                                            if (Math.floor(value) === value) {
                                                return value;
                                            }
                                        }
                                    }
                                }],
                                xAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
                                    categoryPercentage: 0.95,
                                    barPercentage: 0.95,
                                    ticks: {
                                        autoSkip: false
                                    }
                                }]
                            }
                        }}
                    />
                </When>
                <When condition = {this.state.chartType == 'Line'}>
                    <Line
                        data={{
                            labels: this.state.labelsFirstCard,
                            datasets: [{
                                data: this.state.dataFirstCard,
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
                            legend:{
                                display:false
                            },
                            responsive: true,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0, // it is for ignoring negative step.
                                        max: this.state.yMax1,
                                        beginAtZero: true,
                                        callback: function(value, index, values) {
                                            if (Math.floor(value) === value) {
                                                return value;
                                            }
                                        }
                                    }
                                }],
                                xAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    },
                                    ticks: {
                                        autoSkip: false
                                    }
                                }]
                            }
                        }}
                    />
                </When>
            </Choose>
        );

        const zoomData = this.state.zoomData.map((list, index) =>
            <span className="dropdown-item" value={index + 1} key={index}>{list}</span>
        );

        const zoomData2 = this.state.zoomData2.map((list, index) =>
            <span className="dropdown-item" value={index + 1} key={index}>{list}</span>
        );

		return(
			<React.Fragment>
                {this.renderRedirect()}
				<header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section className="response-dt-section">
                    <div className="response-dt-header">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-start">
                                    <div className="response-nav-item" onClick={this.backResponse}><img src={this.state.backIcon} onClick={this.backResponse} />&nbsp;&nbsp;&nbsp;Back</div>
                                    <div className="response-nav-item" id="question_summaries" onClick={this.responseNav}>Question Summaries</div>
                                    <div className="response-nav-item dt-active" id="data_trends" onClick={this.responseNav}>Data Trends</div>
                                    <div className="response-nav-item" id="individual_responses" onClick={this.responseNav}>Individual Responses</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="response-dt-body">
                        <div className="container">
                            <div className="response-dt-body-header">
                                <div className="row">
                                    <div className="col">
                                        <h3>{this.state.title}</h3>
                                        <span>Respondents: {this.state.respondentsCount + " out of " + this.state.respondentsTotalCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="response-dt-card">
                                <div className="dt-card-header">
                                    <div className="row">
                                        <div className="col text-right">
                                            <div className="card-header-buttons">
                                                <button className="chartTypeBtn" type="button" id="chartTypeBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Chart Type<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="chartTypeBtn">
                                                    <span className="dropdown-item" data-value="Bar" onClick={this.chartType}>Bar</span>
                                                    <span className="dropdown-item" data-value="Line" onClick={this.chartType}>Line</span>
                                                </div>
                                            </div>
                                            <div className="card-header-buttons">
                                                <button className="trendBtn" type="button" id="trendBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trend by {this.state.trendBy}<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="trendBtn">
                                                    {/*<span className="dropdown-item" data-value="Month" onClick={this.trendByBtn}>Month</span>*/}
                                                    <span className="dropdown-item" data-value="Day" onClick={this.trendByBtn}>Day</span>
                                                    <span className="dropdown-item" data-value="Hour" onClick={this.trendByBtn}>Hour</span>
                                                </div>
                                            </div>
                                            <div className="card-header-buttons">
                                                <button className="zoomBtn" type="button" id="zoomBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Zoom<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="zoomBtn">
                                                    {zoomData}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dt-card-body">
                                    <div className="card-body-header">
                                        <span>Responses (by {this.state.trendBy})</span>
                                    </div>
                                    <span><small>Zoom: {this.state.labelsFirstCard[0]} - {this.state.labelsFirstCard[this.state.labelsFirstCard.length - 1]}</small></span>
                                    <div className={"d-flex justify-content-between pt-2 pr-4 pl-4 " + this.state.buttonFirstCardDisplay}>
                                        <span className={"card-body-graph-prev " + this.state.prevGraph} data-name="prev" data-value="graph" onClick={this.nextPrevGraph}><FontAwesomeIcon data-name="prev" data-value="graph" icon={faChevronLeft} />&nbsp;&nbsp;&nbsp;Prev</span>
                                        <span></span>
                                        <span className={"card-body-graph-prev " + this.state.nextGraph} data-name="next" data-value="graph" onClick={this.nextPrevGraph}>Next&nbsp;&nbsp;&nbsp;<FontAwesomeIcon data-name="next" data-value="graph" icon={faChevronRight} /></span>
                                    </div>
                                    <div className="card-body-graph">
                                        {chartData}
                                    </div>
                                </div>
                            </div>
                            <div className="page-count"></div>
                            <div className={"d-flex justify-content-between " + this.state.buttonSecondCardDisplay}>
                                <span className={"card-body-question-prev " + this.state.prevQuestion} data-name="prev" data-value="question" onClick={this.nextPrevGraph}><FontAwesomeIcon data-name="prev" data-value="question" icon={faChevronLeft} />&nbsp;&nbsp;&nbsp;Prev Question</span>
                                <span></span>
                                <span className={"card-body-question-next " + this.state.nextQuestion} data-name="next" data-value="question" onClick={this.nextPrevGraph}>Next Question&nbsp;&nbsp;&nbsp;<FontAwesomeIcon data-name="next" data-value="question" icon={faChevronRight} /></span>
                            </div>
                            <div className="response-dt-card">
                                <div className="dt-card-header">
                                    <div className="float-right">
                                        <div className="card-header-buttons">
                                            <button className="trendBtn" type="button" id="trendBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trend by {this.state.trendBy2}<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                            <div className="dropdown-menu" aria-labelledby="trendBtn">
                                                {/*<span className="dropdown-item" data-value="Month" onClick={this.trendByBtn}>Month</span>*/}
                                                <span className="dropdown-item" data-value="Day" onClick={this.trendByBtn2}>Day</span>
                                                <span className="dropdown-item" data-value="Hour" onClick={this.trendByBtn2}>Hour</span>
                                            </div>
                                        </div>
                                        <div className="card-header-buttons">
                                            <button className="zoomBtn" type="button" id="zoomBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Zoom<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                            <div className="dropdown-menu" aria-labelledby="zoomBtn">
                                                {zoomData2}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col question-count">
                                            <span>{"Q"+this.state.countQuestion+" (by " +this.state.trendBy2+ ")"}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col question-title">
                                            <span>{this.state.question['q_title'] + " (" +this.state.question['q_type']+ ")"}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="questions-data">
                                                <div className="question-answer-count">
                                                    <span>Answer: {this.state.respondentCount}</span>
                                                </div>
                                                <div className="question-skipped-count">
                                                    <span>Skipped: {this.state.respondentSkipped}</span>
                                                </div>
                                                <div className="question-first-date">
                                                    <span>First: {this.state.firstResponse}</span>
                                                </div>
                                                <div className="question-zoom-date">
                                                    <span>Zoom: {this.state.labelsSecondCard[0]} to {this.state.labelsSecondCard[this.state.labelsSecondCard.length - 1]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dt-card-body">
                                    <Choose>
                                        <When condition = {this.state.question['q_type'] == 'Multiple Choice' || this.state.question['q_type'] == 'Checkbox' || this.state.question['q_type'] == 'Dropdown' || this.state.question['q_type'] == 'Star'}>
                                            <div className={"d-flex justify-content-between " + this.state.buttonSecondCardDisplayGraph}>
                                                <span className={"card-body-question-prev " + this.state.prevSecondGraph} data-name="prev" data-value="secondGraph" onClick={this.nextPrevGraph}><FontAwesomeIcon data-name="prev" data-value="secondGraph" icon={faChevronLeft} />&nbsp;&nbsp;&nbsp;Prev</span>
                                                <span></span>
                                                <span className={"card-body-question-next " + this.state.nextSecondGraph} data-name="next" data-value="secondGraph" onClick={this.nextPrevGraph}>Next&nbsp;&nbsp;&nbsp;<FontAwesomeIcon data-name="next" data-value="secondGraph" icon={faChevronRight} /></span>
                                            </div>
                                            <div className="card-body-graph">
                                                <Bar
                                                    data={{
                                                        labels: this.state.labelsSecondCard,
                                                        datasets: this.state.dataSecondCard
                                                    }}
                                                    options={{
                                                        tooltips: {
                                                            mode: 'index',
                                                            intersect: false
                                                        },
                                                        responsive: true,
                                                        scales: {
                                                            xAxes: [{
                                                                gridLines: {
                                                                    color: "rgba(0, 0, 0, 0)",
                                                                },
                                                                stacked: true,
                                                                ticks: {
                                                                    autoSkip: false
                                                                }
                                                            }],
                                                            yAxes: [{
                                                                stacked: true,
                                                                ticks: {
                                                                    min: 0, // it is for ignoring negative step.
                                                                    //max: 50,
                                                                    beginAtZero: true,
                                                                    callback: function(value, index, values) {
                                                                        if (Math.floor(value) === value) {
                                                                            return value;
                                                                        }
                                                                    }
                                                                }
                                                            }]
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </When>
                                        <Otherwise>
                                            <div className="card-body-otherwise text-center">
                                                <span>Data trends do not apply here</span>
                                            </div>
                                        </Otherwise>
                                    </Choose>
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