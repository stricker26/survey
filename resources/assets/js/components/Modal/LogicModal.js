import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import axios from 'axios';

export default class LogicModal extends Component {
	constructor() {
		super();
		this.state = {
			//first stage ng select
			choice: [],
			action: [],
			answers: [],
			question_id: '',
			popup: '',

			popupMessage: [],
			popupQuestion: [],
			popupAnswer: [],
			popupAction: [],
			question_no: '',
		};
	}

	handleChange = (e) => {
        if(e.target.value == '') {
        	var choice = this.state.choice;
        	var action = this.state.action;
        	var arrayPos = choice.indexOf(e.target.dataset.value);
        	choice.splice(arrayPos, 1);
        	action.splice(arrayPos, 1);
        } else {
        	var choice = this.state.choice;
        	var action = this.state.action;
        	var arrayPos = choice.indexOf(e.target.dataset.value);
        	if(arrayPos == -1) {
	        	choice.push(e.target.dataset.value);
	        	action.push(e.target.value);
        	} else {
        		choice[arrayPos] = e.target.dataset.value;
        		action[arrayPos] = e.target.value;
        	}
        }

    	if(e.target.value == 'popup') {
			var popup = parseInt(e.target.dataset.row,10);
    	} else {
			popup = '';

			//remove the data on popup
			// var popupQuestion = this.state.popupQuestion;
			// var popupAnswer = this.state.popupAnswer;
			// var popupAction = this.state.popupAction;

			// popupQuestion[e.target.dataset.count] = null;
			// popupAnswer[e.target.dataset.count] = null;
			// popupAction[e.target.dataset.count] = null;

			// var arrayPos = arrayCount.indexOf(e.target.dataset.count);
			// arrayCount.splice(arrayPos, 1);

			// this.setState({
			// 	popupQuestion: popupQuestion,
			// 	popupAnswer: popupAnswer,
			// 	popupAction: popupAction
			// });
    	}

    	this.setState({
    		choice: choice,
    		action: action,
    		question_id: e.target.dataset.id,
    		popup: popup,
    	});
	}

	popupChange = (e) => {
		var question = this.state.popupQuestion;
		var answer = this.state.popupAnswer;
		var action = this.state.popupAction;

		//check if question, answer, or action select tag yung nabago
		if(e.target.dataset.select == 'Question') {

			question[e.target.dataset.count] = parseInt(e.target.value, 10);
			answer[e.target.dataset.count] = (answer[e.target.dataset.count] ? answer[e.target.dataset.count] : null );
			action[e.target.dataset.count] = (action[e.target.dataset.count] ? action[e.target.dataset.count] : null );
			
			this.setState({
				question_no: question
			});

		} else if(e.target.dataset.select == 'Answer') {

			question[e.target.dataset.count] = (question[e.target.dataset.count] ? question[e.target.dataset.count] : null );
			answer[e.target.dataset.count] = e.target.value;
			action[e.target.dataset.count] = (action[e.target.dataset.count] ? action[e.target.dataset.count] : null );

		} else if(e.target.dataset.select == 'Action') {

			question[e.target.dataset.count] = (question[e.target.dataset.count] ? question[e.target.dataset.count] : null );
			answer[e.target.dataset.count] = (answer[e.target.dataset.count] ? answer[e.target.dataset.count] : null );
			action[e.target.dataset.count] = e.target.value;

		}

		this.setState({
			popupQuestion: question,
			popupAnswer: answer,
			popupAction: action,
		});
	}

	textareaChange = (e) => {
		var message = this.state.popupMessage;

		message[e.target.dataset.count] = e.target.value;

		this.setState({
			popupMessage: message
		});
	}

	saveLogic = () => {
		const { closeModal } = this.props;
		var nullCheck = true;
		var question = this.state.popupQuestion;
		var answer = this.state.popupAnswer;
		var action = this.state.popupAction;

		var arrayCount = question.length;
		var questionCheck = 0;
		var answerCheck = 0;
		var actionCheck = 0;
		if(arrayCount != 0) {
			for(var x = 0; x < arrayCount; x++) {
				if(question[x]) {
					questionCheck++;
				}

				if(answer[x]) {
					answerCheck++;
				}

				if(action[x]) {
					actionCheck++;
				}
			}

			if(questionCheck == answerCheck && answerCheck == actionCheck) {
				nullCheck = true;
			} else {
				nullCheck = false;
			}
		}

		if(nullCheck) {
			const form = {
				choice: this.state.choice,
				action: this.state.action,
				q_id: this.state.question_id,

				arrayCount: arrayCount,
				message: this.state.popupMessage,
				question: this.state.popupQuestion,
				answer: this.state.popupAnswer,
				paction: this.state.popupAction,
			};

			axios.post('/api/webmaster/logic', form).then(response => {
	            if(response.data.success) {
	            	alert('saving success');
	            	closeModal();
	            }
	        }).catch(errors => {
	            console.log(errors);
	        });
        } else {
        	alert('Popup settings not complete');
        }
	}

	render() {
		const { isOpen, closeModal, questionList, answerList, q_no } = this.props;
		let iterator = 0;
		const question = (id, select, index) => questionList.map((questions, key) => {
			return (
				<Choose>
					<When condition = {(id != questions.id ? true : false) && (select == "first-select")}>
						<option 
							key={questions.id}
							value={questions.id}>
								{!index ? "Skip to " : ""}Q{key + 1}
						</option>
					</When>
					<When condition = {select == "second-select" && (index - 1) > key}>
						<option 
							key={questions.id}
							value={questions.id}>
								Q{key + 1}
						</option>
					</When>
					<When condition = {select == "third-select" && this.state.question_no[index] && this.state.question_no[index] == questions.id}>
						{(JSON.parse(questions.answer)).map((value, key) =>
							<option 
								key={key}
								value={value.answer}>
									{value.answer}
							</option>
						)}
					</When>
					<When condition = {select == "fourth-select" && (index - 1) < key}>
						<option 
							key={questions.id}
							value={questions.id}>
								Q{key + 1}
						</option>
					</When>
				</Choose>
			)
		});

		return (
			<React.Fragment>
				<Modal isOpen={isOpen} className="logic-modal">
					<ModalHeader className="header-primary">Create Question Logic</ModalHeader>
					<ModalBody>
						<div className="row logic-header">
							<div className="col-md-5">
								<strong>If answer is ...</strong>
							</div>
							<div className="col-md-7">
								<strong>Then skip to ...</strong>
							</div>
						</div>
						<div className="logic-body">
							{answerList.map(answers =>
								JSON.parse(answers.answer).map((theAnswers, index) =>
									<div key={iterator = (iterator + 1).toString()} data-key={theAnswers.answer}>
										<div className="row">
											<div className="col-md-5">
												<label className="pt-2">{theAnswers.answer}</label>
											</div>
											<div className="col-md-7">
												<select data-value={theAnswers.answer} data-count={index} data-row={index} data-id={answers.id} className="form-control" onChange={this.handleChange}>
													<option value="">--Select--</option>
													{question(answers.id, "first-select", true)}
													(
														<Choose>
															<When condition = {q_no > 1}>
																<option value="popup">Popup</option>
															</When>
														</Choose>
													)
													<option value="end">End Survey</option>
													<option value="removeLogic">Remove Logic</option>
												</select>
											</div>
										</div>
										<div className={(this.state.popup === index ? 'show-popup' : 'hidden-popup')}>
											<hr/>
											<div className="pr-5 pl-5 pb-1">
												<div className="row">
													<div className="col">
														<label>Message:</label><br/>
														<textarea rows="3" className="form-control message-textarea" data-count={index} onChange={this.textareaChange}/>
													</div>
												</div>
												<div className="row">
													<div className="col-md-4">
														<label>Questions:</label><br/>
														<select className="form-control" defaultValue="" data-select="Question" data-count={index} onChange={this.popupChange}>
															<option value="" disabled>--Select--</option>
															{question(-1, "second-select", q_no)}
														</select>
													</div>
													<div className="col-md-4">
														<label>Answers:</label><br/>
														<select className="form-control" defaultValue="" data-select="Answer" data-count={index} onChange={this.popupChange}>
															<option value="" disabled>--Select--</option>
															{question(-1, "third-select", index)}
														</select>
													</div>
													<div className="col-md-4">
														<label>Action:</label><br/>
														<select className="form-control" defaultValue="" data-select="Action" data-count={index} onChange={this.popupChange}>
															<option value="" disabled>--Select--</option>
															{question(answers.id, "fourth-select", q_no)}
															<option value="end">End Survey</option>
														</select>
													</div>
												</div>
											</div>
											<hr className="pb-2"/>
										</div>
									</div>
								)
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
						<button type="button" className="btn btn-primary" onClick={this.state.choice.length == 0 ? closeModal : this.saveLogic}>Save</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}