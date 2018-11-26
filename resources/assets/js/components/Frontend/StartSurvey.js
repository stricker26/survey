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
import FrontEndPopup from '../Modal/FrontEndPopup';

export default class Survey extends Component {
    constructor() {
        super();
        this.state = {
            survey: [],
            surveyLength: '',
            title: '',
            surveyId: '',
            rating: 0,
            defaultRating: 0,
            defaultSelectValue: 'none',
            selectValue: 'none',
            submitShow: 'hideSubmit',
            leftHide: 'hideArrow',
            rightHide: '',
            pageCount: 1,
            liActive: 'list-1',
            currentSurvey: false,

            //answers
            respondentId: '',

            multipleChoiceStorage: [],
            multipleChoiceStorageId: [],
            multipleChoiceAnswer: '',
            multipleChoiceId: '',

            checkboxStorage: [],
            checkboxStorageId: [],
            checkboxAnswer: '',
            checkboxId: '',
            
            starRatingStorage: [],
            starRatingStorageId: [],
            starRatingAnswer: '',
            starRatingId: '',
            
            essayStorage: [],
            essayStorageId: [],
            essayAnswer: '',
            essayId: '',
            
            commentStorage: [],
            commentStorageId: [],
            commentAnswer: '',
            commentId: '',
            
            textboxStorage: [],
            textboxStorageId: [],
            textboxAnswer: '',
            textboxId: '',
            
            dropdownStorage: [],
            dropdownStorageId: [],
            dropdownAnswer: '',
            dropdownId: '',
            
            dateStorage: [],
            dateStorageId: [],
            dateAnswer: '',
            dateId: '',

            //question logic
            popup: false,
            logicModal: false,
            logicAnswer: '',
            logicModalContent: [],
        };
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        var id_pass = id.split("_")[0];
        var responid = id.split("_")[1];

        axios.get('/api/front/' + id_pass).then(response => {
            this.setState({
                survey: response.data.survey,
                surveyLength: response.data.surveyLength,
                title: response.data.title,
                index: '',
                respondentId: responid,
                surveyId: id_pass,
            });
        }).catch(error => {
            console.log(error);
        });
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

    rightArrowClick = (e) => {
        if(this.state.currentSurvey) {
            var newPageCount = this.state.pageCount;
            var q_Id = this.state.currentSurvey.split("*,*")[0];
            var ans = this.state.currentSurvey.split("*,*")[1];
            var q_type = this.state.currentSurvey.split("*,*")[2];
            newPageCount++;

            if(newPageCount == (this.state.surveyLength + 1)) { //submitted
                this.submitAnswer(q_type);
            } else {
                const form = {
                    questionId: q_Id,
                    answer: ans,
                    questionType: q_type,
                    questionCount: newPageCount
                };
                const { id } = this.props.match.params;
                var id_pass = id.split("_")[0];
                axios.post('/api/front/logic/' + id_pass, form).then(response => {
                    if(response.data.logic[0] == 'popup') {
                        this.setState({
                            popup: true,
                            logicModal: !this.state.logicModal,
                            logicModalContent: response.data.logicContent,
                            logicAnswer: response.data.logic[1],
                        });
                    } else if(response.data.logic[0] == 'end') {
                        this.submitAnswer(q_type);
                    } else {
                        this.setState({
                            survey: response.data.survey,
                            pageCount: response.data.newPageCount,
                            popup: false,
                        });

                        if(response.data.newPageCount == this.state.surveyLength) {
                            this.setState({
                                //leftHide: '',
                                currentSurvey: false,
                                rightHide: 'hideArrow',
                                submitShow: '',
                            });
                        } else {
                            this.setState({
                                //leftHide: '',
                                currentSurvey: false,
                                rightHide: '',
                                submitShow: 'hideSubmit',
                            });
                        }

                        this.switchFunction(q_type);
                    }

                }).catch(error => {
                    console.log(error);
                });
            }
        } else {
            alert('Please answer the survey');
        }
    }

    //set values for submitting results
    radioClick = (e) => {
        var targetId = e.target.name;
        this.setState({
            currentSurvey: targetId + "*,*" + e.target.value + "*,*radio",
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
                    currentSurvey: e.target.name + "*,*" + checkboxArray + "*,*checkbox",
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            } else {
                checkboxArray = checkboxArray + "," + e.target.value;
                this.setState({
                    currentSurvey: e.target.name + "*,*" + checkboxArray + "*,*checkbox",
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            }
        } else {
            if(checkboxArray.indexOf(e.target.value) == 0) {
                if(checkboxArray.indexOf(",") !== -1) {
                    checkboxArray = checkboxArray.replace(e.target.value + ",", "");
                    this.setState({
                        currentSurvey: e.target.name + "*,*" + checkboxArray + "*,*checkbox",
                        checkboxAnswer: checkboxArray,
                        checkboxId: e.target.name
                    });
                } else {
                    checkboxArray = checkboxArray.replace(e.target.value, "");
                    this.setState({
                        currentSurvey: false,
                        checkboxAnswer: checkboxArray,
                        checkboxId: e.target.name
                    });
                }
            } else {
                checkboxArray = checkboxArray.replace("," + e.target.value, "");
                this.setState({
                    currentSurvey: e.target.name + "*,*" + checkboxArray + "*,*checkbox",
                    checkboxAnswer: checkboxArray,
                    checkboxId: e.target.name
                });
            }
        }
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({
            currentSurvey: name + "*,*" + nextValue + "*,*star",
            rating: nextValue,
            defaultRating: nextValue,
            starRatingAnswer: nextValue,
            starRatingId: name
        });
    }

    essayCommentChange = (e) => {
        if(e.target.classList.contains("Comment")) {
            this.setState({
                currentSurvey: e.target.name + "*,*" + e.target.value + "*,*comment",
                commentAnswer: e.target.value,
                commentId: e.target.name
            });
        } else {
            this.setState({
                currentSurvey: e.target.name + "*,*" + e.target.value + "*,*essay",
                essayAnswer: e.target.value,
                essayId: e.target.name
            });
        }
    }

    textboxChange = (e) => {
        this.setState({
            currentSurvey: e.target.name + "*,*" + e.target.value + "*,*textbox",
            textboxAnswer: e.target.value,
            textboxId: e.target.name
        });
    }

    dropdownChange = (e) => {
        this.setState({
            currentSurvey: e.target.name + "*,*" + e.target.value + "*,*dropdown",
            dropdownAnswer: e.target.value,
            dropdownId: e.target.name,
            selectValue: e.target.value
        });
    }

    dateChange = (e) => {
        var targetId = e.target.name;
        this.setState({
            currentSurvey: targetId + "*,*" + e.target.value + "*,*date",
            dateAnswer: e.target.value,
            dateId: targetId
        });
    }

    toggleLogicModal = (toggle, action) => {
        this.setState({
            logicModal: !this.state.logicModal
        });

        if(toggle == 'yes') {
            var popupAnswer = this.state.logicModalContent['answer'];
            var popupQuestionId = this.state.logicModalContent['q_id'].toString();
            var popupQuestionType = this.state.logicModalContent['q_type'];
            var q_type = this.state.currentSurvey.split("*,*")[2];

            switch(popupQuestionType) {
                case 'Multiple Choice':
                    var arrayPos = this.state.multipleChoiceStorageId.indexOf(popupQuestionId);
                    var arrayContent = this.state.multipleChoiceStorage[arrayPos];
                    break;

                case 'Checkbox':
                    var arrayPos = this.state.checkboxStorageId.indexOf(popupQuestionId);
                    var arrayContent = this.state.checkboxStorage[arrayPos];
                    break;

                case 'Star':
                    var arrayPos = this.state.starRatingStorageId.indexOf(popupQuestionId);
                    var arrayContent = this.state.starRatingStorage[arrayPos];
                    break;
                case 'Dropdown':
                    var arrayPos = this.state.dropdownStorageId.indexOf(popupQuestionId);
                    var arrayContent = this.state.dropdownStorage[arrayPos];
                    break;
            }

            if(arrayContent == popupAnswer && action == 'end') {
                this.submitAnswer(q_type);
            } else {
                var questionNo = action + "_" + (this.state.pageCount + 1) + "_" + this.state.surveyId;
                
                axios.get('/api/front/logic/getPopup/' + questionNo).then(response => {
                    if(response.data.survey){
                        this.setState({
                            survey: response.data.survey,
                            pageCount: response.data.newPageCount,
                            popup: false,
                        });

                        if(response.data.newPageCount == this.state.surveyLength) {
                            this.setState({
                                //leftHide: '',
                                currentSurvey: false,
                                rightHide: 'hideArrow',
                                submitShow: '',
                            });
                        } else {
                            this.setState({
                                //leftHide: '',
                                currentSurvey: false,
                                rightHide: '',
                                submitShow: 'hideSubmit',
                            });
                        }

                        this.switchFunction(q_type);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }

    switchFunction = (q_type) => {
        switch(q_type) {
            case 'radio':
                var storageAnswer = this.state.multipleChoiceStorage;
                var storageId = this.state.multipleChoiceStorageId;
                storageAnswer.push(this.state.multipleChoiceAnswer);
                storageId.push(this.state.multipleChoiceId);
                this.setState({
                    multipleChoiceStorage: storageAnswer,
                    multipleChoiceStorageId: storageId,
                    multipleChoiceAnswer: '',
                    multipleChoiceId: '',
                });
                break;
                
            case 'checkbox':
                var storageAnswer = this.state.checkboxStorage;
                var storageId = this.state.checkboxStorageId;
                storageAnswer.push(this.state.checkboxAnswer);
                storageId.push(this.state.checkboxId);
                this.setState({
                    checkboxStorage: storageAnswer,
                    checkboxStorageId: storageId,
                    checkboxAnswer: '',
                    checkboxId: '',
                });
                break;
                
            case 'star':
                var storageAnswer = this.state.starRatingStorage;
                var storageId = this.state.starRatingStorageId;
                storageAnswer.push(this.state.starRatingAnswer);
                storageId.push(this.state.starRatingId);
                this.setState({
                    starRatingStorage: storageAnswer,
                    starRatingStorageId: storageId,
                    starRatingAnswer: '',
                    starRatingId: '',
                });
                break;
                
            case 'comment':
                var storageAnswer = this.state.commentStorage;
                var storageId = this.state.commentStorageId;
                storageAnswer.push(this.state.commentAnswer);
                storageId.push(this.state.commentId);
                this.setState({
                    commentStorage: storageAnswer,
                    commentStorageId: storageId,
                    commentAnswer: '',
                    commentId: '',
                });
                break;
                
            case 'essay':
                var storageAnswer = this.state.essayStorage;
                var storageId = this.state.essayStorageId;
                storageAnswer.push(this.state.essayAnswer);
                storageId.push(this.state.essayId);
                this.setState({
                    essayStorage: storageAnswer,
                    essayStorageId: storageId,
                    essayAnswer: '',
                    essayId: '',
                });
                break;
                
            case 'textbox':
                var storageAnswer = this.state.textboxStorage;
                var storageId = this.state.textboxStorageId;
                storageAnswer.push(this.state.textboxAnswer);
                storageId.push(this.state.textboxId);
                this.setState({
                    textboxStorage: storageAnswer,
                    textboxStorageId: storageId,
                    textboxAnswer: '',
                    textboxId: '',
                });
                break;
                
            case 'dropdown':
                var storageAnswer = this.state.dropdownStorage;
                var storageId = this.state.dropdownStorageId;
                storageAnswer.push(this.state.dropdownAnswer);
                storageId.push(this.state.dropdownId);
                this.setState({
                    dropdownStorage: storageAnswer,
                    dropdownStorageId: storageId,
                    dropdownAnswer: '',
                    dropdownId: '',
                });
                break;
                
            case 'date':
                var storageAnswer = this.state.dateStorage;
                var storageId = this.state.dateStorageId;
                storageAnswer.push(this.state.dateAnswer);
                storageId.push(this.state.dateId);
                this.setState({
                    dateStorage: storageAnswer,
                    dateStorageId: storageId,
                    dateAnswer: '',
                    dateId: '',
                });
                break;
        }
    }

    submitAnswer = (q_type) => {
        var mc_a = this.state.multipleChoiceStorage;
        var mc_id = this.state.multipleChoiceStorageId;
        var cb_a = this.state.checkboxStorage;
        var cb_id = this.state.checkboxStorageId;
        var sr_a = this.state.starRatingStorage;
        var sr_id = this.state.starRatingStorageId;
        var es_a = this.state.essayStorage;
        var es_id = this.state.essayStorageId;
        var co_a = this.state.commentStorage;
        var co_id = this.state.commentStorageId;
        var tb_a = this.state.textboxStorage;
        var tb_id = this.state.textboxStorageId;
        var dd_a = this.state.dropdownStorage;
        var dd_id = this.state.dropdownStorageId;
        var da_a = this.state.dateStorage;
        var da_id = this.state.dateStorageId;

        switch(q_type) {
            case 'radio':
                mc_a.push(this.state.multipleChoiceAnswer);
                mc_id.push(this.state.multipleChoiceId);
                break;
                
            case 'checkbox':
                cb_a.push(this.state.checkboxAnswer);
                cb_id.push(this.state.checkboxId);
                break;
                
            case 'star':
                sr_a.push(this.state.starRatingAnswer);
                sr_id.push(this.state.starRatingId);
                break;
                
            case 'comment':
                co_a.push(this.state.commentAnswer);
                co_id.push(this.state.commentId);
                break;
                
            case 'essay':
                es_a.push(this.state.essayAnswer);
                es_id.push(this.state.essayId);
                break;
                
            case 'textbox':
                tb_a.push(this.state.textboxAnswer);
                tb_id.push(this.state.textboxId);
                break;
                
            case 'dropdown':
                dd_a.push(this.state.dropdownAnswer);
                dd_id.push(this.state.dropdownId);
                break;
                
            case 'date':
                da_a.push(this.state.dateAnswer);
                da_id.push(this.state.dateId);
                break;
        }

        const { id } = this.props.match.params;
        var id_pass = id.split("_")[0];
        const form = {
            respondentId: this.state.respondentId,
            //answers
            multipleChoiceAnswer: mc_a,
            multipleChoiceId: mc_id,
            checkboxAnswer: cb_a,
            checkboxId: cb_id,
            starRatingAnswer: sr_a,
            starRatingId: sr_id,
            essayAnswer: es_a,
            essayId: es_id,
            commentAnswer: co_a,
            commentId: co_id,
            textboxAnswer: tb_a,
            textboxId: tb_id,
            dropdownAnswer: dd_a,
            dropdownId: dd_id,
            dateAnswer: da_a,
            dateId: da_id,
        };
        console.log(form);
        
        axios.post('/api/webmaster/answerRespondent/' + id_pass, form).then(response => {
            if(response.data.success) {
                alert('Data submitted');
                this.props.history.push('/survey/welcome/'+ this.state.surveyId);
            } else {
                alert('something went wrong');
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        let viewModal
        var liCount = 1;
        var iterator = 1;
        const { rating } = this.state;

        const renderQuestion = this.state.survey.map(list =>
            <li key={list.id} /*className={checkActive("list-" + liCount++)}*/>
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

        if(this.state.popup) {
            viewModal = <FrontEndPopup
                            isOpen={this.state.logicModal}
                            closeModal={this.toggleLogicModal}
                            answer={this.state.logicAnswer}
                            logicContent={this.state.logicModalContent}
                        />
        }
        
        return(
            <React.Fragment>
                <header>
                    <div className="container">
                        <Header 
                            title = {this.state.title}
                        />
                        {viewModal}
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
                                        <button type="submit" className={"btn-submit-answer " + this.state.submitShow} onClick={this.rightArrowClick}>Submit</button>
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