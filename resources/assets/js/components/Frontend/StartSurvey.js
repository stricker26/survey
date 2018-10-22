import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import StarRatingComponent from 'react-star-rating-component';
import Parser from 'html-react-parser';
import Header from './Layouts/Header';

export default class Survey extends Component {
    constructor() {
        super();
        this.state = {
            survey: [],
            title: '',
            rating: 0,
            defaultRating: 0,
            starImage: './../../images/star-single.png'
        };
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({
            rating: nextValue,
            defaultRating: nextValue
        });
    }

    onStarHover(nextValue, prevValue, name) {
        console.log("Next Value %s, Previous Value %s, Name %s", nextValue, prevValue, name);  
        if(nextValue > this.state.defaultRating) {
            this.setState({rating: nextValue});
        }
    }

    onStarHoverOut(nextValue, prevValue, name) {
        console.log("Next Value %s, Previous Value %s, Name %s", nextValue, prevValue, name); 
        this.setState({rating: this.state.defaultRating});
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/front/' + id).then(response => {
            this.setState({
                survey: response.data.survey,
                title: response.data.title,
                index: '',
                hover: false
            });
        }).catch(error => {
            console.log(error);
        });
    }

    mouseLeave = () => {
  this.setState({ isMouseInside: false });
}

    render() {
        var star = 5;
        var iterator = 1;
        const { rating } = this.state;
        const renderQuestion = this.state.survey.map(list => 
            <div className="question-wrapper" key={list.id}>
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
                                            <input type="radio" name={"answer" + list.id + "[]"} id={"option" + iterator.toString()} value={key.answer} />
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
                                            <input type="checkbox" name={"answer" + list.id + "[]"} id={"option" + iterator.toString()} value={key.answer} />
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
                                            name="rateStar" 
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
                                                            <i className={index <= value ? 'fas fa-star star-' + star-- : 'far fa-star star-' + star--} />
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
                                    <textarea className="essay-textarea"/>
                                </div>
                            </div>
                        </div>
                    </When>
                    <When condition = {list.q_type == 'Textbox'}>
                        <div className="row">
                            <div className="col">
                                <div className="answer-text">
                                    <input type="text" className="textbox-input"/>
                                </div>
                            </div>
                        </div>
                    </When>
                    <When condition = {list.q_type == 'Dropdown'}>
                        <div className="row">
                            <div className="col">
                                <div className="answer-text">
                                    <div className="dropdown-select">
                                        <select>
                                            <option className="dropdown-option" disabled selected value>-- Select --</option>
                                            {
                                                (JSON.parse(list.answer)).map(key =>
                                                    <option className="dropdown-option" value={key.answer}>{key.answer}</option>
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
                                    
                                </div>
                            </div>
                        </div>
                    </When>
                </Choose>
            </div>
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
                        {renderQuestion}
                    </div>
                </section>
            </React.Fragment>
        );
    }
}