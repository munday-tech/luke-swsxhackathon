// TextAreaWithAnalysis.jsx
import React, { useState, useRef, useEffect } from "react";

const TextAreaWithAnalysis = ({
	draft,
	setDraft,
	onSubmit,
	onAnalyze,
	error,
}) => {
	const [errors, setErrors] = useState([]);
	const contentRef = useRef(null);

	// Real-Time Analysis Handler
	const handleInput = async (e) => {
		const text = e.target.innerText;
		setDraft(text);
		const lastSegment = getLastSegment(text);
		if (lastSegment) {
			const result = await analyzeText(lastSegment);
			if (result.hasError) {
				const newError = {
					id: uuidv4(),
					text: lastSegment,
					suggestion: result.suggestion,
				};
				setErrors((prev) => [...prev, newError]);
			}
		}
	};

	// Extract the last sentence or line for analysis
	const getLastSegment = (text) => {
		const segments = text.split(/[\.\n]/);
		return segments[segments.length - 1].trim();
	};

	// Simulated Asynchronous Text Analysis
	const analyzeText = async (text) => {
		// Replace this with actual API call if available
		return new Promise((resolve) => {
			setTimeout(() => {
				// Example condition for demonstration
				if (text.toLowerCase().includes("salary")) {
					resolve({
						hasError: true,
						suggestion:
							"Please verify the salary range according to company policy.",
					});
				} else {
					resolve({ hasError: false });
				}
			}, 500);
		});
	};

	// Replace problematic segment with suggestion
	const replaceSegment = (error) => {
		const updatedContent = draft.replace(error.text, error.suggestion);
		setDraft(updatedContent);
		setErrors((prev) => prev.filter((e) => e.id !== error.id));
	};

	// Remove problematic segment
	const removeSegment = (error) => {
		const updatedContent = draft.replace(error.text, "");
		setDraft(updatedContent);
		setErrors((prev) => prev.filter((e) => e.id !== error.id));
	};

	// Update the contentEditable div when draft changes
	useEffect(() => {
		if (contentRef.current && contentRef.current.innerText !== draft) {
			contentRef.current.innerText = draft;
		}
	}, [draft]);

	// Handle Form Submission
	const handleSubmit = () => {
		if (onSubmit) {
			onSubmit();
		}
	};

	// Handle Manual Analysis Trigger
	const handleAnalyze = () => {
		if (onAnalyze) {
			onAnalyze();
		}
	};

	return (
		<div className='relative w-full max-w-xl mx-auto mt-10'>
			<div
				ref={contentRef}
				contentEditable
				onInput={handleInput}
				className='w-full min-h-[200px] p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
				placeholder='Start typing your document draft here...'></div>
			{errors.map((error) => (
				<ErrorTooltip
					key={error.id}
					error={error}
					onAccept={() => replaceSegment(error)}
					onDecline={() => removeSegment(error)}
					parentContent={draft}
				/>
			))}
			{error && <p className='error-message'>{error}</p>}
			<div className='flex justify-end mt-4 space-x-4'>
				<button
					onClick={handleSubmit}
					className='bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold hover:bg-indigo-700 transition-colors'>
					Submit for Compliance Check
				</button>
				<button
					onClick={handleAnalyze}
					className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold hover:bg-green-700 transition-colors'>
					Analyze Draft
				</button>
			</div>
		</div>
	);
};

// Error Tooltip Component
const ErrorTooltip = ({ error, onAccept, onDecline, parentContent }) => {
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const tooltipRef = useRef(null);

	useEffect(() => {
		// Find the position of the error text in the parent content
		const index = parentContent.indexOf(error.text);
		if (index === -1) return;

		const textarea = document.querySelector("[contenteditable]");
		const range = document.createRange();
		const node = textarea.firstChild;
		if (!node) return;
		range.setStart(node, index);
		range.setEnd(node, index + error.text.length);
		const rect = range.getBoundingClientRect();
		const textareaRect = textarea.getBoundingClientRect();
		setPosition({
			top: rect.bottom - textareaRect.top + 5, // Added offset for better positioning
			left: rect.left - textareaRect.left,
		});
	}, [error, parentContent]);

	return (
		<div
			className='absolute'
			style={{ top: position.top, left: position.left }}>
			<span className='relative group'>
				<span className='underline decoration-red-500 decoration-2 cursor-pointer'>
					{error.text}
				</span>
				<div className='absolute bottom-full left-0 mb-2 w-60 p-2 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
					<span className='block mb-2 text-sm text-gray-700'>
						{error.suggestion}
					</span>
					<div className='flex justify-end space-x-2'>
						<button
							onClick={onAccept}
							className='text-green-500 hover:text-green-700'
							title='Accept Suggestion'>
							✔️ Accept
						</button>
						<button
							onClick={onDecline}
							className='text-red-500 hover:text-red-700'
							title='Decline Suggestion'>
							❌ Decline
						</button>
					</div>
				</div>
			</span>
		</div>
	);
};

// Utility function to generate unique IDs
const uuidv4 = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export default TextAreaWithAnalysis;
