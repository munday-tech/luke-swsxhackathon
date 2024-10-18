import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<div>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20'>
				<div className='container mx-auto text-center'>
					<h1 className='text-5xl font-bold mb-6'>Centre for AI Innovation</h1>
					<p className='text-xl max-w-2xl mx-auto'>
						Welcome to the future of AI. Discover cutting-edge tools, insights,
						and resources to empower your AI development and innovation journey.
						Explore our hackathon submission and get a glimpse of what we have
						to offer.
					</p>
					<Link
						to='/directory'
						className='mt-8 inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition'>
						Explore the AI Directory
					</Link>
				</div>
			</section>

			{/* Hackathon Submission Section */}
			<section className='py-16 bg-gray-100'>
				<div className='container mx-auto'>
					<h2 className='text-4xl font-bold text-gray-900 text-center mb-12'>
						Hackathon Submission Overview
					</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<div className='bg-white p-8 rounded-lg shadow-lg'>
							<h3 className='text-2xl font-semibold mb-4'>AI Directory</h3>
							<p className='text-gray-700'>
								Our AI Directory is a curated collection of the best AI tools
								and resources. It's designed to help developers and researchers
								find exactly what they need for their projects.
							</p>
							<Link
								to='/directory'
								className='text-blue-500 mt-4 inline-block hover:underline'>
								Go to Directory &rarr;
							</Link>
						</div>

						<div className='bg-white p-8 rounded-lg shadow-lg'>
							<h3 className='text-2xl font-semibold mb-4'>Compliance Hub</h3>
							<p className='text-gray-700'>
								Learn about the essential regulations and ethical considerations
								in AI development. Our Compliance Hub provides insights into
								current AI laws and standards.
							</p>
							<Link
								to='/compliance'
								className='text-blue-500 mt-4 inline-block hover:underline'>
								Explore Compliance &rarr;
							</Link>
						</div>

						<div className='bg-white p-8 rounded-lg shadow-lg'>
							<h3 className='text-2xl font-semibold mb-4'>AI at Home</h3>
							<p className='text-gray-700'>
								AI is not just for developers; it's for everyone! Explore ways
								AI is transforming our daily lives, from smart homes to personal
								assistants, and learn how you can benefit from it.
							</p>
							<Link
								to='/ai-at-home'
								className='text-blue-500 mt-4 inline-block hover:underline'>
								Learn More &rarr;
							</Link>
						</div>

						<div className='bg-white p-8 rounded-lg shadow-lg'>
							<h3 className='text-2xl font-semibold mb-4'>AI for Developers</h3>
							<p className='text-gray-700'>
								Whether you're a seasoned developer or just getting started with
								AI, our AI for Developers section offers tutorials, tools, and
								resources to help you succeed.
							</p>
							<Link
								to='/ai-for-devs'
								className='text-blue-500 mt-4 inline-block hover:underline'>
								Get Started &rarr;
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className='py-20 bg-white'>
				<div className='container mx-auto text-center'>
					<h2 className='text-4xl font-bold text-gray-900 mb-4'>
						Ready to Dive into AI?
					</h2>
					<p className='text-xl max-w-2xl mx-auto text-gray-700 mb-8'>
						Join us in exploring the exciting world of AI innovation. Check out
						our directory of AI tools or learn more about AI compliance,
						development, and how it impacts daily life.
					</p>
					<Link
						to='/directory'
						className='inline-block bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition'>
						Get Started Now
					</Link>
				</div>
			</section>
		</div>
	);
}

export default Home;
