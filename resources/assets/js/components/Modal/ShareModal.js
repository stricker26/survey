import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ShareModal extends Component {

	render() {
		const { isOpen, closeSurvey} = this.props;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen}>
					<ModalHeader>Share Survey</ModalHeader>
					<ModalBody>
						<input type="text" value={value} />
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-primary" onClick={closeSurvey}>Close</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}