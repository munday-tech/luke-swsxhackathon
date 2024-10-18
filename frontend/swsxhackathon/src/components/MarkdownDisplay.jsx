import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw"; // Ensure this is imported
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import PropTypes from "prop-types";
import "./MarkdownDisplay.css";

function MarkdownDisplay({ markdownContent, highlightSentences }) {
	const [isCollapsed, setIsCollapsed] = useState(true);

	// Toggle function to expand/collapse the markdown content
	const toggleCollapse = () => {
		setIsCollapsed((prev) => !prev);
	};

	// Memoize the processed markdown to optimize performance
	const processedMarkdown = useMemo(() => {
		if (!highlightSentences || highlightSentences.length === 0) {
			return markdownContent;
		}

		let updatedMarkdown = markdownContent;

		// Iterate over the sentences to highlight them
		highlightSentences.forEach((sentence) => {
			// Escape special regex characters in the sentence
			const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

			// Create a regex to match the exact sentence
			const regex = new RegExp(`(${escapedSentence})`, "gi");

			// Replace the sentence with a span-wrapped version
			updatedMarkdown = updatedMarkdown.replace(
				regex,
				`<span class="highlight">$1</span>`
			);
		});

		return updatedMarkdown;
	}, [markdownContent, highlightSentences]);

	// Custom renderer for code blocks
	const renderers = {
		code({ node, inline, className, children, ...props }) {
			const match = /language-(\w+)/.exec(className || "");
			return !inline && match ? (
				<SyntaxHighlighter
					style={github}
					language={match[1]}
					PreTag='div'
					{...props}>
					{String(children).replace(/\n$/, "")}
				</SyntaxHighlighter>
			) : (
				<code className={className} {...props}>
					{children}
				</code>
			);
		},
	};

	return (
		<div className='w-full max-w-4xl mx-auto my-4'>
			{/* Toggle Button */}
			<button
				onClick={toggleCollapse}
				aria-expanded={!isCollapsed}
				aria-controls='markdown-content'
				className='w-full flex justify-between items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none transition-colors duration-200'>
				<span>{isCollapsed ? "Show Markdown" : "Hide Markdown"}</span>
				<svg
					className={`h-5 w-5 transform transition-transform duration-200 ${
						isCollapsed ? "rotate-0" : "rotate-180"
					}`}
					xmlns='http://www.w3.org/2000/svg'
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
			</button>

			{/* Collapsible Markdown Content */}
			{!isCollapsed && (
				<div
					className='mt-2 p-4 bg-white border border-gray-200 rounded shadow overflow-auto max-h-96 markdown-content'
					id='markdown-content'>
					<ReactMarkdown
						remarkPlugins={[]}
						rehypePlugins={[rehypeHighlight, rehypeRaw]} // Make sure rehypeRaw is added here
						components={renderers}>
						{processedMarkdown}
					</ReactMarkdown>
				</div>
			)}
		</div>
	);
}

// Define PropTypes for better type checking
MarkdownDisplay.propTypes = {
	markdownContent: PropTypes.string.isRequired,
	highlightSentences: PropTypes.arrayOf(PropTypes.string),
};

MarkdownDisplay.defaultProps = {
	highlightSentences: [],
};

export default MarkdownDisplay;
