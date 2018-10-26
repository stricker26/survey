import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Response extends Component {
    constructor(){
        super()
        this.state = {
            token: localStorage.getItem('token')
        }
    }

    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }
    
	render() {
        const cardsResponse = ();
        
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
                            		<span className="response-body-header">Responses Overview</span>
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