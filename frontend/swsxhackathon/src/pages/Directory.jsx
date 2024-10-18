import React, { useState } from "react";

function Directory() {
	const [userInput, setUserInput] = useState({
		riskLevel: "",
		governance: "",
		problemContext: "",
	});

	const [recommendations, setRecommendations] = useState([]);
	const [isModalOpen, setModalOpen] = useState(false);

	// Mock data for tools (you would replace this with real data)
	const allTools = [
		{
			name: "GPT-4",
			pros: "Highly capable in advanced reasoning and creativity, large context window",
			cons: "High cost, not open-source, occasional bias issues",
			governance: "API-based access, sensitive industry restrictions",
			risk: "Low",
		},
		{
			name: "GPT-4o",
			pros: "Faster and refined version of GPT-4, better long-context understanding",
			cons: "Expensive, limited availability, lacks full transparency on architecture",
			governance: "API-based access, same restrictions as GPT-4",
			risk: "Low",
		},
		{
			name: "Claude",
			pros: "Strong focus on safety, interpretability, ethical considerations",
			cons: "Less powerful in complex tasks than GPT-4",
			governance: "Safe and ethical use enforced, API access",
			risk: "Moderate",
		},
		{
			name: "Llama 2",
			pros: "Open-source, great for multilingual tasks, resource-efficient",
			cons: "Weaker in highly technical tasks, lacks top-tier performance in advanced reasoning",
			governance:
				"Open-source for research and commercial use, some restrictions for large organizations",
			risk: "Moderate",
		},
		{
			name: "Llama 3",
			pros: "Efficient, excels in multilingual and dialogue generation",
			cons: "Weaker in complex creative tasks compared to GPT-4",
			governance: "Open-source, similar to Llama 2",
			risk: "Moderate",
		},
		{
			name: "Groq",
			pros: "Optimized for real-time, high-scale hardware integration",
			cons: "Newer market player, fewer adoption cases",
			governance: "Hardware-software focused, enterprise-level",
			risk: "High",
		},
		{
			name: "Tool A",
			pros: "Highly scalable, Good governance support",
			cons: "Higher cost",
			governance: "GDPR compliant",
			risk: "Low",
		},
		{
			name: "Tool B",
			pros: "Easy to implement, Low cost",
			cons: "Limited scalability",
			governance: "Needs additional compliance",
			risk: "Moderate",
		},
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserInput({ ...userInput, [name]: value });
	};

	const handleRecommendation = () => {
		const filteredTools = allTools.filter((tool) => {
			return (
				(userInput.riskLevel ? tool.risk === userInput.riskLevel : true) &&
				(userInput.governance
					? tool.governance.includes(userInput.governance)
					: true) &&
				(userInput.problemContext
					? tool.pros.includes(userInput.problemContext) ||
					  tool.cons.includes(userInput.problemContext)
					: true)
			);
		});
		setRecommendations(filteredTools);
	};

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20'>
				<div className='container mx-auto text-center'>
					<h1 className='text-5xl font-bold mb-6'>
						Generative AI Tool Directory
					</h1>
					<p className='text-xl max-w-2xl mx-auto'>
						Find the best generative AI tools and models tailored to your
						specific needs. Input your requirements, and receive customized
						recommendations with detailed insights.
					</p>
				</div>
			</section>

			{/* User Input Section with Chatbot Button */}
			<section className='py-16 bg-white relative'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						Customize Your AI Tool Recommendations
					</h2>

					<div className='relative max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg'>
						{/* Find Your Match with AI Button (Top Right of Search Section) */}
						<div className='absolute top-0 right-0 mt-2 mr-2'>
							<button
								className='bg-purple-600 text-white py-3 px-6 rounded-full shadow-lg animate-bounce hover:bg-purple-700 transition'
								onClick={() => setModalOpen(true)}>
								Find Your Match with AI
							</button>
						</div>

						<h3 className='text-2xl font-semibold text-gray-900 mb-4'>
							Enter Your Requirements
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
							{/* Risk Level Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Risk Level
								</label>
								<select
									name='riskLevel'
									value={userInput.riskLevel}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'>
									<option value=''>Select risk level</option>
									<option value='Low'>Low</option>
									<option value='Moderate'>Moderate</option>
									<option value='High'>High</option>
								</select>
							</div>

							{/* Governance Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Governance Needs
								</label>
								<select
									name='governance'
									value={userInput.governance}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'>
									<option value=''>Select governance needs</option>
									<option value='GDPR'>GDPR</option>
									<option value='HIPAA'>HIPAA</option>
									<option value='None'>None</option>
								</select>
							</div>

							{/* Problem Context Input */}
							<div>
								<label className='block text-gray-700 font-semibold mb-2'>
									Problem Context
								</label>
								<input
									type='text'
									name='problemContext'
									value={userInput.problemContext}
									onChange={handleInputChange}
									className='block w-full p-4 border border-gray-300 rounded-lg'
									placeholder='e.g., NLP, Image Generation'
								/>
							</div>
						</div>
						<button
							onClick={handleRecommendation}
							className='mt-8 block w-full text-center bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition'>
							Get Tailored Recommendations
						</button>
					</div>
				</div>
			</section>

			{/* Full Tool Directory Table */}
			<section className='py-16 bg-gray-50'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-center text-gray-900 mb-12'>
						All AI Tools
					</h2>

					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white rounded-lg shadow-lg'>
							<thead>
								<tr className='bg-gray-200 text-gray-700'>
									<th className='py-4 px-6 text-left'>Tool Name</th>
									<th className='py-4 px-6 text-left'>Pros</th>
									<th className='py-4 px-6 text-left'>Cons</th>
									<th className='py-4 px-6 text-left'>Governance</th>
									<th className='py-4 px-6 text-left'>Risk Level</th>
								</tr>
							</thead>
							<tbody>
								{allTools.map((tool, index) => (
									<tr key={index} className='border-t'>
										<td className='py-4 px-6 text-gray-700 font-bold'>
											{tool.name}
										</td>
										<td className='py-4 px-6 text-gray-700'>{tool.pros}</td>
										<td className='py-4 px-6 text-gray-700'>{tool.cons}</td>
										<td className='py-4 px-6 text-gray-700'>
											{tool.governance}
										</td>
										<td className='py-4 px-6 text-gray-700'>{tool.risk}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* Modal for AI Chatbot */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl'>
						<h3 className='text-2xl font-bold text-gray-900 mb-4'>
							AI Chatbot - Find Your Perfect AI Tool
						</h3>
						<p className='text-gray-700 mb-6'>
							Ask the chatbot for personalized recommendations based on your
							inputs. You can ask about tools for NLP, image generation,
							compliance, and more!
						</p>
						{/* Chatbot integration would go here */}
						<div className='bg-gray-100 p-4 rounded-lg mb-4'>
							<p className='text-gray-600 italic'>
								"What AI tool is best for image generation?"
							</p>
							{/* Placeholder for chatbot response */}
							<p className='text-blue-600 mt-2'>
								Chatbot response will appear here...
							</p>
						</div>
						<button
							className='inline-block bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition'
							onClick={() => setModalOpen(false)}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Directory;
