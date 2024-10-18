import React, { useState } from "react";

// Placeholder functions to simulate API calls
const fetchUserData = async (email) => {
	// Simulate fetching user data based on email
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				interests: ["NLP", "Image Generation", "Machine Learning"],
				industry: "Technology",
			});
		}, 1000);
	});
};

const fetchProductRecommendation = async (userData) => {
	// Simulate fetching a product recommendation based on user data
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				productName: "AI-Powered Image Generator",
				description:
					"Create stunning images effortlessly with our state-of-the-art AI technology.",
				price: "$49.99/month",
			});
		}, 1000);
	});
};

function PersonalizedLandingPage() {
	const [email, setEmail] = useState("");
	const [userData, setUserData] = useState(null);
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(false);
	const [design, setDesign] = useState(1);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const fetchedUserData = await fetchUserData(email);
			setUserData(fetchedUserData);
			const recommendedProduct = await fetchProductRecommendation(
				fetchedUserData
			);
			setProduct(recommendedProduct);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		setLoading(false);
	};

	const renderDesign = () => {
		if (!userData || !product) return null;

		switch (design) {
			case 1:
				return (
					<div className='min-h-screen bg-white p-8'>
						<header className='text-center mb-8'>
							<h1 className='text-4xl font-bold'>Welcome, {userData.name}!</h1>
							<p className='text-gray-600'>
								Based on your interests in {userData.interests.join(", ")}
							</p>
						</header>
						<main className='max-w-2xl mx-auto'>
							<h2 className='text-3xl font-semibold mb-4'>
								{product.productName}
							</h2>
							<p className='text-gray-700 mb-6'>{product.description}</p>
							<p className='text-xl font-bold'>{product.price}</p>
							<button className='mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
								Purchase Now
							</button>
						</main>
					</div>
				);
			case 2:
				return (
					<div className='min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white'>
						<header className='text-center mb-8'>
							<h1 className='text-5xl font-bold'>Hello, {userData.name}!</h1>
							<p className='text-xl'>
								Discover tools tailored for your passion in{" "}
								{userData.interests.join(", ")}
							</p>
						</header>
						<main className='max-w-xl mx-auto bg-white text-gray-800 p-6 rounded-lg shadow-lg'>
							<h2 className='text-3xl font-semibold mb-4'>
								{product.productName}
							</h2>
							<p className='mb-4'>{product.description}</p>
							<p className='text-lg font-bold'>{product.price}</p>
							<button className='mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700'>
								Buy Now
							</button>
						</main>
					</div>
				);
			case 3:
				return (
					<div className='min-h-screen bg-gray-100 p-8'>
						<nav className='mb-8'>
							<h1 className='text-4xl font-bold text-center'>
								{product.productName}
							</h1>
						</nav>
						<main className='max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md'>
							<section className='mb-6'>
								<h2 className='text-2xl font-semibold'>About You</h2>
								<p className='text-gray-700'>
									Name: {userData.name}
									<br />
									Industry: {userData.industry}
									<br />
									Interests: {userData.interests.join(", ")}
								</p>
							</section>
							<section className='mb-6'>
								<h2 className='text-2xl font-semibold'>
									Your Recommended Product
								</h2>
								<p className='text-gray-700'>{product.description}</p>
								<p className='text-xl font-bold'>{product.price}</p>
							</section>
							<button className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>
								Get Started
							</button>
						</main>
						<footer className='text-center mt-8 text-gray-600'>
							© 2024 AI Productivity Tools
						</footer>
					</div>
				);
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<p className='text-xl'>Loading...</p>
			</div>
		);
	}

	if (userData && product) {
		return (
			<div>
				{/* Design Selection */}
				<div className='flex justify-center mt-4'>
					<button
						className={`mx-2 px-4 py-2 rounded ${
							design === 1
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
						onClick={() => setDesign(1)}>
						Design 1
					</button>
					<button
						className={`mx-2 px-4 py-2 rounded ${
							design === 2
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
						onClick={() => setDesign(2)}>
						Design 2
					</button>
					<button
						className={`mx-2 px-4 py-2 rounded ${
							design === 3
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
						onClick={() => setDesign(3)}>
						Design 3
					</button>
				</div>
				{/* Render Selected Design */}
				{renderDesign()}
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<form
				onSubmit={handleSubmit}
				className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
				<h2 className='text-2xl font-bold mb-6 text-center'>
					Get Your Personalized Product
				</h2>
				<div className='mb-4'>
					<label
						htmlFor='email'
						className='block text-gray-700 font-semibold mb-2'>
						Email Address
					</label>
					<input
						type='email'
						id='email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg'
						placeholder='you@example.com'
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition'>
					Generate Landing Page
				</button>
			</form>
		</div>
	);
}

export default PersonalizedLandingPage;
