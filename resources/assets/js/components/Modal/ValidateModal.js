import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ValidateModal extends Component {

	render() {
		const { isOpen, closeSurvey, warningHeader, warningContent, warningTheme} = this.props;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen}>
					<ModalHeader className={warningTheme}>{warningHeader}</ModalHeader>
					<ModalBody>
						<p>{warningContent}</p>
					</ModalBody>
					<ModalFooter>
						<button type="button" className={"btn btn-" + warningTheme} onClick={closeSurvey}>Close</button>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}