import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Response extends Component {
    constructor(){
        super()
        this.state = {
            token: sessionStorage.getItem('token'),
            surveySummary: []
        }
    }

    componentWillMount() {
        const form = {
            token: this.state.token
        }

        axios.post('/api/response/getAll', form).then(response => {
            this.setState({
                surveySummary: response.data.success
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

    viewResults = (e) => {
        if(e.target.dataset.value != 0) { 
            this.props.history.push('/dashboard/response/question_summaries/'+ e.target.id);
        } else {
            alert('No responses!');
        }
    }
    
	render() {
        const cardsResponse = (
            <Choose>
                <When condition = {this.state.surveySummary.length != 0}>
                    {
                        this.state.surveySummary.map(list => 
                            <div key={list.id}>
                                <div className="response-card">
                                    <div className="response-card-header">
                                        <div className="response-header-status"><span>{list.status}</span></div>
                                        <div className="response-header-title"><span>{list.title}</span></div>
                                    </div>
                                    <div className="response-card-body">
                                        <div className="response-count-ago">
                                            <span>{list.respondents_ago}</span>
                                            <p>
                                                Responses Since<br/>
                                                {list.respondents_days_ago + (list.respondents_days_ago >= 1 ? " day ago" : " days ago")}
                                            </p>
                                        </div>
                                        <div className="response-count-today">
                                            <span>{list.respondents_today}</span>
                                            <p>Respondents Today</p>
                                        </div>
                                    </div>
                                    <div className="response-card-footer" data-value={list.respondents_ago} id={list.survey_id} onClick={this.viewResults}>
                                        <span data-value={list.respondents_ago} id={list.survey_id}>View Results</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </When>
                <Otherwise>
                    <div>
                        <h5>No Data..</h5>
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
                <section className="response-section">
                    <div className="container">
                        <div className="response-body">
                            <div className="row">
                            	<div className="col">
                            		<div className="response-body-header">
                                        <span>Responses Overview</span>
                                    </div>
                            	</div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="response-content">
                                        {cardsResponse}
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