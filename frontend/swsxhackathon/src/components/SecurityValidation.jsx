// src/components/SecurityValidation.jsx
import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const SecurityValidation = ({ securityValidation, onAccept, onDeny }) => {
	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4 flex items-center'>
				<ExclamationTriangleIcon className='h-6 w-6 text-purple-500 mr-2' />
				Security Validation
			</h2>
			{Object.keys(securityValidation).length === 0 ? (
				<p className='text-gray-600'>No security validation issues detected.</p>
			) : (
				<ul className='space-y-4'>
					{Object.entries(securityValidation).map(([key, value]) => (
						<li
							key={key}
							className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
							<div>
								<p className='text-gray-800 font-medium'>
									{key}: {value}
								</p>
							</div>
							<div className='flex space-x-2'>
								<button
									onClick={() => onAccept(key)}
									className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
									Accept
								</button>
								<button
									onClick={() => onDeny(key)}
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

export default SecurityValidation;
