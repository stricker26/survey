import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import axios from 'axios';

export default class LogicModal extends Component {
	constructor() {
		super();
		this.state = {
			choice: [],
			action: [],
			question_id: '',
		};
	}

	handleChange = (e) => {
        //e.target.value = skip to
        //e.target.dataset.value = choice
        if(e.target.value == '') {
        	//remove "choices" and "skip to" to the array
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

    	this.setState({
    		choice: choice,
    		action: action,
    		question_id: e.target.dataset.id
    	});
	}

	saveLogic = () => {
		const form = {
			choice: this.state.choice,
			action: this.state.action,
			q_id: this.state.question_id,
		};

		axios.post('/api/webmaster/logic', form).then(response => {
            if(response.data.success) {
            	alert('saving success');
            }
        }).catch(errors => {
            console.log(errors);
        });
	}

	render() {

		const { isOpen, closeModal, questionList, answerList } = this.props;
		let iterator = 0;
		const question = (id) => questionList.map((questions, key) => {
			return (
				<Choose>
					<When condition = {id != questions.id ? true : false}>
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
								JSON.parse(answers.answer).map(theAnswers =>
									<div className="row" key={iterator = (iterator + 1).toString()} data-key={theAnswers.answer}>
										<div className="col-md-5">
											<label>{theAnswers.answer}</label>
										</div>
										<div className="col-md-7">
											<select data-value={theAnswers.answer} data-id={answers.id} className="form-control" onChange={this.handleChange}>
												<option value="">--Select--</option>
												{question(answers.id)}
												<option value="popup">Popup</option>
												<option value="end">End Survey</option>
												<option value="removeLogic">Remove Logic</option>
											</select>
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