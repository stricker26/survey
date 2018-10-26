import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            token: localStorage.getItem('token')
        }
    }

    renderRedirect = () => {
        localStorage.clear();
        return <Redirect to='/dashboard/login' />
    }

    render() {
        return(
            <React.Fragment>
                {this.renderRedirect()}
            </React.Fragment>
        );
    }
}