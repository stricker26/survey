import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default class Response extends Component {
    constructor(){
        super();
        this.state = {
            backIcon: './../../../images/back-icon.png',
            token: sessionStorage.getItem('token'),
            id: '',
            title: '',
            trendBy: 'Hour',
            labelsFirstCard: ['hello','hi','howru','uy','yo'],
            dataFirstCard: [5,2,0,3,1],
            bgColorsFirstCard: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/response/data_trends/' + id).then(response => {
            this.setState({
                title: response.data.title,
                id: id
            });
        }).catch(error => {
            console.log(error);
        });
    }

    trendByBtn = (e) => {
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
                trendBy: e.target.dataset.value,
                labelsFirstCard: ['January','February','March','April','May','June','July','August','September','October','November','December'],
                dataFirstCard: [5,2,0,3,1,2,2,9,0,0,8,2],
                bgColorsFirstCard: coloR
            });
        } else if(e.target.dataset.value == 'Day') {
            for(var x = 1; x <= 30; x++) {
                coloR.push(colorPicker());
            }
            this.setState({
                trendBy: e.target.dataset.value,
                labelsFirstCard: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                dataFirstCard: [5,2,0,3,1,2,2,9,2,8,0,0,1,2,9,8,5,2,2,3,2,4,1,1,4,6,1,0,8,2],
                bgColorsFirstCard: coloR
            });
        } else {
            for(var x = 1; x <= 23; x++) {
                coloR.push(colorPicker());
            }
            this.setState({
                trendBy: e.target.dataset.value,
                labelsFirstCard: ['3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm'],
                dataFirstCard: [5,2,0,3,1,2,2,9,2,8,0,0,1,2,9,8,5,2,2,3,2,4,1],
                bgColorsFirstCard: coloR
            });
        }
    }

    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }

    responseNav = (e) => {
        this.props.history.push('/dashboard/response/' + e.target.id + '/' + this.state.id);
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
                                        <span>Respondents: 4 out of 4</span>
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
                                                    <span className="dropdown-item" value="1">Chart 1</span>
                                                    <span className="dropdown-item" value="2">Chart 2</span>
                                                    <span className="dropdown-item" value="3">Chart 3</span>
                                                </div>
                                            </div>
                                            <div className="card-header-buttons">
                                                <button className="trendBtn" type="button" id="trendBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trend by {this.state.trendBy}<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="trendBtn">
                                                    <span className="dropdown-item" data-value="Month" onClick={this.trendByBtn}>Month</span>
                                                    <span className="dropdown-item" data-value="Day" onClick={this.trendByBtn}>Day</span>
                                                    <span className="dropdown-item" data-value="Hour" onClick={this.trendByBtn}>Hour</span>
                                                </div>
                                            </div>
                                            <div className="card-header-buttons">
                                                <button className="zoomBtn" type="button" id="zoomBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Zoom<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="zoomBtn">
                                                    <span className="dropdown-item" value="1">Zoom 1</span>
                                                    <span className="dropdown-item" value="2">Zoom 2</span>
                                                    <span className="dropdown-item" value="3">Zoom 3</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dt-card-body">
                                    <div className="card-body-header">
                                        <span>Responses (by {this.state.trendBy})</span>
                                    </div>
                                    <div className="card-body-graph">
                                        <Bar
                                            data={{
                                                labels: this.state.labelsFirstCard,
                                                datasets: [{
                                                    data: this.state.dataFirstCard,
                                                    backgroundColor: this.state.bgColorsFirstCard,
                                                    borderColor: this.state.bgColorsFirstCard,
                                                    borderWidth: 1
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
                                </div>
                            </div>
                            <div className="page-count">
                                <span>Page 1</span>
                            </div>
                            <div className="response-dt-card">
                                <div className="dt-card-header">
                                    <div className="row">
                                        <div className="col question-count">
                                            <span>Q1 (by {this.state.trendBy})</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col question-title">
                                            <span>How did you first hear about our website?</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="questions-data">
                                                <div className="question-answer-count">
                                                    <span>Answer: 4</span>
                                                </div>
                                                <div className="question-skipped-count">
                                                    <span>Skipped: 0</span>
                                                </div>
                                                <div className="question-first-date">
                                                    <span>First: 5/2/2018</span>
                                                </div>
                                                <div className="question-zoom-date">
                                                    <span>Zoom: 4 pm 5/1/2018 to 3 pm 5/2/2018</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dt-card-body">
                                    <div className="card-body-graph">
                                        <Bar
                                            data={{
                                                labels: ['hello','hi','howru','uy','yo'],
                                                datasets: [{
                                                    data: [5,2,0,3,1],
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