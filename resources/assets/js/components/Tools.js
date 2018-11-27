import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Tools extends Component {
    
    render() {

        const {passToolvalue} = this.props;

        return (
            <React.Fragment>
                <div className="row tools mb-3">
                    <div className="col instruction">
                        <FontAwesomeIcon icon="check-square" className="fa-2x mr-3" /> Required Question
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <div className="hr-full"></div>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <p>Question Type</p>
                    </div>
                </div>
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
                        <span className="tool" onClick={(e) => passToolvalue('Essay')}><FontAwesomeIcon icon="book" /> Essay</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Star')}><FontAwesomeIcon icon="star" /> Star Rating</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Textbox')}><FontAwesomeIcon icon="text-width" /> Textbox</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Comment')}><FontAwesomeIcon icon="comment-dots" /> Comment Box</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Dropdown')}><FontAwesomeIcon icon="arrows-alt-v" /> Dropdown</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Rating')}><FontAwesomeIcon icon="table" /> Matrix/Rating Scale</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Ranking')}><FontAwesomeIcon icon="chart-bar" /> Ranking</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Slider')}><FontAwesomeIcon icon="sliders-h" /> Slider</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Textboxes')}><FontAwesomeIcon icon="bars" /> Multiple Textboxes</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Contact')}><FontAwesomeIcon icon="user-check" /> Contact Info</span>
                    </div>
                </div>
                <div className="row tools">
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Date')}><FontAwesomeIcon icon="calendar-alt" /> Date/Time</span>
                    </div>
                    <div className="col">
                        <span className="tool" onClick={(e) => passToolvalue('Image')}><FontAwesomeIcon icon="image" /> Image Choice</span>
                    </div>
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