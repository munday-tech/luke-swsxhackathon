import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Update with your backend URL

// Function to send messages
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to fetch tools
export const fetchTools = async (filters) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tools/`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};
