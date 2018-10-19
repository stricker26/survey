import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ValidateModal extends Component {

	render() {
		const { isOpen, closeSurvey} = this.props;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen}>
					<ModalHeader>Warning!</ModalHeader>
					<ModalBody>
						<p>Question type and Question title are required.</p>
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}