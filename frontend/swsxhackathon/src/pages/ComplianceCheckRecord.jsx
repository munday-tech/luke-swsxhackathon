// src/pages/ComplianceCheckRecord.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ComplianceCheckRecord = () => {
	const { id } = useParams(); // Get the compliance check ID from the URL
	const [checkData, setCheckData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch detailed data for the specific compliance check
		const fetchCheckData = async () => {
			try {
				const response = await fetch(
					`https://74wbta.buildship.run/compliance/checks/${id}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch compliance check details");
				}
				const data = await response.json();
				setCheckData(data);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchCheckData();
	}, [id]);

	if (loading) {
		return (
			<div className='flex justify-center items-center py-10'>
				<div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16'></div>
				<span className='ml-4 text-gray-700'>
					Loading compliance check details...
				</span>
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

	if (!checkData) {
		return (
			<div className='flex justify-center items-center py-10'>
				<p className='text-gray-500'>
					No data available for this compliance check.
				</p>
			</div>
		);
	}

	return (
		<div className='compliance-check-record'>
			{/* Optional Navbar for consistency */}
			<Navbar
				onUploadAnother={() => navigate("/")}
				onDownloadReport={() => {}}
				onResolveAll={() => {}}
			/>

			<div className='container mx-auto px-4 py-8'>
				<button
					onClick={() => navigate(-1)}
					className='mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400'>
					Back to Compliance Checks
				</button>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
					Compliance Check Details
				</h2>
				{/* Placeholder for detailed information */}
				<div className='bg-white shadow-md rounded-lg p-6'>
					<p className='mb-2'>
						<strong>Filename:</strong> {checkData.data.filename}
					</p>
					<p className='mb-2'>
						<strong>Compliance Rate:</strong>{" "}
						{(checkData.data.compliance * 100).toFixed(2)}%
					</p>
					{/* Add more detailed information here as needed */}
					<div className='mt-4'>
						<h3 className='text-xl font-semibold mb-2'>Additional Details</h3>
						<p className='text-gray-600'>
							More detailed information about the compliance check will be
							displayed here.
						</p>
						{/* You can add charts, logs, or other relevant data */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComplianceCheckRecord;
