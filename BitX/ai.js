const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Assuming you have a valid API key and model ID
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.generateContent({ model: 'gemini-1.5-flash-001' });

async function chatgpt(query) {
  if (!query) {
    throw new Error('Query is required'); // More concise error handling
  }

  try {
    const response = await axios.get('https://bk9.fun/ai/GPT4o', {
      params: {
        q: query,
        userId: 'Bitx',
      },
    });

    if (response.data.status) {
      return {
        title: 'ChatGPT',
        Power: 'by Bitx❤️',
        response: response.data.BK9, // More descriptive property
      };
    } else {
      throw new Error('Failed to get a valid response from ChatGPT');
    }
  } catch (error) {
    console.error('Error fetching response from ChatGPT:', error);
    throw new Error(
      `Failed to fetch response from ChatGPT: ${error.message || 'Unknown error'}`,
    );
  }
}

async function gemini(query) {
  if (!query) {
    throw new Error('Query is required'); // More concise error handling
  }

  try {
    const response = await model.generateText(query);

    if (response.text) {
      return {
        title: 'Gemini',
        Power: 'by Google AI',
        response: response.text, // More descriptive property
      };
    } else {
      throw new Error('Failed to get a valid response from Gemini');
    }
  } catch (error) {
    console.error('Error fetching response from Gemini:', error);
    throw new Error(
      `Failed to fetch response from Gemini: ${error.message || 'Unknown error'}`,
    );
  }
}

module.exports = { chatgpt, gemini };
