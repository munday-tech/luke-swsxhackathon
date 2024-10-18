// src/components/ActionableInsights.jsx
import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";

const ActionableInsights = ({ insights }) => {
	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4'>Actionable Insights</h2>
			<ul className='space-y-4'>
				{insights.map((insight, index) => (
					<li key={index} className='flex items-start'>
						<LightBulbIcon className='h-6 w-6 text-yellow-500 mt-1' />
						<div className='ml-3'>
							<h3 className='text-lg font-medium text-gray-800'>{insight}</h3>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ActionableInsights;
