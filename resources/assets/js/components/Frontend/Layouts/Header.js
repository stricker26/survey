import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            scmi: './../../images/scmi-logo.png'
        }
    }

    render() {

        const { title } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-8">
                        <div className="title-wrapper">
                            <h3>{title}</h3>
                        </div>
                    </div>
                    <div className="col-md-4 text-right">
                        <img src={this.state.scmi} alt="SCMI Logo" />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Header;