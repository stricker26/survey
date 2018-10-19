import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import Tools from './Tools';
import { Editor } from '@tinymce/tinymce-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

export default class AddQuestions extends Component {

     constructor() {
        super();
        this.state = {
            name: '',
            answers: [{ answer: '' }],
            defaultQtype: 'Checkbox',
            passToolvalue: '',
            qTitle: '',
            random: 0, 
            wChoice: 0,
            result: '',
            surveyID: '',
            warningModal: false,
            circleIcon: './../../../../images/circle-icon.png',
            squareIcon: './../../../../images/square-icon.png',
            starIcon: './../../../../images/star-icon.png',
        };
    }

    handleAnswerNameChange = (idx) => (evt) => {
        const newAnswers = this.state.answers.map((answer, sidx) => {
            if (idx !== sidx) return answer;
            return { ...answer, answer: evt.target.value };
        });

        this.setState({ answers: newAnswers });
    }

    handleAddAnswer = () => {
        this.setState({
            answers: this.state.answers.concat([{ answer: '' }])
        });
    }

    handleRemoveAnswer = (idx) => () => {
        this.setState({
            answers: this.state.answers.filter((s, sidx) => idx !== sidx)
        });
    }

    passToolvalue = (e) => {
        this.setState({
            defaultQtype: e
        });
    }

    handleQtitle = (e) => {
        this.setState({
            qTitle: e.target.getContent()
        });

    }

    selectRandom = () => {
        this.setState({ random: !this.state.random });
    }

    selectWChoice = () => {
        this.setState({ wChoice: !this.state.wChoice });
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ surveyID: id });
    }

    toggleWarnigModal() {
        this.setState({
            warningModal: !this.state.warningModal
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            id: this.state.surveyID,
            title: this.state.qTitle,
            type: this.state.defaultQtype,
            order: this.state.random,
            wchoice: this.state.wChoice,
            answers: this.state.answers
        }

        axios.post('/api/webmaster/question', form).then(response => {
            if(response.data.success) {

            } else {
                this.toggleWarnigModal
            }
        }).catch(error => {
            console.log(error);
        });

    }

    render() {

        let toolType = this.state.defaultQtype;
        let tool;

        if(toolType == 'Checkbox') {
            tool = this.state.answers.map((answer, idx) => (
                <div className="form-group" key={idx}>
                    <div className="tool-option">
                        <img src={this.state.squareIcon} alt="Checkbox" />
                        <label htmlFor={idx}><span>{answer.answer}</span></label>
                    </div>
                </div>
            ));
        } else if(toolType == 'Multiple Choice') {
             tool = this.state.answers.map((answer, idx) => (
                <div className="form-group" key={idx}>
                    <div className="tool-option">
                        <img src={this.state.circleIcon} alt="Selectbox" />
                        <label htmlFor={idx}><span>{answer.answer}</span></label>
                    </div>
                </div>
            ));
        } else if(toolType == 'Star') {
             tool = this.state.answers.map((answer, idx) => (
                <div className="form-group" key={idx}>
                    <div className="tool-option">
                        <img src={this.state.starIcon} alt="Selectbox" />
                        <label htmlFor={idx}><span>{answer.answer}</span></label>
                    </div>
                </div>
            ));
        } else if(toolType == 'Essay') {
            tool = <div className="form-group">
                <div className="tool-option">
                    <div className="border-bottom">
                        <p>Long answer text</p>
                    </div>
                </div>
            </div>
        } else if(toolType == 'Textbox') {
            tool = <div className="form-group">
                <div className="tool-option">
                    <div className="border-bottom">
                        <p>Short answer text</p>
                    </div>
                </div>
            </div>
        } else if(toolType == 'Comment') {
            tool = <div className="form-group">
                <div className="tool-option">
                    <div className="border-bottom">
                        <p>Long answer text</p>
                    </div>
                </div>
            </div>
        } else {
            
        }

        return (

            <React.Fragment>
                <header>
                    <div className="container">
                        <Header />
                    </div>
                </header>
                <section>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 bg-dark">
                                <div className="sidebar">
                                    <Tools 
                                        passToolvalue = {this.passToolvalue}
                                    />
                                    <div className="row tool-options">
                                        <div className="col">
                                            {this.state.answers.map((answer, idx) => (
                                                <div className="form-group" key={idx}>
                                                   <input
                                                        type="text"
                                                        value={answer.answer}
                                                        onChange={this.handleAnswerNameChange(idx)}
                                                        className="form-control"
                                                        placeholder="Type your answer"
                                                    />
                                                    <button type="button" onClick={this.handleRemoveAnswer(idx)} className="small">–</button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={this.handleAddAnswer} className="btn btn-light">Add an answer</button>
                                        </div>
                                    </div>
                                    <div className="row tool-check-option">
                                        <div className="col">
                                            <div className="checkbox">
                                                <input type="checkbox" id="multiple" name="multiple" />
                                                <label htmlFor="multiple">Select Multiple</label>
                                            </div>
                                            <div className="checkbox">
                                                <input type="checkbox" id="random" name="random" onClick={this.selectRandom} />
                                                <label htmlFor="random">Random Order</label>
                                            </div>
                                            <div className="checkbox">
                                                <input type="checkbox" id="write_in" name="write_in" onClick={this.selectWChoice} />
                                                <label htmlFor="write_in">Write-In Choice</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="hr-full"></div>
                                        </div>
                                    </div>
                                    <div className="row tools mt-3">
                                        <div className="col">
                                            <div className="advanced-option">Advanced Options</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 content-inner">
                                <div className="row content-inner-head">
                                    <div className="col">
                                        <ul>
                                            <li>Back</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row content-inner-body">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="col-lg-12">
                                            <div className="text-success">{this.state.result}</div>
                                            <div className="row">
                                                <div className="col">
                                                    <p>Question Title</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <Editor
                                                        apiKey='exzya7bbl9q4vfh1gpckwyoph94dkj5e7xeuj3lu1ts5eoh3' 
                                                        init={{ 
                                                            plugins: [
                                                                        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                                                                        "searchreplace wordcount visualblocks visualchars code fullscreen",
                                                                        "insertdatetime media nonbreaking save table contextmenu directionality",
                                                                        "emoticons template paste textcolor colorpicker textpattern"
                                                                    ],
                                                            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media"
                                                        }}
                                                        onChange={this.handleQtitle}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row question-preview tool-check-option mt-5">
                                                <div className="col">
                                                    <p>Q1</p>
                                                    <div className="card">
                                                        <div className="card-header">
                                                            {this.state.qTitle.replace(/<\/?[^>]+(>|$)/g, "")}
                                                        </div>
                                                        <div className="card-body">
                                                            {tool}
                                                        </div>
                                                    </div>
                                                    <input type="hidden" value={this.state.defaultQtype} />
                                                    <button className="btn btn-primary mt-5">Save Question</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer>
                    <div className="container">
                        <Footer />
                    </div>
                </footer>
            </React.Fragment>
        );
    }
}
