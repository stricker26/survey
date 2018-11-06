import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faGooglePlusSquare } from '@fortawesome/free-brands-svg-icons';


class Footer extends Component {
    render() {
        return (
          <div className="d-flex justify-content-between">
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
            <div className="footer-sma-icons">
              <a href="#facebook"><img src="./../../../images/facebook-icon.png"/></a>
              <a href="#twitter"><img src="./../../../images/twitter-icon.png"/></a>
              <a href="#google"><img src="./../../../images/google-icon.png"/></a>
            </div>
          </div>
        );
    }
}

export default Footer;