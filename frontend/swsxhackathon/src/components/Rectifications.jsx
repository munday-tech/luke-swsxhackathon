// src/components/Rectifications.jsx
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const Rectifications = ({ validations, onAccept, onDeny }) => {
	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4'>Rectifications</h2>
			<ul className='space-y-4'>
				{validations.map(
					(validation) =>
						validation.issue && (
							<li
								key={validation.id}
								className='flex justify-between items-center'>
								<div>
									<p className='text-gray-800 font-medium'>
										{validation.statement}
									</p>
									<p className='text-gray-600'>{validation.issue.suggestion}</p>
								</div>
								<div className='flex space-x-2'>
									<button
										onClick={() => onAccept(validation.id)}
										className='flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
										<PencilSquareIcon className='h-5 w-5 mr-1' /> Accept
									</button>
									<button
										onClick={() => onDeny(validation.id)}
										className='flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
										<TrashIcon className='h-5 w-5 mr-1' /> Deny
									</button>
								</div>
							</li>
						)
				)}
			</ul>
		</div>
	);
};

export default Rectifications;
