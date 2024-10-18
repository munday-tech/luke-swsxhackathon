// src/components/ComplianceCheckTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ComplianceCheckTable = () => {
	const [complianceChecks, setComplianceChecks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch data from the API
		const fetchComplianceChecks = async () => {
			try {
				const response = await fetch(
					"https://74wbta.buildship.run/compliance/checks"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch compliance checks");
				}
				const data = await response.json();
				setComplianceChecks(data);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchComplianceChecks();
	}, []);

	if (loading) {
		return (
			<div className='flex justify-center items-center py-10'>
				<div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16'></div>
				<span className='ml-4 text-gray-700'>Loading compliance checks...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center py-10'>
				<p className='text-red-500'>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h2 className='text-2xl font-semibold mb-6 text-gray-800'>
				Compliance Checks
			</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
					<thead className='bg-gray-200'>
						<tr>
							<th className='py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase border-b border-gray-300'>
								Filename
							</th>
							<th className='py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase border-b border-gray-300'>
								Compliance Rate
							</th>
							<th className='py-4 px-6 text-center text-sm font-bold text-gray-700 uppercase border-b border-gray-300'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{complianceChecks.map((check) => (
							<tr key={check.id} className='border-b hover:bg-gray-100'>
								<td className='py-4 px-6 text-sm text-gray-700 border-r border-gray-300'>
									{check.data.filename}
								</td>
								<td className='py-4 px-6 text-sm text-gray-700 border-r border-gray-300'>
									{(check.data.compliance * 100).toFixed(2)}%
								</td>
								<td className='py-4 px-6 text-sm text-center'>
									<button
										onClick={() =>
											navigate(`/compliance/checks.record/${check.id}`)
										}
										className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
										View Details
									</button>
								</td>
							</tr>
						))}
						{complianceChecks.length === 0 && (
							<tr>
								<td colSpan='3' className='py-4 px-6 text-center text-gray-500'>
									No compliance checks found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ComplianceCheckTable;
