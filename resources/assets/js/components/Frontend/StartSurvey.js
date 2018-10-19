import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Parser from 'html-react-parser';
import Header from './Layouts/Header';

export default class Survey extends Component {
    constructor() {
        super();
        this.state = {
            survey: [],
            title: ''
        }
    }

    componentWillMount() {
        const { id } = this.props.match.params;

        axios.get('/api/front/' + id).then(response => {
            this.setState({
                survey: response.data.survey,
                title: response.data.title,
                index: ''
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        var iterator = 1;
        const renderQuestion = this.state.survey.map(list => 
            <div className="question-wrapper" key={list.id}>
                <div className="row">
                    <div className="col">
                        <h4>{Parser(list.q_title)}</h4>
                    </div>
                </div>
                <If condition = {list.q_type == 'Multiple Choice'}>
                    <Then>
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
                    </Then>
                </If>
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