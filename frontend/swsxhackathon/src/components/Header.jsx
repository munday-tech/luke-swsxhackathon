import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
	return (
		<header className='bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg rounded-b-lg'>
			<div className='w-full px-6 py-6 lg:px-12 lg:py-8 flex justify-between items-center'>
				<Link to='/' className='flex items-center space-x-3'>
					<img
						src='/public/SwsxHackathon.png'
						alt='AI Directory Logo'
						className='h-12 w-12' // This ensures the logo is 60x60 (12 * 5px per unit = 60px)
					/>
					<span className='text-3xl font-extrabold text-white'>
						AI Directory
					</span>
				</Link>
				<nav className='space-x-6'>
					<NavLink
						to='/'
						className={({ isActive }) =>
							isActive
								? "text-white font-semibold rounded-full px-4 py-2 bg-blue-600 shadow-lg"
								: "text-gray-200 hover:text-white hover:bg-blue-600 rounded-full px-4 py-2"
						}>
						Home
					</NavLink>
					<NavLink
						to='/directory'
						className={({ isActive }) =>
							isActive
								? "text-white font-semibold rounded-full px-4 py-2 bg-blue-600 shadow-lg"
								: "text-gray-200 hover:text-white hover:bg-blue-600 rounded-full px-4 py-2"
						}>
						Directory
					</NavLink>
					<NavLink
						to='/compliance'
						className={({ isActive }) =>
							isActive
								? "text-white font-semibold rounded-full px-4 py-2 bg-blue-600 shadow-lg"
								: "text-gray-200 hover:text-white hover:bg-blue-600 rounded-full px-4 py-2"
						}>
						Compliance
					</NavLink>
					<NavLink
						to='/ai-at-home'
						className={({ isActive }) =>
							isActive
								? "text-white font-semibold rounded-full px-4 py-2 bg-blue-600 shadow-lg"
								: "text-gray-200 hover:text-white hover:bg-blue-600 rounded-full px-4 py-2"
						}>
						AI at Home
					</NavLink>
					<NavLink
						to='/ai-for-devs'
						className={({ isActive }) =>
							isActive
								? "text-white font-semibold rounded-full px-4 py-2 bg-blue-600 shadow-lg"
								: "text-gray-200 hover:text-white hover:bg-blue-600 rounded-full px-4 py-2"
						}>
						AI for Devs
					</NavLink>
				</nav>
			</div>
		</header>
	);
}

export default Header;
