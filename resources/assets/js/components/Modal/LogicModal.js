import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

export default class LogicModal extends Component {
	constructor() {
		super();
		this.state = {
			answers: []
		}
	}

	handleChange(event) {
        console.log(event.target.value);
        console.log(event.target.getAttribute('data-value'));
	}

	saveLogic = () => {
		console.log(this.state.answers);
	}

	render() {

		const { isOpen, closeModal, questionList, answerList } = this.props;
		let iterator, qId = 0;
		const question = (e) => questionList.map(questions => {
			return <option 
				key={questions.id}
				data-value={e}
				value={questions.id}>
					Q{qId = qId + 1}
			</option>
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
											<select className="form-control" onChange={this.handleChange}>
												<option value="">--Select--</option>
												{question(theAnswers.answer)}
												<option data-value={theAnswers.answer} value="popup">Popup</option>
												<option data-value={theAnswers.answer} value="end">End Survey</option>
											</select>
										</div>
									</div>
								)
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
						<button type="button" className="btn btn-primary" onClick={this.saveLogic}>Save</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}