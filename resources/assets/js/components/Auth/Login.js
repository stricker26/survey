import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            header1BodyImg: './../../../images/login-header.png',
            header2BodyImg: './../../../images/login.png',
            scmiLogo: './../../../images/scmi-logo.png',
            username: '',
            password: ''
        } 
    }

    inputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitLogin = (e) => {
        e.preventDefault();
        const form = {
            email: this.state.username,
            password: this.state.password
        }

        axios.post('/api/user/login', form).then(response => {
            if(response.data.success) {
                console.log(response.data.data);
            } else {
                console.log(response.data.data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return(
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section className="login-section">
                    <div className="header-loginImg">
                        <img className="header1" src={this.state.header1BodyImg}/>
                        <h1>Start your field research today.</h1>
                        <img className="header2" src={this.state.header2BodyImg}/>
                    </div>
                    <div className="body-login">
                        <div className="card-login">
                            <div className="card-body-login">
                                <div className="card-logo">
                                    <img src={this.state.scmiLogo} />
                                </div>
                                <h4>Log in to your Field Researcher Account:</h4>
                                <div className="card-form-input">
                                    <div className="div-input-username">
                                        <label>Username</label>
                                        <input type="text" className="input-username" name="username" value={this.state.username} onChange={this.inputChange}/>
                                    </div>
                                    <div className="div-input-password">
                                        <label>Password</label>
                                        <input type="password" className="input-password" name="password" value={this.state.password} onChange={this.inputChange}/>
                                    </div>
                                    <div className="div-forgot-password">
                                        <span>Forgot Password?</span>
                                    </div>
                                </div>
                                <div className="card-form-submit">
                                    <button type="submit" className="login-submit-btn" onClick={this.submitLogin}>Log In</button>
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