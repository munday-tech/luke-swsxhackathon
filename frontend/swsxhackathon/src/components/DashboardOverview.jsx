// src/components/DashboardOverview.jsx
import React from "react";
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ClockIcon,
	ChartBarIcon,
} from "@heroicons/react/24/solid";

const DashboardOverview = ({ validations }) => {
	const totalIssues = validations.length;
	const resolvedIssues = validations.filter(
		(v) => v.status === "resolved"
	).length;
	const pendingIssues = totalIssues - resolvedIssues;
	const complianceScore = Math.max(0, 100 - totalIssues * 5); // Example calculation

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
			{/* Total Issues */}
			<div className='flex items-center p-4 bg-white shadow rounded-lg'>
				<ExclamationTriangleIcon className='h-12 w-12 text-red-500' />
				<div className='ml-4'>
					<p className='text-sm font-medium text-gray-500'>Total Issues</p>
					<p className='text-2xl font-semibold text-gray-800'>{totalIssues}</p>
				</div>
			</div>

			{/* Resolved Issues */}
			<div className='flex items-center p-4 bg-white shadow rounded-lg'>
				<CheckCircleIcon className='h-12 w-12 text-green-500' />
				<div className='ml-4'>
					<p className='text-sm font-medium text-gray-500'>Resolved Issues</p>
					<p className='text-2xl font-semibold text-gray-800'>
						{resolvedIssues}
					</p>
				</div>
			</div>

			{/* Pending Issues */}
			<div className='flex items-center p-4 bg-white shadow rounded-lg'>
				<ClockIcon className='h-12 w-12 text-yellow-500' />
				<div className='ml-4'>
					<p className='text-sm font-medium text-gray-500'>Pending Issues</p>
					<p className='text-2xl font-semibold text-gray-800'>
						{pendingIssues}
					</p>
				</div>
			</div>

			{/* Compliance Score */}
			<div className='flex flex-col p-4 bg-white shadow rounded-lg'>
				<div className='flex items-center'>
					<ChartBarIcon className='h-12 w-12 text-blue-500' />
					<div className='ml-4'>
						<p className='text-sm font-medium text-gray-500'>
							Compliance Score
						</p>
						<p className='text-2xl font-semibold text-gray-800'>
							{complianceScore}%
						</p>
					</div>
				</div>
				<div className='mt-4 w-full bg-gray-200 rounded-full h-2.5'>
					<div
						className='bg-blue-600 h-2.5 rounded-full'
						style={{ width: `${complianceScore}%` }}></div>
				</div>
			</div>
		</div>
	);
};

export default DashboardOverview;
