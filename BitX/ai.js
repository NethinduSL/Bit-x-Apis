const axios = require('axios');



// Your OpenAI API key stored securely in an environment variable

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

// Middleware to parse 

// Function to call OpenAI's API
async function chatgpt(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query is required' };
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // You can change this to 'gpt-4' if needed
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: query },
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching ChatGPT response:', error);
        let errorMessage = 'Failed to fetch ChatGPT response';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error.message || errorMessage;
        }
        throw { statusCode: 500, message: errorMessage, details: error.message || 'Unknown error' };
    }
}

module.exports = { chatgpt };
