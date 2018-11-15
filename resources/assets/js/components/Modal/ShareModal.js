import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class ShareModal extends Component {

	constructor() {
		super();
		this.state = {
    		copied: false
		}
	}

	handleChange = () => {
		return false;
	}

	onCopy = () => {
		this.setState({
			copied: true
		});
	}

	render() {

		const { isOpen, closeSurvey, surveyID} = this.props;

		let base_url = window.location.origin;

		return (
			<React.Fragment>
				<Modal isOpen={isOpen}>
					<ModalHeader className="header-primary">Share Survey</ModalHeader>
					<ModalBody>
						<div className="input-group mb-3">
						  	<div className="input-group-prepend">
						    	<span className="input-group-text" id="share">URL</span>
						  	</div>
						  	<input type="text" className="share-option form-control" value={base_url + "/survey/welcome/" + surveyID} onChange={this.handleChange} aria-describedby="share" />
						</div>
					</ModalBody>
					<ModalFooter>
						<button type="button" className="btn btn-secondary" onClick={closeSurvey}>Close</button>
						<CopyToClipboard text={base_url + "/survey/welcome/" + surveyID} onCopy={this.onCopy}>
							<button type="button" className="btn btn-primary">Copy URL</button>
						</CopyToClipboard>
					</ModalFooter>
				</Modal>
			</React.Fragment>	
		);
	}
}