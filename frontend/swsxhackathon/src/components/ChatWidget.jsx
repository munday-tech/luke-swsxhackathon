import React, { useState } from "react";
import { sendMessage } from "../api/api";

function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLargeModal, setIsLargeModal] = useState(false); // To toggle between widget and large modal
	const [messages, setMessages] = useState([
		{ sender: "ai", text: "Hello! How can I assist you?" },
	]);
	const [input, setInput] = useState("");

	const handleSend = async () => {
		if (input.trim()) {
			const userMessage = { sender: "user", text: input };
			setMessages([...messages, userMessage]);
			setInput("");

			try {
				const response = await sendMessage(input);
				setMessages([
					...messages,
					userMessage,
					{ sender: "ai", text: response.reply },
				]);
			} catch (error) {
				setMessages([...messages, { sender: "ai", text: "Error occurred." }]);
			}
		}
	};

	return (
		<div
			className={`fixed ${
				isLargeModal
					? "inset-0 bg-black bg-opacity-50 flex items-center justify-center"
					: "bottom-4 right-4"
			} z-50`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition'>
				💬
			</button>

			{isOpen && (
				<div
					className={`${
						isLargeModal ? "w-full max-w-4xl h-full max-h-96" : "w-80 h-96"
					} bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out`}>
					{/* Header with option to expand or collapse */}
					<div className='bg-gray-800 text-white p-4 flex justify-between items-center'>
						<h3 className='text-lg font-semibold'>AI Chat Assistant</h3>
						<button
							onClick={() => setIsLargeModal(!isLargeModal)}
							className='text-sm bg-gray-600 p-2 rounded-lg hover:bg-gray-700 transition'>
							{isLargeModal ? "Minimize" : "Maximize"}
						</button>
					</div>

					{/* Messages Container */}
					<div className='flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100'>
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${
									msg.sender === "user" ? "justify-end" : "justify-start"
								}`}>
								<div
									className={`${
										msg.sender === "user"
											? "bg-blue-600 text-white"
											: "bg-gray-300 text-black"
									} p-3 rounded-xl max-w-xs shadow-sm`}>
									{msg.text}
								</div>
							</div>
						))}
					</div>

					{/* Input field */}
					<div className='p-3 bg-white flex space-x-3'>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='flex-1 border border-gray-300 rounded-full p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
							placeholder='Type your message...'
						/>
						<button
							onClick={handleSend}
							className='bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition'>
							Send
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ChatWidget;
