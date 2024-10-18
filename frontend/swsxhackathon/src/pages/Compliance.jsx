// src/pages/Compliance.jsx
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import TurndownService from "turndown";
import { getDocument } from "pdfjs-dist";
import "./styles.css";
import TextAreaWithAnalysis from "../components/TextAreaWithAnalysis";
import ComplianceDashboard from "../components/ComplianceDashboard";
import ComplianceCheckTable from "../components/ComplianceCheckTable";
import ChatbotWidget from "../components/ChatbotWidget"; // <-- Imported ChatbotWidget

// Navbar Component (unchanged)
function Navbar({ onUploadAnother, onDownloadReport, onResolveAll }) {
	return (
		<nav className='bg-white shadow-md p-4 flex justify-between items-center'>
			<div className='text-2xl font-bold text-gray-800'>Compliance Checker</div>
			<div className='flex space-x-2'>
				<button
					onClick={onDownloadReport}
					className='flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
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
							d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
						/>
					</svg>
					Download Report
				</button>
				<button
					onClick={onResolveAll}
					className='flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
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
							d='M5 13l4 4L19 7'
						/>
					</svg>
					Resolve All
				</button>
				<button
					onClick={onUploadAnother}
					className='flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'>
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
							d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
						/>
					</svg>
					Upload Another
				</button>
			</div>
		</nav>
	);
}

// Loading Animation Component (unchanged)
function Loading({ message }) {
	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4'></div>
			<h2 className='text-xl text-gray-700'>{message}</h2>
		</div>
	);
}

// Upload Section Component (unchanged)
function UploadSection({
	handleDocumentChange,
	handleDocumentSubmit,
	document,
	uploading,
	error,
}) {
	const fileInputRef = useRef(null);

	return (
		<div className='flex flex-col items-center bg-white shadow-md rounded-lg p-8'>
			<h2 className='text-2xl font-semibold mb-4'>Upload Your Document</h2>
			<div
				className='w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500'
				onClick={() => fileInputRef.current.click()}>
				<input
					type='file'
					onChange={handleDocumentChange}
					ref={fileInputRef}
					accept='.html,.pdf,.txt'
					hidden
				/>
				<p className='text-gray-600'>
					Drag & Drop your file here or click to select
				</p>
				<p className='text-sm text-gray-500'>
					Supported formats: .html, .pdf, .txt
				</p>
			</div>
			{error && <p className='text-red-500 mt-2'>{error}</p>}
			<button
				onClick={handleDocumentSubmit}
				disabled={!document || uploading}
				className={`mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
					!document || uploading ? "opacity-50 cursor-not-allowed" : ""
				}`}>
				{uploading ? (
					<>
						<svg
							className='animate-spin h-5 w-5 mr-3 inline-block'
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
						Processing...
					</>
				) : (
					"Submit for Compliance Check"
				)}
			</button>
		</div>
	);
}

// Main Compliance Component
function Compliance() {
	const [documentFile, setDocumentFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [statements, setStatements] = useState([]);
	const [validations, setValidations] = useState([]);
	const [error, setError] = useState(null);
	const [phase, setPhase] = useState("choices");
	const [validationController, setValidationController] = useState(null);
	const [summary, setSummary] = useState("");
	const [insights, setInsights] = useState([]);
	const [markdownContent, setMarkdownContent] = useState("");
	const [highlightSentences, setHighlightSentences] = useState([]);

	useEffect(() => {
		const sentencesToHighlight = validations
			.filter((validation) => validation.issue)
			.map((validation) => validation.statement);
		setHighlightSentences(sentencesToHighlight);
	}, [validations]);

	// Handle Document Selection (unchanged)
	const handleDocumentChange = (e) => {
		const file = e.target.files[0];
		if (
			file &&
			["text/html", "application/pdf", "text/plain"].includes(file.type)
		) {
			setDocumentFile(file);
			setError(null);
		} else {
			setError("Please upload a valid HTML, PDF, or TXT file.");
			setDocumentFile(null);
		}
	};

	// Helper function to convert HTML to Markdown (unchanged)
	const convertHtmlToMarkdown = (html) => {
		const turndownService = new TurndownService();
		return turndownService.turndown(html);
	};

	// Helper function to extract text from PDF (unchanged)
	const extractTextFromPDF = async (file) => {
		const loadingTask = getDocument(URL.createObjectURL(file));
		const pdf = await loadingTask.promise;
		let text = "";
		for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
			const page = await pdf.getPage(pageNum);
			const content = await page.getTextContent();
			const strings = content.items.map((item) => item.str);
			text += strings.join(" ") + "\n\n";
		}
		return text;
	};

	const handleDocumentSubmit = async () => {
		if (!documentFile) return;

		setUploading(true);
		setStatements([]);
		setValidations([]);
		setSummary("");
		setInsights([]);
		setPhase("generating");

		try {
			let markdownContent = "";

			if (documentFile.type === "text/plain") {
				const text = await documentFile.text();
				markdownContent = text;
			} else if (documentFile.type === "text/html") {
				const html = await documentFile.text();
				markdownContent = convertHtmlToMarkdown(html);
			} else if (documentFile.type === "application/pdf") {
				markdownContent = await extractTextFromPDF(documentFile);
			} else {
				throw new Error("Unsupported file type.");
			}

			setMarkdownContent(markdownContent);

			// Create a new Blob with Markdown content
			const markdownBlob = new Blob([markdownContent], {
				type: "text/markdown",
			});
			const markdownFile = new File([markdownBlob], "document.md", {
				type: "text/markdown",
			});

			const formData = new FormData();
			formData.append("file", markdownFile);

			const response = await fetch(
				"https://74wbta.buildship.run/compliance/run",
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) throw new Error("Failed to generate statements");

			const data = await response.json();

			const statementData = data["Statement Generation"];
			const spellingGrammarData = data["Spelling & Grammar"];
			const securityValidationData = data["Security Validation"];

			const statementsArray = statementData.statements.map(
				(stmt) => stmt.statement
			);
			const spellingIssues = spellingGrammarData.spellingIssues || [];
			const grammarIssues = spellingGrammarData.grammarIssues || [];
			const securityValidations = securityValidationData.validations || [];

			setStatements(statementsArray);
			setUploading(false);
			setPhase("validating");

			// Only pass the statements for validation as requested
			validateStatements(statementsArray);
		} catch (err) {
			console.error("Error uploading the document:", err);
			setError("An error occurred while processing your document.");
			setUploading(false);
			setPhase("upload");
		}
	};

	// Updated Handle Draft Submission
	const handleDraftSubmit = async () => {
		if (!draft.trim()) {
			setError("Draft cannot be empty.");
			return;
		}

		setUploading(true);
		setStatements([]);
		setValidations([]);
		setSummary("");
		setInsights([]);
		setPhase("generating");

		try {
			// Convert the draft to markdown content
			const markdownContent = draft.trim(); // Assuming the draft is plain text

			// Create a new Blob with Markdown content
			const markdownBlob = new Blob([markdownContent], {
				type: "text/markdown",
			});
			const markdownFile = new File([markdownBlob], "draft.md", {
				type: "text/markdown",
			});

			// Use the same submission API as document submission
			const formData = new FormData();
			formData.append("file", markdownFile);

			// Send to the compliance submission API, not the lookup
			const response = await fetch(
				"https://74wbta.buildship.run/compliance/run", // This is the correct API endpoint
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) throw new Error("Failed to generate statements");

			const data = await response.json();

			const statementData = data["Statement Generation"];
			const spellingGrammarData = data["Spelling & Grammar"];
			const securityValidationData = data["Security Validation"];

			const statementsArray = statementData.statements.map(
				(stmt) => stmt.statement
			);
			const spellingIssues = spellingGrammarData.spellingIssues || [];
			const grammarIssues = spellingGrammarData.grammarIssues || [];
			const securityValidations = securityValidationData.validations || [];

			setStatements(statementsArray);
			setUploading(false);
			setPhase("validating");

			// Pass the statements for validation
			validateStatements(statementsArray);
		} catch (err) {
			console.error("Error processing the draft:", err);
			setError("An error occurred while processing your draft.");
			setUploading(false);
			setPhase("draft");
		}
	};
	// Handle Draft Analysis (unchanged)
	const handleDraftAnalyze = () => {
		if (!draft.trim()) {
			setError("Draft cannot be empty.");
			return;
		}
		setStatements([draft]);
		setPhase("validating");
		validateStatements([draft]);
	};

	const [draft, setDraft] = useState("");

	// Validate Statements using Promise.all (unchanged)
	const validateStatements = async (statementsArray) => {
		setPhase("validating");
		setValidations([]);
		setSummary("");
		setInsights([]);

		const controller = new AbortController();
		setValidationController(controller);

		try {
			const validationPromises = statementsArray.map((stmt) =>
				validateStatementAsync(stmt, controller.signal)
			);

			const validationsResults = (await Promise.all(validationPromises)).filter(
				Boolean
			);

			setValidations(validationsResults);
			setPhase("summary");

			fetchSummary(validationsResults);
		} catch (err) {
			if (err.name !== "AbortError") {
				console.error("Error during validation:", err);
				setError("An error occurred during validation.");
				setPhase("completed");
			}
		}
	};

	// Asynchronous Validation of a Single Statement (unchanged)
	const validateStatementAsync = async (stmt, signal) => {
		try {
			const response = await fetch(
				`https://74wbta.buildship.run/compliance/lookup?text=${encodeURIComponent(
					stmt
				)}`,
				{ method: "GET", signal }
			);
			if (!response.ok) throw new Error("Validation failed");

			const data = await response.text();
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(data, "text/xml");
			const outcome = xmlDoc.getElementsByTagName("outcome")[0];
			const issue =
				outcome.getElementsByTagName("issue")[0].textContent === "true";
			const type =
				outcome.getElementsByTagName("type")[0]?.textContent || "General";
			const reason =
				outcome.getElementsByTagName("reason")[0]?.textContent || "";
			const suggestion =
				outcome.getElementsByTagName("suggestion")[0]?.textContent || "";
			const policy =
				outcome.getElementsByTagName("policy")[0]?.textContent || "";

			return {
				id: uuidv4(),
				statement: stmt,
				status: "pending",
				issue: issue
					? {
							type,
							reason,
							suggestion,
							policy,
							status: "pending",
							id: uuidv4(),
					  }
					: null,
			};
		} catch (err) {
			if (err.name !== "AbortError") {
				return {
					id: uuidv4(),
					statement: stmt,
					status: "error",
					issue: null,
				};
			}
			// If aborted, do not return anything
			return null;
		}
	};

	// Fetch Summary and Insights (unchanged)
	const fetchSummary = async (validationsData) => {
		try {
			const issuesString = validationsData
				.filter((validation) => validation.issue)
				.map((validation) => {
					const { type, reason, suggestion, policy } = validation.issue;
					return `Type: ${type}, Reason: ${reason}, Suggestion: ${suggestion}, Policy: ${policy}`;
				})
				.join("; ");

			const payload = {
				issues: issuesString,
			};

			const response = await fetch(
				"https://74wbta.buildship.run/compliance/summary",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch summary");
			}

			const data = await response.text();

			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(data, "text/xml");

			const summaryText =
				xmlDoc.getElementsByTagName("summary")[0]?.textContent || "";
			setSummary(summaryText);

			const insightsNodes = xmlDoc.getElementsByTagName("insight");
			const insightsArray = Array.from(insightsNodes).map(
				(node) => node.textContent
			);
			setInsights(insightsArray);

			setPhase("completed");
		} catch (err) {
			console.error("Error fetching summary:", err);
			setError("An error occurred while fetching the summary.");
			setPhase("completed");
		}
	};

	// Handle "Upload Another" Action (unchanged)
	const handleUploadAnother = () => {
		if (validationController) {
			validationController.abort();
		}
		setDocumentFile(null);
		setStatements([]);
		setValidations([]);
		setDraft("");
		setSummary("");
		setInsights([]);
		setError(null);
		setPhase("choices");
	};

	// Handle Download Report as PDF (unchanged)
	const handleDownloadReport = () => {
		const doc = new jsPDF();

		// Title
		doc.setFontSize(18);
		doc.text("Compliance Report", 105, 20, null, null, "center");

		// Add some spacing
		doc.setFontSize(12);
		doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

		// Validations
		doc.setFontSize(14);
		doc.text("Validations:", 14, 40);

		const validationRows = validations.map((validation, index) => {
			const issueDetails = validation.issue
				? `Issue Type: ${validation.issue.type}\nReason: ${validation.issue.reason}\nSuggestion: ${validation.issue.suggestion}\nPolicy: ${validation.issue.policy}`
				: "No issues detected.";

			return [
				index + 1,
				validation.statement,
				validation.status.toUpperCase(),
				issueDetails,
			];
		});

		doc.autoTable({
			startY: 45,
			head: [["#", "Statement", "Status", "Issue Details"]],
			body: validationRows,
			styles: { cellWidth: "wrap" },
			columnStyles: {
				0: { cellWidth: 10 },
				1: { cellWidth: 60 },
				2: { cellWidth: 20 },
				3: { cellWidth: 80 },
			},
		});

		// Summary
		let finalY = doc.lastAutoTable.finalY + 10;
		doc.setFontSize(14);
		doc.text("Summary:", 14, finalY);
		finalY += 5;
		doc.setFontSize(12);
		doc.text(summary, 14, finalY, { maxWidth: 180 });

		// Insights
		finalY += 10;
		doc.setFontSize(14);
		doc.text("Insights:", 14, finalY);
		finalY += 5;

		insights.forEach((insight, index) => {
			doc.setFontSize(12);
			doc.text(`${index + 1}. ${insight}`, 14, finalY);
			finalY += 7;
			// Add a new page if the content exceeds the page height
			if (finalY > 270) {
				doc.addPage();
				finalY = 20;
			}
		});

		// Save the PDF
		doc.save("compliance_report.pdf");
	};

	// Handle Resolve All Issues (unchanged)
	const handleResolveAll = () => {
		const resolved = validations.map((v) => ({
			...v,
			status: "resolved",
			issue: v.issue ? { ...v.issue, status: "resolved" } : null,
		}));
		setValidations(resolved);
	};

	// Handle Re-scan Document (unchanged)
	const handleRescan = () => {
		if (validationController) {
			validationController.abort();
		}
		setValidations([]);
		setSummary("");
		setInsights([]);
		setPhase("generating");
		validateStatements(statements);
	};

	// Handle Accept Issue (unchanged, but now ensures state synchronization)
	const handleAccept = async (id) => {
		// Find the validation with the given id
		const validation = validations.find((v) => v.id === id);
		if (!validation || !validation.issue || !validation.issue.suggestion)
			return;

		const originalSentence = validation.statement;
		const suggestedReplacement = validation.issue.suggestion;

		// Replace the original sentence with the suggestion in markdownContent
		const updatedMarkdown = markdownContent.replace(
			originalSentence,
			suggestedReplacement
		);

		// Update the markdownContent state
		setMarkdownContent(updatedMarkdown);

		// Update the validation status to 'resolved'
		setValidations((prev) =>
			prev.map((v) =>
				v.id === id
					? {
							...v,
							status: "resolved",
							issue: v.issue ? { ...v.issue, status: "resolved" } : null,
					  }
					: v
			)
		);

		// Call the placeholder API to persist the change
		try {
			const response = await fetch("https://example.com/api/resolve", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: id,
					original: originalSentence,
					replacement: suggestedReplacement,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to persist the change.");
			}

			// Optionally handle the response
			console.log("Change persisted successfully.");
		} catch (err) {
			console.error("Error persisting the change:", err);
			setError("An error occurred while persisting the change.");
		}
	};

	// Handle Deny Issue (unchanged)
	const handleDeny = async (id) => {
		// Update the validation status to 'denied'
		setValidations((prev) =>
			prev.map((v) =>
				v.id === id
					? {
							...v,
							status: "denied",
							issue: v.issue ? { ...v.issue, status: "denied" } : null,
					  }
					: v
			)
		);

		// Optionally, call an API to log the denial
		try {
			const response = await fetch("https://example.com/api/deny", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: id,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to log the denial.");
			}

			// Optionally handle the response
			console.log("Denial logged successfully.");
		} catch (err) {
			console.error("Error logging the denial:", err);
			setError("An error occurred while logging the denial.");
		}
	};

	// Cleanup on Unmount (unchanged)
	useEffect(() => {
		return () => {
			if (validationController) {
				validationController.abort();
			}
		};
	}, [validationController]);

	// Determine when to show the ComplianceCheckTable (unchanged)
	const showComplianceCheckTable = ![
		"generating",
		"validating",
		"summary",
		"completed",
	].includes(phase);

	return (
		<div className='compliance-app'>
			{/* Navbar */}
			{(documentFile || draft) && phase !== "choices" && (
				<Navbar
					onUploadAnother={handleUploadAnother}
					onDownloadReport={handleDownloadReport}
					onResolveAll={handleResolveAll}
				/>
			)}
			{/* Hero Section */}
			{!documentFile && phase === "choices" && (
				<section className='flex flex-col items-center justify-center bg-blue-500 text-white py-20'>
					<h1 className='text-4xl font-bold mb-4'>
						Welcome to Compliance Checker
					</h1>
					<p className='text-lg max-w-2xl text-center'>
						Ensure your documents and drafts adhere to compliance standards with
						our AI-powered tool.
					</p>
				</section>
			)}
			{/* User Choice Section */}
			{phase === "choices" && (
				<section className='flex flex-col md:flex-row justify-center items-center py-12 bg-gray-100'>
					<div
						className='flex flex-col items-center bg-white shadow-lg rounded-lg p-8 m-4 cursor-pointer hover:bg-gray-50'
						onClick={() => setPhase("upload")}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-16 w-16 text-blue-500 mb-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
							/>
						</svg>
						<h3 className='text-xl font-semibold mb-2'>Upload Document</h3>
						<p className='text-gray-600 text-center'>
							Analyze your documents for compliance issues.
						</p>
					</div>
					<div
						className='flex flex-col items-center bg-white shadow-lg rounded-lg p-8 m-4 cursor-pointer hover:bg-gray-50'
						onClick={() => setPhase("draft")}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-16 w-16 text-green-500 mb-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M11 5h2M11 9h2M7 13h10M7 17h10M7 21h10'
							/>
						</svg>
						<h3 className='text-xl font-semibold mb-2'>Draft a Document</h3>
						<p className='text-gray-600 text-center'>
							Create and validate your drafts for compliance.
						</p>
					</div>
				</section>
			)}
			{/* Upload Section */}
			{phase === "upload" && (
				<section className='flex justify-center items-center py-12 bg-gray-100'>
					<UploadSection
						handleDocumentChange={handleDocumentChange}
						handleDocumentSubmit={handleDocumentSubmit}
						document={documentFile}
						uploading={uploading}
						error={error}
					/>
				</section>
			)}
			{/* Draft Section */}
			{phase === "draft" && (
				<section className='flex flex-col items-center py-12 bg-gray-100'>
					<TextAreaWithAnalysis
						draft={draft}
						setDraft={setDraft}
						onSubmit={handleDraftSubmit}
						onAnalyze={handleDraftAnalyze}
						error={error}
					/>
				</section>
			)}
			{/* Conditionally Render ComplianceCheckTable (unchanged) */}
			{showComplianceCheckTable && <ComplianceCheckTable />}
			{/* Loading States */}
			{phase === "generating" && (
				<section className='flex justify-center items-center h-full py-20'>
					<Loading message='Generating compliance statements...' />
				</section>
			)}
			{phase === "validating" && (
				<section className='flex justify-center items-center h-full py-20'>
					<Loading message='Validating statements for compliance...' />
				</section>
			)}
			{/* Summary and Dashboard */}
			{(phase === "summary" || phase === "completed") && (
				<section className='py-12 bg-gray-100'>
					<ComplianceDashboard
						validations={validations}
						onAccept={handleAccept}
						onDeny={handleDeny}
						summary={summary}
						insights={insights}
						markdownContent={markdownContent} // Pass updated markdownContent
						highlightSentences={highlightSentences} // Pass highlightSentences
						setMarkdownContent={setMarkdownContent} // Pass setter
					/>
				</section>
			)}
			{/* Chatbot Widget */}
			<ChatbotWidget /> {/* <-- Included ChatbotWidget */}
		</div>
	);
}

export default Compliance;
