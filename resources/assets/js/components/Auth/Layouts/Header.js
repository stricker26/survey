import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
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

    render() {

        return (
            <React.Fragment>
                <nav className="navbar navbar-default">
    	          	<ul className="nav">
                  		<li className="nav-item"><Link to="/dashboard/home" className="nav-link">Dashboard</Link></li>
                  		<li className="nav-item"><Link to="/dashboard/survey" className="nav-link">My Survey</Link></li>
                  		<li className="nav-item"><Link to="/dashboard/response" className="nav-link">Responses</Link></li>
                	</ul>
                	<ul className="nav justify-content-end right-nav">
                		<li className="nav-item dropdown">
    				    	<a className="nav-link" href="#"><FontAwesomeIcon icon="user" /><span className="login-header">Welcome, guest!</span></a>
    				  	</li>
                	</ul>
    	      	</nav>
            </React.Fragment>
        );
    }
}

export default Header;