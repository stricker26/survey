import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import SurveyTitleModal from '../Modal/SurveyTitleModal';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            scmiLogo: './../../../images/scmi-logo.png',
            username: '',
            password: '',
            name: '',
            redirect: false,
            token: sessionStorage.getItem('token'),

            //modal
            warningHeader: '',
            warningContent: '',
            warningTheme: '',
            warningModal: false,
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
            name: this.state.name,
            token: this.state.token
        }

        axios.post('/api/user/register/researcher', form).then(response => {
            if(response.data.success) {
                this.setState({
                    warningHeader: 'Success!',
                    warningContent: 'Field Researcher Account Created Successfully!',
                    warningTheme: 'success',
                });
            } else if(response.data.error) {
                this.setState({
                    warningHeader: 'Warning!',
                    warningContent: response.data.error,
                    warningTheme: 'warning',
                });
            } else {
                this.setState({
                    warningHeader: 'Warning!',
                    warningContent: 'Error Creating Field Researcher Account',
                    warningTheme: 'warning',
                });
            }
            this.toggleWarnigModal();
        }).catch(error => {
            console.log(error);
        });
    }

    toggleWarnigModal() {
        this.setState({
            warningModal: !this.state.warningModal
        });
    }

    closeWarningModal = () => {
        this.toggleWarnigModal();
        if(this.state.warningHeader == 'Success!') {
            window.location.reload();
        }
    }

    renderRedirect = () => {
        if(!this.state.token) {
            return <Redirect to='/dashboard/login' />
        }
    }

    render() {
        return(
            <React.Fragment>
                {this.renderRedirect()}
                <header>
                    <div className="container">
                        <Header />
                        <SurveyTitleModal
                            isOpen = {this.state.warningModal}
                            closeSurvey = {this.closeWarningModal}
                            warningHeader = {this.state.warningHeader}
                            warningContent = {this.state.warningContent}
                            warningTheme = {this.state.warningTheme}
                        />
                    </div>
                </header>
                <section className="login-section">
                    <div className="body-login">
                        <div className="card-login">
                            <div className="card-body-login">
                                <div className="card-logo">
                                    <img src={this.state.scmiLogo} />
                                </div>
                                <h4>Register to Field Researcher Account:</h4>
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
                                    <button type="submit" className="login-submit-btn" onClick={this.submitLogin}>Sign In</button>
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