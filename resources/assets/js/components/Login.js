import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
        } 
    }

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
                        hello
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