import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import SurveyModal from './../Modal/SurveyModal';
import { Redirect } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            redirect: false,
        };

        const form = {
            token: sessionStorage.getItem('token')
        };

        axios.post('/api/webmaster/getName', form).then(response => {
            if(response.data.user) {
                this.setState({
                    user: response.data.user
                });
            } else if(response.data.error) {
                this.setState({
                    redirect: true
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    createSurvey = () => {
        this.toggleSurvey();
    }

    closeSurvey = () => {
        this.toggleSurvey();
    }

    toggleSurvey() {
        // if(!this.state.showModal) {
        //     document.addEventListener('click', this.handleOutsideClick, false);
        // } else {
        //     document.removeEventListener('click', this.handleOutsideClick, false);
        // }
        this.setState({
            showModal: !this.state.showModal
        });
    }

    handleOutsideClick = (e) => {
        // if(this.node.contains(e.target)) {
        //     return;
        // }
        this.toggleSurvey();
    }

    passToolvalue = (tool) => {
        console.log(tool);
    }

    renderRedirect = () => {
        if(this.state.redirect) {
            return <Redirect to='/dashboard/login' />
        }
    }

    render() {

        return (
            <React.Fragment>
                {this.renderRedirect()}
                <nav className="navbar navbar-default">
    	          	<ul className="nav">
                  		<li className="nav-item"><Link to="/dashboard/home" className="nav-link">Dashboard</Link></li>
                  		<li className="nav-item"><Link to="/dashboard/survey" className="nav-link">My Survey</Link></li>
                  		<li className="nav-item"><Link to="/dashboard/response" className="nav-link">Responses</Link></li>
                	</ul>
                	<ul className="nav justify-content-end right-nav">
                		<li className="nav-item">
                            <button type="button" className="btn btn-orange" onClick={this.createSurvey}>Create Survey</button>
                        </li>
                		<li className="nav-item dropdown">
    				    	<a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><FontAwesomeIcon icon="user" /> {this.state.user}</a>
    				    	<div className="dropdown-menu">
    				      		<a className="dropdown-item" href="#">Action</a>
    				      		<a className="dropdown-item" href="#">Another action</a>
    				      		<a className="dropdown-item" href="#">Something else here</a>
    				      		<div className="dropdown-divider"></div>
    				      		<a className="dropdown-item" href="/dashboard/logout">Logout</a>
    				    	</div>
    				  	</li>
                	</ul>
    	      	</nav>
                <SurveyModal
                    isOpen = {this.state.showModal}
                    closeSurvey = {this.closeSurvey}
                />
            </React.Fragment>
        );
    }
}

export default Header;