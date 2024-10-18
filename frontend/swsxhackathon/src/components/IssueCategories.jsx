// src/components/IssueCategories.jsx
import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const IssueCategories = ({ validations }) => {
	// Categorize issues
	const categories = validations.reduce((acc, curr) => {
		if (curr.issue) {
			const type = curr.issue.type || "General";
			if (!acc[type]) acc[type] = [];
			acc[type].push(curr);
		}
		return acc;
	}, {});

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4'>Issue Categories</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{Object.keys(categories).map((category) => (
					<div key={category} className='border-l-4 border-red-500 pl-4'>
						<h3 className='text-lg font-medium text-gray-800 flex items-center'>
							<ExclamationTriangleIcon className='h-5 w-5 text-red-500 mr-2' />
							{category}
						</h3>
						<ul className='mt-2 list-disc list-inside text-gray-600'>
							{categories[category].map((issue) => (
								<li key={issue.id}>{issue.statement}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default IssueCategories;
