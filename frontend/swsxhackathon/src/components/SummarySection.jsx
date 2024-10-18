// src/components/SummarySection.jsx
import React from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

const SummarySection = ({ summary }) => {
	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<div className='flex items-center mb-4'>
				<ClipboardDocumentListIcon className='h-6 w-6 text-blue-500' />
				<h2 className='text-xl font-semibold ml-2'>Compliance Summary</h2>
			</div>
			<p className='text-gray-700'>{summary}</p>
		</div>
	);
};

export default SummarySection;
