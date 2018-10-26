import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
        	<nav className="navbar navbar-default">
	          	<ul className="nav">
                  <li className="nav-item"><a href="#" className="nav-link">About</a></li>
                  <li className="nav-item"><a href="#" className="nav-link">Privacy Statement</a></li>
                  <li className="nav-item"><a href="#" className="nav-link">Terms and Condition</a></li>
                  <li className="nav-item"><a href="#" className="nav-link">Contact</a></li>
              		<li className="nav-item"><a href="#" className="nav-link">Help</a></li>
            	</ul>
              <p>Copyright © 2018</p>
	      	</nav>
        );
    }
}

export default Footer;