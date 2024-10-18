import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./tooltip.css"; // Ensure this file is included in your project

function DraftSection({
	handleDraftSubmit,
	handleDraftAnalyze,
	draft,
	setDraft,
}) {
	const [issues, setIssues] = useState([]);
	const [hoveredIssueId, setHoveredIssueId] = useState(null);
	const textareaRef = useRef(null);
	const issueRefs = useRef({}); // Store references to the text spans with issues

	// Validate sentence asynchronously
	const validateSentence = async (sentence, startIndex) => {
		const issueId = uuidv4();
		setIssues((prevIssues) => [
			...prevIssues,
			{
				id: issueId,
				text: sentence,
				start: startIndex,
				end: startIndex + sentence.length,
				suggestion: "Possible suggestion for this sentence.",
				status: "pending",
			},
		]);
		// Simulate validation
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIssues((prevIssues) =>
			prevIssues.map((issue) =>
				issue.id === issueId ? { ...issue, status: "error" } : issue
			)
		);
	};

	// Handle draft change and detect sentence boundaries
	const handleDraftChange = (e) => {
		const newDraft = e.target.value;
		setDraft(newDraft);
		const lastTwoChars = newDraft.slice(-2);
		const lastChar = newDraft.slice(-1);
		if (/[.!?]\s$/.test(lastTwoChars) || /[.!?]$/.test(lastChar)) {
			const sentences = newDraft.match(/[^.!?]+[.!?]+[\])'"`’”]*\s*/g);
			const lastSentence = sentences
				? sentences[sentences.length - 1].trim()
				: null;
			if (lastSentence) {
				const startIndex = newDraft.lastIndexOf(lastSentence);
				validateSentence(lastSentence, startIndex);
			}
		}
	};

	// Highlight problematic text with squiggly lines
	const getHighlightedText = () => {
		if (issues.length === 0) return <span>{draft}</span>;

		const elements = [];
		let lastIndex = 0;

		issues.forEach((issue) => {
			if (issue.start > lastIndex) {
				elements.push(draft.substring(lastIndex, issue.start));
			}
			elements.push(
				<span
					key={issue.id}
					className='squiggly'
					onMouseEnter={() => setHoveredIssueId(issue.id)}
					onMouseLeave={() => setHoveredIssueId(null)}
					ref={(el) => (issueRefs.current[issue.id] = el)}>
					{draft.substring(issue.start, issue.end)}
				</span>
			);
			lastIndex = issue.end;
		});

		if (lastIndex < draft.length) {
			elements.push(draft.substring(lastIndex));
		}

		return elements;
	};

	return (
		<div className='relative max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg'>
			<h3 className='text-2xl font-semibold text-gray-900 mb-4'>
				Draft Your Document
			</h3>
			<div className='relative'>
				{/* Mirrored Div */}
				<div
					className='absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden'
					style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
					<div className='text-gray-700 p-4 rounded-lg'>
						{getHighlightedText()}
					</div>
				</div>
				{/* Textarea */}
				<textarea
					className='w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent relative bg-transparent'
					rows='10'
					placeholder='Start drafting your email, policy, or message...'
					value={draft}
					onChange={handleDraftChange}
					ref={textareaRef}
					style={{
						position: "relative",
						background: "transparent",
						zIndex: 10,
					}}
				/>
			</div>
			<div className='flex justify-end mt-4 space-x-4'>
				<button
					onClick={handleDraftSubmit}
					className='bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold hover:bg-indigo-700 transition-colors'>
					Submit
				</button>
				<button
					onClick={handleDraftAnalyze}
					className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold hover:bg-green-700 transition-colors'>
					Analyze
				</button>
			</div>

			{/* Tooltip for Issues */}
			{hoveredIssueId && (
				<Tooltip
					issue={issues.find((issue) => issue.id === hoveredIssueId)}
					targetRef={issueRefs.current[hoveredIssueId]}
				/>
			)}
		</div>
	);
}

function Tooltip({ issue, targetRef }) {
	const tooltipRef = useRef(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (targetRef && targetRef.getBoundingClientRect) {
			const rect = targetRef.getBoundingClientRect();
			setPosition({
				top: rect.top + window.scrollY - 10,
				left: rect.left + window.scrollX + rect.width / 2,
			});
		}
	}, [targetRef]);

	return (
		<div
			ref={tooltipRef}
			className='tooltip'
			style={{ top: position.top, left: position.left }}>
			<p className='text-gray-800 mb-2'>Issue: {issue.suggestion}</p>
		</div>
	);
}

export default DraftSection;
