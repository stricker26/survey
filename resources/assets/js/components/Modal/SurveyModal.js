import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class SurveyModal extends Component {
	constructor() {
		super();
		this.state = {
			digitalIcon: './../images/digital-icon.png',
			liveSurveyIcon: './../images/live-survey-icon.png',
		}
	}

	render() {
		const { isOpen, closeSurvey} = this.props;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen} className="create-survey">
					<ModalHeader>Choose Survey Type</ModalHeader>
					<ModalBody>
						<div className="row">
							<div className="col">
								<Link to="/dashboard/survey/add" className="nav-link">
									<div className="blue-border">
										<img src={this.state.digitalIcon} alt="Digital Icon" />
										<p>Digital Survey</p>
									</div>
								</Link>
							</div>
							<div className="col">
								<div className="blue-border">
									<img src={this.state.liveSurveyIcon} alt="Digital Icon" />
									<p>Live Survey</p>
								</div>
							</div>
						</div>
					</ModalBody>
					<ModalFooter></ModalFooter>
					<span className="close-btn" onClick={closeSurvey}></span>
				</Modal>
			</React.Fragment>	
		);
	}
}