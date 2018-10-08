import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Tools extends Component {

    render() {

        const {passToolvalue} = this.props;

        return (
            <React.Fragment>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Multiple Choice')}><FontAwesomeIcon icon="list" /> Multiple Choice</span>
                    </div>
                    <div className="col">
                        <span className="tool active" onClick={(e) => passToolvalue('Checkbox')}><FontAwesomeIcon icon="check-square" /> Checkboxes</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="book" /> Essay</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="star" /> Star Rating</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="text-width" /> Textbox</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="comment-dots" /> Comment Box</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tooToolsl"><FontAwesomeIcon icon="arrows-alt-v" /> Dropdown</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="table" /> Matrix/Rating Scale</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="chart-bar" /> Ranking</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="sliders-h" /> Slider</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="bars" /> Multiple Textboxes</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="user-check" /> Contact Info</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="calendar-alt" /> Date/Time</span>
                    </div>
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="image" /> Image Choice</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool"><FontAwesomeIcon icon="cloud-upload-alt" /> Image Upload</span>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="line-gray"></div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}