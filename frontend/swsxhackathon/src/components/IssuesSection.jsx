// src/components/IssuesSection.jsx

import React, { useState } from "react";
import {
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ShieldExclamationIcon, // Importing a security-related icon
} from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const IssuesSection = ({ validations, onAccept, onDeny }) => {
	const [filter, setFilter] = useState("all");

	// Separate validations into general and security issues
	const generalIssues = validations.filter(
		(validation) =>
			validation.issue && validation.issue.type.toLowerCase() !== "security"
	);
	const securityIssues = validations.filter(
		(validation) =>
			validation.issue && validation.issue.type.toLowerCase() === "security"
	);

	// Combined filter for all issues
	const filteredValidations = validations.filter((validation) => {
		if (filter === "all") return true;
		return validation.status === filter;
	});

	const statusIcon = (status) => {
		switch (status) {
			case "resolved":
				return <CheckCircleIcon className='h-5 w-5 text-green-500' />;
			case "pending":
				return <ExclamationTriangleIcon className='h-5 w-5 text-yellow-500' />;
			case "denied":
				return <ExclamationTriangleIcon className='h-5 w-5 text-red-500' />;
			default:
				return <ExclamationTriangleIcon className='h-5 w-5 text-gray-500' />;
		}
	};

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			{/* Filter Buttons */}
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-semibold'>Detected Issues</h2>
				<div className='flex space-x-2'>
					<button
						onClick={() => setFilter("all")}
						className={`px-3 py-1 rounded ${
							filter === "all"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}>
						All
					</button>
					<button
						onClick={() => setFilter("pending")}
						className={`px-3 py-1 rounded ${
							filter === "pending"
								? "bg-yellow-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}>
						Pending
					</button>
					<button
						onClick={() => setFilter("resolved")}
						className={`px-3 py-1 rounded ${
							filter === "resolved"
								? "bg-green-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}>
						Resolved
					</button>
					<button
						onClick={() => setFilter("denied")}
						className={`px-3 py-1 rounded ${
							filter === "denied"
								? "bg-red-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}>
						Denied
					</button>
				</div>
			</div>

			{/* General Compliance Issues */}
			{generalIssues.length > 0 && (
				<div className='mb-6'>
					<h3 className='text-lg font-semibold mb-2'>Compliance Issues</h3>
					<ul className='space-y-4'>
						{generalIssues.filter(
							(validation) => filter === "all" || validation.status === filter
						).length === 0 ? (
							<p className='text-gray-600'>No compliance issues detected.</p>
						) : (
							generalIssues
								.filter(
									(validation) =>
										filter === "all" || validation.status === filter
								)
								.map(
									(validation) =>
										validation.issue && (
											<li
												key={validation.id}
												className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
												<div className='flex items-center space-x-4'>
													{statusIcon(validation.status)}
													<div>
														<p className='text-gray-800 font-medium'>
															{validation.statement}
														</p>
														<p className='text-gray-600 text-sm'>
															{validation.issue.reason}
														</p>
													</div>
												</div>
												<div className='flex space-x-2'>
													{validation.issue.suggestion && (
														<button
															onClick={() => onAccept(validation.id)}
															className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
															Accept
														</button>
													)}
													<button
														onClick={() => onDeny(validation.id)}
														className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
														Deny
													</button>
												</div>
											</li>
										)
								)
						)}
					</ul>
				</div>
			)}

			{/* Security Issues */}
			{securityIssues.length > 0 && (
				<div>
					<h3 className='text-lg font-semibold mb-2 flex items-center'>
						<ShieldExclamationIcon className='h-5 w-5 text-red-500 mr-2' />
						Security Issues
					</h3>
					<ul className='space-y-4'>
						{securityIssues.filter(
							(validation) => filter === "all" || validation.status === filter
						).length === 0 ? (
							<p className='text-gray-600'>No security issues detected.</p>
						) : (
							securityIssues
								.filter(
									(validation) =>
										filter === "all" || validation.status === filter
								)
								.map(
									(validation) =>
										validation.issue && (
											<li
												key={validation.id}
												className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
												<div className='flex items-center space-x-4'>
													{statusIcon(validation.status)}
													<div>
														<p className='text-gray-800 font-medium'>
															{validation.statement}
														</p>
														<p className='text-gray-600 text-sm'>
															{validation.issue.reason}
														</p>
													</div>
												</div>
												<div className='flex space-x-2'>
													{validation.issue.suggestion && (
														<button
															onClick={() => onAccept(validation.id)}
															className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
															Accept
														</button>
													)}
													<button
														onClick={() => onDeny(validation.id)}
														className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
														Deny
													</button>
												</div>
											</li>
										)
								)
						)}
					</ul>
				</div>
			)}

			{/* No Issues Message */}
			{generalIssues.length === 0 && securityIssues.length === 0 && (
				<p className='text-gray-600'>
					No compliance or security issues detected. Great job!
				</p>
			)}
		</div>
	);
};

IssuesSection.propTypes = {
	validations: PropTypes.array.isRequired,
	onAccept: PropTypes.func.isRequired,
	onDeny: PropTypes.func.isRequired,
};

export default IssuesSection;
