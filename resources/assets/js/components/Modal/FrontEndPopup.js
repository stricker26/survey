import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import axios from 'axios';

export default class FrontEndPopup extends Component {
	constructor() {
		super();
		this.state = {
		};
	}

	approveAnswer = (e) => {
		const { closeModal, logicContent } = this.props;
		closeModal(e.target.value, logicContent.action);
	}

	render() {
		const { isOpen, closeModal, answer, logicContent } = this.props;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen} className="logic-modal">
					<ModalHeader className="header-primary">Question</ModalHeader>
					<ModalBody>
						<div className="row">
							<div className="col">
								<span>{logicContent.message}</span>
							</div>
						</div>
						<br/>
						<div className="row">
							<div className="col">
								<span>Are you sure your answer is:&nbsp;&nbsp;&nbsp;<strong>{answer}</strong></span>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-primary" onClick={this.approveAnswer} value="yes">Yes</button>
						<button type="button" className="btn btn-secondary" onClick={this.approveAnswer} value="no">No</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}