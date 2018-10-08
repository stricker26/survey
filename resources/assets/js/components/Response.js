import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Response extends Component {
	render() {
		return(
			<React.Fragment>
				<header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section>
                    <div className="container-fluid">
                        <div className="row">
                        	<div className="col">
                        		<h1>This is Response</h1>
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