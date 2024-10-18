import React from "react";
import { Link } from "react-router-dom";

function Footer() {
	return (
		<footer className='bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg rounded-t-lg'>
			<div className='w-full px-6 py-6 lg:px-12 flex justify-between items-center'>
				<p className='text-white'>
					&copy; {new Date().getFullYear()} AI Directory. All rights reserved.
				</p>
				<div className='space-x-6'>
					<Link to='/terms' className='text-white hover:underline'>
						Terms
					</Link>
					<Link to='/privacy' className='text-white hover:underline'>
						Privacy
					</Link>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
