import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
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
            token: sessionStorage.getItem('token'),
            title: '',
            id: '',
            respondent_no: 1,
            respondentsCount: '',
            respondentsOverall: '',
            respondentSource: '',
            respondentStarted: '',
            respondentLastModified: '',
            respondentTimeSpend: '',
            respondentIP: '',
            questions: [],
            answers: [],
            respondentsEmail: [],

            //buttons
            backStatBtn: 'blur',
            nextStatBtn: 'show',

            //contacts
            contactData: [
                "Name",
                "Company",
                "Address",
                "Address 2",
                "City / Town",
                "State / Province",
                "ZIP / Postal Code",
                "Country",
                "Email",
                "Phone",
            ],
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/response/ir/all/' + id).then(response => {
            this.setState({
                title: response.data.title,
                id: id,
                respondentsCount: response.data.respondents_count,
                respondentSource: response.data.respondents.survey_source,
                respondentStarted: response.data.respondents.created_at,
                respondentLastModified: response.data.respondents.finished_at,
                respondentTimeSpend: response.data.respondents.timeSpend,
                respondentIP: response.data.respondents.ip,
                questions: response.data.questions,
                answers: response.data.answers,
                respondentsOverall: response.data.respondentsOverall,
                respondentsEmail: response.data.respondentsEmail,
            });
        }).catch(error => {
            console.log(error);
        });
    }

    responChoose = (e) => {
        if(parseInt(e.target.dataset.value, 10) == this.state.respondentsCount) {
            this.setState({
                respondent_no: parseInt(e.target.dataset.value, 10),
                backStatBtn: 'show',
                nextStatBtn: 'blur'
            });
        } else if(e.target.dataset.value == '1') {
            this.setState({
                respondent_no: parseInt(e.target.dataset.value, 10),
                backStatBtn: 'blur',
                nextStatBtn: 'show'
            });
        } else {
            this.setState({
                respondent_no: parseInt(e.target.dataset.value, 10),
                backStatBtn: 'show',
                nextStatBtn: 'show'
            });
        }

        const form = {
            respondent_no: parseInt(e.target.dataset.value, 10)
        };

        axios.post('/api/response/ir/' + this.state.id, form).then(response => {
            this.setState({
                respondentSource: response.data.respondents.survey_source,
                respondentStarted: response.data.respondents.created_at,
                respondentLastModified: response.data.respondents.finished_at,
                respondentTimeSpend: response.data.respondents.timeSpend,
                respondentIP: response.data.respondents.ip,
                answers: response.data.answers
            });
        }).catch(error => {
            console.log(error);
        });
    }

    nextBackBtn = (e) => {
        if(e.target.dataset.value == 'back') {
            //back button clicked
            var respoNumber = this.state.respondent_no - 1;
            if(this.state.respondent_no == 2) {
                this.setState({
                    respondent_no: respoNumber,
                    backStatBtn: 'blur',
                    nextStatBtn: 'show'
                });
            } else if(this.state.respondent_no != 1) {
                this.setState({
                    respondent_no: respoNumber,
                    backStatBtn: 'show',
                    nextStatBtn: 'show'
                });
            }
        } else {
            //next button clicked
            var respoNumber = this.state.respondent_no + 1;
            if(this.state.respondent_no == (this.state.respondentsCount - 1)) {
                this.setState({
                    respondent_no: respoNumber,
                    backStatBtn: 'show',
                    nextStatBtn: 'blur'
                });
            } else if(this.state.respondent_no != this.state.respondentsCount) {
                this.setState({
                    respondent_no: respoNumber,
                    backStatBtn: 'show',
                    nextStatBtn: 'show'
                });
            }
        }

        if(respoNumber > 0 && respoNumber <= this.state.respondentsCount) {
            const form = {
                respondent_no: respoNumber
            };

            axios.post('/api/response/ir/' + this.state.id, form).then(response => {
                this.setState({
                    respondentSource: response.data.respondents.survey_source,
                    respondentStarted: response.data.respondents.created_at,
                    respondentLastModified: response.data.respondents.finished_at,
                    respondentTimeSpend: response.data.respondents.timeSpend,
                    respondentIP: response.data.respondents.ip,
                    answers: response.data.answers
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }

    actionsBtn = (e) => {
        if(e.target.dataset.name == 'delete') {
            const data = {
                respondent_id: e.target.value
            };

            axios.post('/api/response/ir/delete/' + this.state.id, data).then(response => {
                if(response.data.success) {
                    alert(response.data.success);
                    window.location.reload();
                } else {
                    alert(response.data.failed);
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            alert(e.target.dataset.value);
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

    backResponse = (e) => {
        this.props.history.push('/dashboard/response');
    }
    
	render() {
        var respondentsElement = '';
        for(var e = 0; e < this.state.respondentsCount; e++) {
            respondentsElement += '<span class="dropdown-item" data-value="'+(e + 1)+'">'+(this.state.respondentsEmail[e].length >= 35 ? this.state.respondentsEmail[e].substring(0, 35) + "..." : this.state.respondentsEmail[e])+'</span>';
        }

        let iterator = 0;
        const questions = this.state.questions.map((list, index) =>
            <div key={index}>
                <div className="card-content">
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <div className="col question-count">
                                    <span>Q{index + 1}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col question-title">
                                    <span>{list.question}</span>
                                </div>
                            </div>
                            <div className="yellow-div"></div>
                            <div className="row">
                                <div className="col question-answer">
                                    <Choose>
                                        <When condition = {list.q_type == 'Star'}>
                                            {this.state.answers[list.id] ? <span><FontAwesomeIcon icon={faStar} />&nbsp;&nbsp;&nbsp;&nbsp;{this.state.answers[list.id]}/5 Stars</span> : <span>(skipped)</span>}
                                        </When>
                                        <When condition = {list.q_type == 'Textboxes'}>
                                            {
                                                (JSON.parse(list.choices)).map((element, key)=>
                                                    <div className="row" key={key}>
                                                        <div className="col-sm-2">
                                                            <span>{element.answer}</span>
                                                        </div>
                                                        <div className="col-sm-10">
                                                            <span>{JSON.parse(this.state.answers[list.id])[key]}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </When>
                                        <When condition = {list.q_type == 'Contact'}>
                                            {
                                                (JSON.parse(list.choices)).map((element, key)=>
                                                    <If condition = {element.answer}>
                                                        <div className="row" key={key}>
                                                            <div className="col-sm-2">
                                                                <span>{this.state.contactData[key]}</span>
                                                            </div>
                                                            <div className="col-sm-10">
                                                                <span>{JSON.parse(this.state.answers[list.id])[iterator]}</span>
                                                                <span className={iterator = iterator + 1}></span>
                                                            </div>
                                                        </div>
                                                    </If>
                                                )
                                            }
                                        </When>
                                        <Otherwise>
                                            {this.state.answers[list.id] ? <span>{this.state.answers[list.id]}</span> : <span>(skipped)</span>}
                                        </Otherwise>
                                    </Choose>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
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
                <section className="response-ir-section">
                    <div className="response-ir-header">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-start">
                                    <div className="response-nav-item" onClick={this.backResponse}><img src={this.state.backIcon} onClick={this.backResponse} />&nbsp;&nbsp;&nbsp;Back</div>
                                    <div className="response-nav-item" id="question_summaries" onClick={this.responseNav}>Question Summaries</div>
                                    <div className="response-nav-item" id="data_trends" onClick={this.responseNav}>Data Trends</div>
                                    <div className="response-nav-item ir-active" id="individual_responses" onClick={this.responseNav}>Individual Responses</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="response-ir-body">
                        <div className="container">
                            <div className="response-ir-body-header">
                                <div className="row">
                                    <div className="col">
                                        <h3>{this.state.title}</h3>
                                        <span>Respondents: {this.state.respondentsCount + " out of " + this.state.respondentsOverall}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="response-ir-body-beforecard">
                                <div className="row">
                                    <div className="col">
                                        <div className="d-flex justify-content-start">
                                            <div className="respondent-dropdown">
                                                <button className="respondentDdownBtn" type="button" id="respondentDropdownBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Respondent #{this.state.respondent_no}<span className="float-right"><FontAwesomeIcon icon={faChevronDown} /></span></button>
                                                <div className="dropdown-menu" aria-labelledby="respondentDropdownBtn">
                                                    <div dangerouslySetInnerHTML={{__html: respondentsElement}} onClick={this.responChoose}></div>
                                                </div>
                                            </div>
                                            <div className="backnext-btn">
                                                <div className="back-btn">
                                                    <button type="button" className={this.state.backStatBtn} data-value="back" onClick={this.nextBackBtn}><span className="float-left"><FontAwesomeIcon icon={faChevronLeft} /></span>&nbsp;&nbsp;&nbsp;Back</button>
                                                </div>
                                                <div className="next-btn">
                                                    <button type="button" className={this.state.nextStatBtn} data-value="next" onClick={this.nextBackBtn}>Next&nbsp;&nbsp;&nbsp;<span className="float-right"><FontAwesomeIcon icon={faChevronRight} /></span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="response-ir-card">
                                <div className="cardHeader">
                                    <div className="row">
                                        <div className="col">
                                            <div className="d-flex justify-content-between">
                                                <div className="completed-survey">
                                                    <span>Completed the Survey</span>
                                                </div>
                                                <div className="actions">
                                                    <div className="delete-btn">
                                                        <button type="button" data-name="delete" data-value={this.state.respondent_no} onClick={this.actionsBtn}>Delete</button>
                                                    </div>
                                                    <div className="export-btn">
                                                        <button type="button" data-name="export" data-value={this.state.respondent_no} onClick={this.actionsBtn}>Export</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cardBody">
                                    <div className="row-content">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <span className="col-title">Respondent Source:</span>
                                            </div>
                                            <div className="col-sm-9">
                                                <span>{this.state.respondentSource}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <span className="col-title">Started:</span>
                                            </div>
                                            <div className="col-sm-9">
                                                <span>{this.state.respondentStarted}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <span className="col-title">Last Modified:</span>
                                            </div>
                                            <div className="col-sm-9">
                                                <span>{this.state.respondentLastModified}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <span className="col-title">Time Spend:</span>
                                            </div>
                                            <div className="col-sm-9">
                                                <span>{this.state.respondentTimeSpend}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <span className="col-title">IP Address:</span>
                                            </div>
                                            <div className="col-sm-9">
                                                <span>{this.state.respondentIP}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="page-count">
                                <div className="row">
                                    <div className="col">
                                        <span>Page 1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="response-ir-question-card">
                                <div className="response-ir-qcard">
                                    {questions}
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