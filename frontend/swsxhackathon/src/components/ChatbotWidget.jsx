import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown"; // To render markdown

function ChatbotWidget() {
	const [messages, setMessages] = useState([]); // Array of { id, sender, content }
	const [currentInput, setCurrentInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default
	const messagesEndRef = useRef(null);

	// Scroll to the latest message when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Handle sending a message
	const handleSendMessage = async () => {
		const trimmedInput = currentInput.trim();
		if (!trimmedInput) return;

		const userMessage = {
			id: uuidv4(),
			sender: "user",
			content: trimmedInput,
		};

		setMessages((prev) => [...prev, userMessage]);
		setCurrentInput("");
		setIsLoading(true);

		// Prepare history by extracting content from previous messages
		const history = messages
			.filter((msg) => msg.sender === "user" || msg.sender === "bot")
			.map((msg) => ({ sender: msg.sender, content: msg.content }));

		try {
			// Encode the message and history as query parameters
			const queryParams = new URLSearchParams({
				message: trimmedInput,
				history: JSON.stringify(history), // Assuming the API expects a stringified array
			});

			// Append the query params to the URL
			const response = await fetch(
				`https://74wbta.buildship.run/chatbot/get?${queryParams.toString()}`, // Add the query string to the URL
				{
					method: "POST",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to connect to the chatbot API.");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let done = false;
			let botContent = "";

			// Add a placeholder for the bot's response
			const botMessageId = uuidv4();
			setMessages((prev) => [
				...prev,
				{ id: botMessageId, sender: "bot", content: "" },
			]);

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				if (value) {
					const chunk = decoder.decode(value);
					botContent += chunk;

					// Update the bot's message with the new chunk
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === botMessageId
								? { ...msg, content: msg.content + chunk }
								: msg
						)
					);
				}
			}
		} catch (error) {
			console.error("Error communicating with the chatbot:", error);
			setMessages((prev) => [
				...prev,
				{
					id: uuidv4(),
					sender: "bot",
					content:
						"Sorry, I encountered an error while processing your request.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle pressing Enter to send the message
	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Toggle collapse state
	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	// Handle clearing the chat
	const clearChat = () => {
		setMessages([]);
	};

	return (
		<div className='fixed bottom-4 right-4 w-128 bg-white shadow-lg rounded-lg flex flex-col'>
			{/* Header */}
			<div className='bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center'>
				<h2 className='text-lg font-semibold'>Compliance Chatbot</h2>
				<div className='flex items-center'>
					<button
						onClick={clearChat}
						className='text-white focus:outline-none mr-4 bg-red-500 px-3 py-1 rounded'>
						Clear Chat
					</button>
					<button
						onClick={toggleCollapse}
						className='text-white focus:outline-none'>
						{isCollapsed ? (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 15l7-7 7 7'
								/>
							</svg>
						) : (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Collapse or show messages */}
			{!isCollapsed && (
				<>
					{/* Messages */}
					<div
						className='flex-1 p-4 overflow-y-auto bg-gray-50'
						style={{ maxHeight: "400px" }}>
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`mb-4 flex ${
									msg.sender === "user" ? "justify-end" : "justify-start"
								}`}>
								<div
									className={`max-w-xs px-4 py-2 rounded-lg ${
										msg.sender === "user"
											? "bg-blue-500 text-white"
											: "bg-gray-300 text-gray-800"
									}`}>
									{/* Render message content as Markdown */}
									<ReactMarkdown>{msg.content}</ReactMarkdown>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Field */}
					<div className='p-4 bg-gray-100 flex items-center'>
						<textarea
							className='flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
							rows='1'
							placeholder='Type your message...'
							value={currentInput}
							onChange={(e) => setCurrentInput(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={isLoading}></textarea>
						<button
							onClick={handleSendMessage}
							className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center ${
								isLoading ? "opacity-50 cursor-not-allowed" : ""
							}`}
							disabled={isLoading}>
							{isLoading ? (
								<svg
									className='animate-spin h-5 w-5 mr-2 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8v8H4z'></path>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 mr-2'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M14 5l7 7m0 0l-7 7m7-7H3'
									/>
								</svg>
							)}
							Send
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default ChatbotWidget;
