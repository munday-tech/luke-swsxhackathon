// src/components/GrammarIssues.jsx
import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const GrammarIssues = ({ grammarIssues, onAccept, onDeny }) => {
	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4 flex items-center'>
				<ExclamationTriangleIcon className='h-6 w-6 text-yellow-500 mr-2' />
				Grammar Issues
			</h2>
			{grammarIssues.length === 0 ? (
				<p className='text-gray-600'>No grammar issues detected.</p>
			) : (
				<ul className='space-y-4'>
					{grammarIssues.map((issue) => (
						<li
							key={issue.position}
							className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
							<div>
								<p className='text-gray-800 font-medium'>
									Issue: {issue.issue}
								</p>
								<p className='text-gray-600 text-sm'>
									Suggestion: {issue.suggestion}
								</p>
								<p className='text-gray-600 text-sm'>
									Position: {issue.position}
								</p>
							</div>
							<div className='flex space-x-2'>
								<button
									onClick={() => onAccept(issue.position)}
									className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
									Accept
								</button>
								<button
									onClick={() => onDeny(issue.position)}
									className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
									Deny
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GrammarIssues;
