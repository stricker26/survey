import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import StarRatingComponent from 'react-star-rating-component';
import Parser from 'html-react-parser';
import Header from './Layouts/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

export default class Survey extends Component {
    constructor() {
        super();
        this.state = {
            survey: [],
            title: '',
            rating: 1,
            defaultRating: 1,
            defaultSelectValue: 'none',
            selectValue: 'none',
            submitShow: 'hideSubmit',
            leftHide: 'hideArrow',
            rightHide: '',
            pageCount: 1,
            liActive: 'list-1',

            //answers
            respondentId: '',
            multipleChoiceAnswer: '',
            multipleChoiceId: '',
            checkboxAnswer: '',
            checkboxId: '',
            starRatingAnswer: '',
            starRatingId: '',
            essayAnswer: '',
            essayId: '',
            commentAnswer: '',
            commentId: '',
            textboxAnswer: '',
            textboxId: '',
            dropdownAnswer: '',
            dropdownId: '',
            dateAnswer: '',
            dateId: ''
        };
    }

    //star hover functions
    onStarHover(nextValue, prevValue, name) {
        if(nextValue > this.state.defaultRating) {
            this.setState({rating: nextValue});
        }
    }

    onStarHoverOut(nextValue, prevValue, name) {
        this.setState({rating: this.state.defaultRating});
    }

    //right left arrow click function
    leftArrowClick = (e) => {
        var newPageCount = this.state.pageCount;
        newPageCount--;
        if(newPageCount == 1) {
            this.setState({
                leftHide: 'hideArrow',
                rightHide: '',
                pageCount: newPageCount,
                submitShow: 'hideSubmit',
                liActive: 'list-' + newPageCount.toString()
            });
        } else {
            this.setState({
                leftHide: '',
                rightHide: '',
                pageCount: newPageCount,
                submitShow: 'hideSubmit',
                liActive: 'list-' + newPageCount.toString()
            });
        }
    }

    rightArrowClick = (e) => {
        var newPageCount = this.state.pageCount;
        newPageCount++;
        if(newPageCount == this.state.survey.length) {
            this.setState({
                leftHide: '',
                rightHide: 'hideArrow',
                pageCount: newPageCount,
                submitShow: '',
                liActive: 'list-' + newPageCount.toString()
            });
        } else {
            this.setState({
                leftHide: '',
                rightHide: '',
                submitShow: 'hideSubmit',
                pageCount: newPageCount,
                liActive: 'list-' + newPageCount.toString()
            });
        }
    }

    //set values for submitting results
    radioClick = (e) => {
        var targetId = parseInt(e.target.name, 10);
        this.setState({
            multipleChoiceAnswer: e.target.value,
            multipleChoiceId: targetId
        });
    }

    checkboxClick = (e) => {
        var checkboxArray = this.state.checkboxAnswer;
        if(e.target.checked === true) {
            if(checkboxArray.length == 0) {
                checkboxArray = e.target.value;
                this.setState({
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            } else {
                checkboxArray = checkboxArray + "," + e.target.value;
                this.setState({
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            }
        } else {
            if(checkboxArray.indexOf(e.target.value) == 0) {
                if(checkboxArray.indexOf(",") !== -1) {
                    checkboxArray = checkboxArray.replace(e.target.value + ",", "");
                    this.setState({
                        checkboxAnswer: checkboxArray,
                        checkboxId: e.target.name
                    });
                } else {
                    checkboxArray = checkboxArray.replace(e.target.value, "");
                    this.setState({
                        checkboxAnswer: checkboxArray,
                        checkboxId: e.target.name
                    });
                }
            } else {
                checkboxArray = checkboxArray.replace("," + e.target.value, "");
                this.setState({
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            }
        }
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({
            rating: nextValue,
            defaultRating: nextValue,
            starRatingAnswer: nextValue,
            starRatingId: name
        });
    }

    essayCommentChange = (e) => {
        if(e.target.classList.contains("Comment")) {
            this.setState({
                commentAnswer: e.target.value,
                commentId: e.target.name
            });
        } else {
            this.setState({
                essayAnswer: e.target.value,
                essayId: e.target.name
            });
        }
    }

    textboxChange = (e) => {
        this.setState({
            textboxAnswer: e.target.value,
            textboxId: e.target.name
        });
    }

    dropdownChange = (e) => {
        this.setState({
            dropdownAnswer: e.target.value,
            dropdownId: e.target.name,
            selectValue: e.target.value
        });
    }

    dateChange = (e) => {
        var targetId = parseInt(e.target.name, 10);
        this.setState({
            dateAnswer: e.target.value,
            dateId: targetId
        });
    }

    //submit form
    submitAnswer = (e) => {
        e.preventDefault();
        const form = {
            respondentId: this.state.respondentId,
            //answers
            multipleChoiceAnswer: this.state.multipleChoiceAnswer,
            multipleChoiceId: this.state.multipleChoiceId,
            checkboxAnswer: this.state.checkboxAnswer,
            checkboxId: this.state.checkboxId,
            starRatingAnswer: this.state.starRatingAnswer,
            starRatingId: this.state.starRatingId,
            essayAnswer: this.state.essayAnswer,
            essayId: this.state.essayId,
            commentAnswer: this.state.commentAnswer,
            commentId: this.state.commentId,
            textboxAnswer: this.state.textboxAnswer,
            textboxId: this.state.textboxId,
            dropdownAnswer: this.state.dropdownAnswer,
            dropdownId: this.state.dropdownId,
            dateAnswer: this.state.dateAnswer,
            dateId: this.state.dateId
        }
        
        axios.post('/api/webmaster/answerRespondent', form).then(response => {
            if(response.data.success) {
                
            } else {
                this.setState({
                    asteriskClass: 'asterisk-error',
                    errorClass: 'error-show'
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/front/' + id).then(response => {
            this.setState({
                survey: response.data.survey,
                title: response.data.title,
                index: '',
                respondentId: response.data.responid
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        var liCount = 1;
        var iterator = 1;
        const { rating } = this.state;
        const { liActive } = this.state;
        function checkActive(active) {
            if(active === liActive) {
                return "li-active";
            } else {
                return "li-hidden";
            }
        }
        const renderQuestion = this.state.survey.map(list =>
            <li key={list.id} className={checkActive("list-" + liCount++)}>
                <div className="question-wrapper">
                    <div className="row">
                        <div className="col">
                            <h4>{Parser(list.q_title)}</h4>
                        </div>
                    </div>
                    <Choose>
                        <When condition = {list.q_type == 'Multiple Choice'}>
                            {
                                (JSON.parse(list.answer)).map(key =>
                                    <div className="row" key={iterator.toString()}>
                                        <div className="col">
                                            <div className="answer">
                                                <input type="radio" name={list.id} id={"option" + iterator.toString()} value={key.answer} onChange={this.radioClick} />
                                                <label htmlFor={"option" + iterator}>{key.answer}</label>
                                            </div>
                                        </div>
                                       <span className={iterator = iterator + 1}></span>
                                    </div>
                                )
                            }
                        </When>
                        <When condition = {list.q_type == 'Checkbox'}>
                            {
                                (JSON.parse(list.answer)).map(key =>
                                    <div className="row" key={iterator.toString()}>
                                        <div className="col">
                                            <div className="answer">
                                                <input type="checkbox" name={list.id} id={"option" + iterator.toString()} value={key.answer} onChange={this.checkboxClick}/>
                                                <label htmlFor={"option" + iterator}>{key.answer}</label>
                                            </div>
                                        </div>
                                       <span className={iterator = iterator + 1}></span>
                                    </div>
                                )
                            }
                        </When>
                        <When condition = {list.q_type == 'Star'}>
                            {
                                <div>
                                    <div className="row">
                                        <div className="col text-center starNumber">
                                            <div><span>1</span></div>
                                            <div><span>2</span></div>
                                            <div><span>3</span></div>
                                            <div><span>4</span></div>
                                            <div><span>5</span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col text-center starImageDiv">
                                            <StarRatingComponent 
                                                name={list.id.toString()} 
                                                starColor="#f89937"
                                                starCount={5}
                                                value={rating}
                                                onStarClick={this.onStarClick.bind(this)}
                                                onStarHover={this.onStarHover.bind(this)} /* on icon hover handler */
                                                onStarHoverOut={this.onStarHoverOut.bind(this)} /* on icon hover out handler */
                                                renderStarIcon={(index, value) => {
                                                    return (
                                                        <div className="iconStarDiv">
                                                            <div>
                                                                <FontAwesomeIcon icon={index <= value ? faStar : farFaStar }/>
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col starText">
                                            <div className="h-dis">
                                                <span>Highly Dissatisfied</span>
                                            </div>
                                            <div className="h-sat">
                                                <span>Highly Satisfied</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </When>
                        <When condition = {list.q_type == 'Essay' || list.q_type == 'Comment'}>
                            <div className="row">
                                <div className="col">
                                    <div className="answer-text">
                                        <textarea className={"essay-textarea " + list.q_type} name={list.id} onChange={this.essayCommentChange}/>
                                    </div>
                                </div>
                            </div>
                        </When>
                        <When condition = {list.q_type == 'Textbox'}>
                            <div className="row">
                                <div className="col">
                                    <div className="answer-text">
                                        <input type="text" className="textbox-input" name={list.id} onChange={this.textboxChange}/>
                                    </div>
                                </div>
                            </div>
                        </When>
                        <When condition = {list.q_type == 'Dropdown'}>
                            <div className="row">
                                <div className="col">
                                    <div className="answer-text">
                                        <div className="dropdown-select">
                                            <select value={this.state.selectValue} name={list.id} onChange={this.dropdownChange}>
                                                <option className="dropdown-option" value={this.state.defaultSelectValue} disabled>-- Select --</option>
                                                {
                                                    (JSON.parse(list.answer)).map(key =>
                                                        <option className={"dropdown-option"+ (iterator = iterator + 1)} key={iterator.toString()} value={key.answer}>{key.answer}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </When>
                        <When condition = {list.q_type == 'Date'}>
                            <div className="row">
                                <div className="col">
                                    <div className="answer-text">
                                        <input type="date" className="date-input" name={list.id} onChange={this.dateChange}/>
                                    </div>
                                </div>
                            </div>
                        </When>
                    </Choose>
                </div>
            </li>
        );
        
        return(
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header 
                            title = {this.state.title}
                        />
                    </div>
                </header>
                <section>
                    <div className="container mt-5">
                        <ul className="startSurvey-page">
                            <div className="row">
                                <div className="col">
                                    <div className="rightleftarrow">
                                        <div className="left-arrow">
                                            <FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={this.leftArrowClick} id={this.state.pageCount} className={this.state.leftHide}/>
                                            <span className={this.state.leftHide}>Previous</span>
                                        </div>
                                        <div className="right-arrow">
                                            <span className={this.state.rightHide}>Next</span>
                                            <FontAwesomeIcon icon={faArrowAltCircleRight} onClick={this.rightArrowClick} id={this.state.pageCount} className={this.state.rightHide}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {renderQuestion}
                            <div className="row">
                                <div className="col">
                                    <div className="submit-answer text-center">
                                        <button type="submit" className={"btn-submit-answer " + this.state.submitShow} onClick={this.submitAnswer}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}