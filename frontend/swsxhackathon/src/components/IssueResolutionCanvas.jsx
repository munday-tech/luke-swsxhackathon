import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import AceEditor from "react-ace";
import PropTypes from "prop-types";
import "./IssueResolutionCanvas.css"; // Ensure you have proper styling here

Modal.setAppElement("#root");

const IssueResolutionCanvas = ({
	markdownContent,
	highlightSentences,
	validations,
	onAccept,
	onDeny,
	onClose,
	onContentChange,
}) => {
	const [editorContent, setEditorContent] = useState(markdownContent);

	const handleEditorChange = (newContent) => {
		setEditorContent(newContent);
		onContentChange(newContent);
	};

	return (
		<Modal
			isOpen={true}
			onRequestClose={onClose}
			contentLabel='Issue Resolution Canvas'
			className='modal' // Add your own CSS class
			overlayClassName='overlay' // Add overlay CSS if needed
		>
			<div className='canvas-container'>
				{/* Left Side: Editor */}
				<div className='editor-section'>
					<h2 className='text-xl font-semibold mb-4'>Document Editor</h2>
					<AceEditor
						mode='markdown'
						theme='github'
						value={editorContent}
						onChange={handleEditorChange}
						width='100%'
						height='100%'
						fontSize={14}
						className='ace-editor'
					/>
					<button onClick={onClose} className='close-button'>
						X
					</button>
				</div>

				{/* Right Side: Issues List */}
				<div className='issues-section'>
					<h2 className='text-xl font-semibold mb-4'>Issues List</h2>
					<ul className='issues-list'>
						{validations.map((issue) => (
							<li key={issue.id} className='issue-item'>
								<p>
									<strong>Statement:</strong> {issue.statement}
								</p>
								{issue.issue && (
									<div className='issue-details'>
										<p>
											<strong>Type:</strong> {issue.issue.type}
										</p>
										<p>
											<strong>Reason:</strong> {issue.issue.reason}
										</p>
										<p>
											<strong>Suggestion:</strong> {issue.issue.suggestion}
										</p>
										<p>
											<strong>Policy:</strong> {issue.issue.policy}
										</p>
									</div>
								)}
								<div className='issue-actions'>
									<button
										onClick={() => onAccept(issue.id)}
										className='accept-button'>
										Accept
									</button>
									<button
										onClick={() => onDeny(issue.id)}
										className='deny-button'>
										Deny
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</Modal>
	);
};

// Define PropTypes for better type checking
IssueResolutionCanvas.propTypes = {
	markdownContent: PropTypes.string.isRequired,
	highlightSentences: PropTypes.array.isRequired,
	validations: PropTypes.array.isRequired,
	onAccept: PropTypes.func.isRequired,
	onDeny: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onContentChange: PropTypes.func.isRequired,
};

export default IssueResolutionCanvas;
