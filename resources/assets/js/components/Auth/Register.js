import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            headerBodyImg: './../../../images/login.png',
            scmiLogo: './../../../images/scmi-logo.png',
            username: '',
            password: '',
            name: '',
            redirect: false,
            token: sessionStorage.getItem('token')
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
            username: this.state.username,
            password: this.state.password,
            name: this.state.name
        }

        axios.post('/api/user/register', form).then(response => {
            if(response.data.success) {
                this.setState({
                    redirect: true,
                    token: response.data.success
                });
                sessionStorage.setItem('token', response.data.success);
                window.location.reload();
            } else {
                console.log(response.data.warning);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    renderRedirect = () => {
        if (this.state.token || this.state.redirect) {
            return <Redirect to='/dashboard/home' />
        }
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
                <section className="login-section">
                    <div className="header-loginImg">
                        <div className="header1">
                            <span>Start your field research today.</span>
                        </div>
                        <img className="header" src={this.state.headerBodyImg}/>
                    </div>
                    <div className="body-login">
                        <div className="card-login">
                            <div className="card-body-login">
                                <div className="card-logo">
                                    <img src={this.state.scmiLogo} />
                                </div>
                                <h4>Log in to your Field Researcher Account:</h4>
                                <div className="card-form-input">
                                    <div className="div-input-name">
                                        <label>Name</label>
                                        <input type="text" className="input-name" name="name" value={this.state.name} onChange={this.inputChange}/>
                                    </div>
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