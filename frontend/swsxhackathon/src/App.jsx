import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

import Home from "./pages/Home";
import Directory from "./pages/Directory";
import Compliance from "./pages/Compliance";
import AIAtHome from "./pages/AIAtHome";
import AIForDevs from "./pages/AIForDevs";
import Embed from "./pages/Embed";
import PersonalizedLandingPage from "./components/PersonalizedLandingPage";
import ComplianceCheckRecord from "./pages/ComplianceCheckRecord";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/directory' element={<Directory />} />
				<Route path='/compliance' element={<Compliance />} />
				<Route path='/ai-at-home' element={<AIAtHome />} />
				<Route path='/ai-for-devs' element={<AIForDevs />} />
				<Route path='/embed' element={<Embed />} />
				<Route
					path='/personalized-landing'
					element={<PersonalizedLandingPage />}
				/>
				<Route
					path='/compliance/checks.record/:id'
					element={<ComplianceCheckRecord />}
				/>
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
