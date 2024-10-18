// src/components/ComplianceTrends.jsx
import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const ComplianceTrends = ({ validations }) => {
	// Example data aggregation
	const dataMap = {};

	validations.forEach((validation) => {
		const date = new Date(validation.date || Date.now());
		const month = date.toLocaleString("default", {
			month: "short",
			year: "numeric",
		});
		dataMap[month] = (dataMap[month] || 0) + 1;
	});

	const data = Object.keys(dataMap).map((month) => ({
		month,
		issues: dataMap[month],
	}));

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-semibold mb-4'>Compliance Trends</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={data}>
					<CartesianGrid stroke='#e2e8f0' strokeDasharray='5 5' />
					<XAxis dataKey='month' stroke='#4a5568' />
					<YAxis stroke='#4a5568' />
					<Tooltip />
					<Line
						type='monotone'
						dataKey='issues'
						stroke='#3b82f6'
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default ComplianceTrends;
