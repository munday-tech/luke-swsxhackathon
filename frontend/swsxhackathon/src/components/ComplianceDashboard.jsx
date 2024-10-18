// src/components/ComplianceDashboard.jsx
import React, { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import ComplianceTrends from "./ComplianceTrends";
import ActionableInsights from "./ActionableInsights";
import IssueCategories from "./IssueCategories";
import Rectifications from "./Rectifications";
import IssuesSection from "./IssuesSection";
import SummarySection from "./SummarySection";
import IssueResolutionCanvas from "./IssueResolutionCanvas"; // New import
import PropTypes from "prop-types";

const ComplianceDashboard = ({
	validations,
	onAccept,
	onDeny,
	summary,
	insights,
	markdownContent,
	highlightSentences,
	setMarkdownContent, // Ensure this prop is passed correctly
}) => {
	const [isCanvasOpen, setIsCanvasOpen] = useState(false);

	const handleOpenCanvas = () => {
		if (!isCanvasOpen) {
			// Prevent opening if already open
			setIsCanvasOpen(true);
		}
	};

	const handleCloseCanvas = () => {
		setIsCanvasOpen(false);
	};

	return (
		<div className='w-full max-w-7xl mx-auto my-4'>
			{/* "Resolve Issues Now" Button */}
			<button
				onClick={handleOpenCanvas}
				disabled={isCanvasOpen} // Disable button if modal is open
				className={`mb-4 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none ${
					isCanvasOpen ? "opacity-50 cursor-not-allowed" : ""
				}`}>
				Resolve Issues Now
			</button>

			<DashboardOverview validations={validations} />

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<SummarySection summary={summary} />
				<ActionableInsights insights={insights} />
			</div>
			{/* Issue Categories */}
			<IssueCategories validations={validations} />
			{/* Detected Issues */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<IssuesSection
					validations={validations}
					onAccept={onAccept}
					onDeny={onDeny}
				/>
				{/* Rectifications */}
				<Rectifications
					validations={validations}
					onAccept={onAccept}
					onDeny={onDeny}
				/>
			</div>

			{/* Issue Resolution Canvas */}
			{isCanvasOpen && (
				<IssueResolutionCanvas
					markdownContent={markdownContent}
					highlightSentences={highlightSentences}
					validations={validations}
					onAccept={onAccept}
					onDeny={onDeny}
					onClose={handleCloseCanvas}
					onContentChange={setMarkdownContent} // Pass handler to update parent state
				/>
			)}
		</div>
	);
};

// Define PropTypes for better type checking
ComplianceDashboard.propTypes = {
	validations: PropTypes.array.isRequired,
	onAccept: PropTypes.func.isRequired,
	onDeny: PropTypes.func.isRequired,
	summary: PropTypes.string.isRequired,
	insights: PropTypes.array.isRequired,
	markdownContent: PropTypes.string.isRequired,
	highlightSentences: PropTypes.array.isRequired,
	setMarkdownContent: PropTypes.func.isRequired, // Ensure this prop is passed
};

export default ComplianceDashboard;
