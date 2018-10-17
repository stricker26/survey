import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Survey extends Component {

    render() {
        return(
            <React.Fragment>
                
                <section>
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <h1>Start Survey</h1>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}