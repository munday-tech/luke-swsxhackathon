import React, { useState } from "react";
import axios from "axios";

const EmbeddingForm = () => {
	const [openaiKey, setOpenaiKey] = useState("");
	const [pineconeKey, setPineconeKey] = useState("");
	const [pineconeEnvironment, setPineconeEnvironment] = useState("");
	const [pineconeIndex, setPineconeIndex] = useState("");
	const [textInput, setTextInput] = useState("");
	const [status, setStatus] = useState("");

	const handleSubmit = async () => {
		try {
			// Step 1: Call OpenAI to get embeddings
			setStatus("Generating embedding...");
			const embedResponse = await axios.post(
				"https://api.openai.com/v1/embeddings",
				{
					input: textInput,
					model: "text-embedding-3-large", // Update to the appropriate model
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${openaiKey}`,
					},
				}
			);

			const embedding = embedResponse.data.data[0].embedding;

			// Step 2: Send the embedding to your backend for Pinecone upsert
			setStatus("Upserting embedding...");
			const randomId = `id_${Math.random().toString(36).substr(2, 9)}`;
			const backendResponse = await axios.post(
				"http://localhost:3001/upsert-embedding",
				{
					pineconeKey,
					pineconeEnvironment,
					vectors: [
						{
							id: randomId,
							values: embedding,
							metadata: {
								text: textInput, // Store the original text as metadata
							},
						},
					],
				}
			);

			setStatus("Embedding upserted successfully!");
		} catch (error) {
			console.error("Error upserting embedding:", error);
			setStatus("An error occurred. Please check your API keys and try again.");
		}
	};

	return (
		<div className='p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-4'>Embed and Upsert Text</h1>
			{/* The form UI here */}
			<div className='mb-4'>
				<label className='block font-semibold'>OpenAI API Key:</label>
				<input
					type='text'
					value={openaiKey}
					onChange={(e) => setOpenaiKey(e.target.value)}
					className='w-full p-2 border rounded-md'
				/>
			</div>
			<div className='mb-4'>
				<label className='block font-semibold'>Pinecone API Key:</label>
				<input
					type='text'
					value={pineconeKey}
					onChange={(e) => setPineconeKey(e.target.value)}
					className='w-full p-2 border rounded-md'
				/>
			</div>
			<div className='mb-4'>
				<label className='block font-semibold'>Pinecone Environment:</label>
				<input
					type='text'
					value={pineconeEnvironment}
					onChange={(e) => setPineconeEnvironment(e.target.value)}
					className='w-full p-2 border rounded-md'
				/>
			</div>
			<div className='mb-4'>
				<label className='block font-semibold'>Pinecone Index Name:</label>
				<input
					type='text'
					value={pineconeIndex}
					onChange={(e) => setPineconeIndex(e.target.value)}
					className='w-full p-2 border rounded-md'
				/>
			</div>
			<div className='mb-4'>
				<label className='block font-semibold'>Text Input:</label>
				<textarea
					value={textInput}
					onChange={(e) => setTextInput(e.target.value)}
					className='w-full p-2 border rounded-md'
					rows='5'></textarea>
			</div>
			<button
				onClick={handleSubmit}
				className='bg-blue-500 text-white py-2 px-4 rounded-md'>
				Embed Now
			</button>
			<div className='mt-4'>
				<p>Status: {status}</p>
			</div>
		</div>
	);
};

export default EmbeddingForm;
