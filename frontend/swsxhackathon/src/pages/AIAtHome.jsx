import React, { useState, useEffect } from "react";

function AIAtHome() {
	const [aiUsageData, setAiUsageData] = useState({
		tool: "",
		usageTime: 0,
		energyConsumption: 0,
		carbonFootprint: 0,
	});

	const [suggestions, setSuggestions] = useState([]);

	// Simulate fetching real-time climate data (you would replace this with real data)
	useEffect(() => {
		if (aiUsageData.usageTime > 0) {
			// Update energy consumption and carbon footprint based on usage time
			const energy = aiUsageData.usageTime * 0.2; // Example calculation (kWh)
			const carbon = energy * 0.5; // Example CO2 emission (kg CO2e)
			setAiUsageData({
				...aiUsageData,
				energyConsumption: energy,
				carbonFootprint: carbon,
			});

			// Update suggestions to mitigate impact
			const updatedSuggestions = [
				"Use energy-efficient AI models.",
				"Run AI processes during off-peak hours to reduce energy demand.",
				"Consider offsetting your carbon footprint through environmental programs.",
			];
			setSuggestions(updatedSuggestions);
		}
	}, [aiUsageData.usageTime]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAiUsageData({ ...aiUsageData, [name]: value });
	};

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-green-500 to-blue-600 text-white py-20'>
				<div className='container mx-auto text-center'>
					<h1 className='text-5xl font-bold mb-6'>
						AI at Home: Climate Impact Awareness
					</h1>
					<p className='text-xl max-w-2xl mx-auto'>
						Learn about the environmental impact of your AI tool usage and make
						informed decisions to reduce your carbon footprint.
					</p>
				</div>
			</section>

			{/* Climate Impact Information Section */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						Real-Time Climate Impact of Your AI Usage
					</h2>

					<div className='max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg'>
						<h3 className='text-2xl font-semibold text-gray-900 mb-4'>
							Track Your AI Usage
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
							{/* AI Tool Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									AI Tool
								</label>
								<input
									type='text'
									name='tool'
									value={aiUsageData.tool}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'
									placeholder='e.g., AI Image Generator'
								/>
							</div>

							{/* Usage Time Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Usage Time (hours)
								</label>
								<input
									type='number'
									name='usageTime'
									value={aiUsageData.usageTime}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'
									placeholder='e.g., 2 hours'
								/>
							</div>
						</div>

						<div className='mt-8'>
							<h4 className='text-xl font-semibold text-gray-900 mb-2'>
								Your Climate Impact
							</h4>
							<div className='bg-white p-6 rounded-lg shadow-md'>
								<p className='text-gray-700 mb-2'>
									<strong>Energy Consumption:</strong>{" "}
									{aiUsageData.energyConsumption} kWh
								</p>
								<p className='text-gray-700 mb-2'>
									<strong>Carbon Footprint:</strong>{" "}
									{aiUsageData.carbonFootprint} kg CO2e
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Suggestions to Mitigate Climate Impact */}
			<section className='py-16 bg-gray-100'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						Suggestions for Reducing Your Environmental Impact
					</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{suggestions.map((suggestion, index) => (
							<div key={index} className='bg-white p-8 rounded-lg shadow-lg'>
								<p className='text-gray-700'>{suggestion}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto text-center'>
					<h2 className='text-4xl font-bold mb-6 text-gray-900'>
						Make Responsible AI Choices
					</h2>
					<p className='text-xl text-gray-700 mb-8'>
						By making informed decisions about your AI usage, you can help
						reduce your environmental impact. Start by tracking your usage
						today.
					</p>
					<button className='inline-block bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition'>
						Learn More About AI and Sustainability
					</button>
				</div>
			</section>
		</div>
	);
}

export default AIAtHome;
