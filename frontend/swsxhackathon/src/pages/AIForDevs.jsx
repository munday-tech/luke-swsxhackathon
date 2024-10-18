import React, { useState, useEffect } from "react";

function AIForDevs() {
	const [projectData, setProjectData] = useState({
		aiSolution: "",
		inferencesPerMonth: 0,
		model: "",
		energyConsumption: 0,
		carbonFootprint: 0,
		platform: "",
		hostingService: "",
		hostingCost: 0,
	});

	const [rating, setRating] = useState(0);
	const [recommendations, setRecommendations] = useState([]);

	// Predefined environmental impact data per model (tonnes of CO2 per billion inferences)
	const modelData = {
		"GPT-3": { params: 175e9, co2: 552, costPerInference: 0.00001 },
		"GPT-4": { params: 300e9, co2: 700, costPerInference: 0.000012 },
		BLOOM: { params: 176e9, co2: 24.69, costPerInference: 0.000004 },
		LLaMA: { params: 65e9, co2: 14, costPerInference: 0.000003 },
	};

	// Predefined hosting platforms and associated costs per day (energy and CO2 estimates)
	const platformData = {
		AWS: {
			services: ["EC2", "Lambda", "SageMaker"],
			co2PerDay: 0.05,
			energyCostPerDay: 1.5,
		},
		Azure: {
			services: ["VM", "Functions", "OpenAI Service"],
			co2PerDay: 0.06,
			energyCostPerDay: 1.7,
		},
		GCP: {
			services: ["Compute Engine", "App Engine", "Vertex AI"],
			co2PerDay: 0.04,
			energyCostPerDay: 1.4,
		},
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProjectData({ ...projectData, [name]: value });
	};

	const calculateImpact = () => {
		if (!projectData.model || !projectData.inferencesPerMonth) return;

		const modelInfo = modelData[projectData.model];
		if (!modelInfo) return;

		// Calculate total CO2 emissions and energy consumption based on inferences
		const totalCO2 = (modelInfo.co2 * projectData.inferencesPerMonth) / 1e9; // Convert to metric tonnes for the given inferences
		const totalEnergy = totalCO2 * 2; // Estimating energy consumption from CO2

		let platformCost = 0;
		let platformCO2 = 0;
		if (projectData.platform && platformData[projectData.platform]) {
			platformCost = platformData[projectData.platform].energyCostPerDay * 30; // Monthly hosting cost estimate
			platformCO2 = platformData[projectData.platform].co2PerDay * 30; // Monthly CO2 emissions for hosting
		}

		setProjectData({
			...projectData,
			energyConsumption: totalEnergy,
			carbonFootprint: totalCO2 + platformCO2, // Add platform emissions to model emissions
			hostingCost: platformCost,
		});

		const newRecommendations = [
			"Reduce the number of inferences per month or optimize models for efficiency.",
			"Choose cloud providers that use renewable energy for hosting.",
			"Use serverless architectures like AWS Lambda or Azure Functions to minimize idle resources.",
		];

		const newRating =
			totalCO2 + platformCO2 < 10 ? 5 : totalCO2 + platformCO2 < 50 ? 3 : 1;
		setRating(newRating);
		setRecommendations(newRecommendations);
	};

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-blue-600 to-green-500 text-white py-20'>
				<div className='container mx-auto text-center'>
					<h1 className='text-5xl font-bold mb-6'>
						AI for Developers: Sustainable AI Design
					</h1>
					<p className='text-xl max-w-2xl mx-auto'>
						Calculate the environmental cost of your AI projects and integrate
						sustainability into the design process with actionable strategies.
					</p>
				</div>
			</section>

			{/* Environmental Impact Calculation */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						Calculate the Environmental Impact of Your AI Solution
					</h2>

					<div className='max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg'>
						<h3 className='text-2xl font-semibold text-gray-900 mb-4'>
							Project Details
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							{/* AI Solution Dropdown */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									AI Solution
								</label>
								<select
									name='aiSolution'
									value={projectData.aiSolution}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'>
									<option value=''>Select AI Solution</option>
									<option value='Chatbot'>Chatbot</option>
									<option value='NLP'>NLP</option>
									<option value='Vision Model'>Vision Model</option>
									<option value='Generative AI'>Generative AI</option>
								</select>
							</div>

							{/* Inferences per Month Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Inferences per Month
								</label>
								<input
									type='number'
									name='inferencesPerMonth'
									value={projectData.inferencesPerMonth}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'
									placeholder='e.g., 1000000'
								/>
							</div>

							{/* Model Selection Dropdown */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Model
								</label>
								<select
									name='model'
									value={projectData.model}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'>
									<option value=''>Select model</option>
									<option value='GPT-3'>GPT-3</option>
									<option value='GPT-4'>GPT-4</option>
									<option value='BLOOM'>BLOOM</option>
									<option value='LLaMA'>LLaMA</option>
								</select>
							</div>

							{/* Hosting Platform Selection Dropdown */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Hosting Platform
								</label>
								<select
									name='platform'
									value={projectData.platform}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'>
									<option value=''>Select Platform</option>
									<option value='AWS'>AWS</option>
									<option value='Azure'>Azure</option>
									<option value='GCP'>GCP</option>
								</select>
							</div>
						</div>

						<button
							onClick={calculateImpact}
							className='mt-8 block w-full text-center bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition'>
							Calculate Environmental Impact
						</button>

						<div className='mt-8'>
							<h4 className='text-xl font-semibold text-gray-900 mb-2'>
								Your Project’s Environmental Impact
							</h4>
							<div className='bg-white p-6 rounded-lg shadow-md'>
								<p className='text-gray-700 mb-2'>
									<strong>Energy Consumption:</strong>{" "}
									{projectData.energyConsumption.toFixed(2)} kWh
								</p>
								<p className='text-gray-700 mb-2'>
									<strong>Carbon Footprint:</strong>{" "}
									{projectData.carbonFootprint.toFixed(2)} tonnes of CO2e
								</p>
								<p className='text-gray-700 mb-2'>
									<strong>Hosting Cost:</strong> $
									{projectData.hostingCost.toFixed(2)} per month
								</p>
							</div>

							<div className='mt-6'>
								<h4 className='text-xl font-semibold text-gray-900 mb-2'>
									Sustainability Rating
								</h4>
								<div className='flex items-center space-x-2'>
									{[...Array(5)].map((star, i) => (
										<svg
											key={i}
											className={`h-6 w-6 ${
												i < rating ? "text-yellow-400" : "text-gray-300"
											}`}
											fill='currentColor'
											viewBox='0 0 24 24'>
											<path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
										</svg>
									))}
								</div>
								<p className='text-gray-600 mt-2'>
									Your AI solution has a sustainability rating of {rating} out
									of 5 stars.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Design Recommendations to Minimize Impact */}
			<section className='py-16 bg-gray-100'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						Actionable Design Recommendations
					</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{recommendations.map((recommendation, index) => (
							<div key={index} className='bg-white p-8 rounded-lg shadow-lg'>
								<p className='text-gray-700'>{recommendation}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto text-center'>
					<h2 className='text-4xl font-bold mb-6 text-gray-900'>
						Integrate Sustainability Into Your AI Design
					</h2>
					<p className='text-xl text-gray-700 mb-8'>
						Start making proactive design choices that minimize the
						environmental impact of your AI solutions.
					</p>
					<button className='inline-block bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition'>
						Explore More Tools for Sustainable AI
					</button>
				</div>
			</section>
		</div>
	);
}

export default AIForDevs;
