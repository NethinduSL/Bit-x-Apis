const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI API with your API key
const configuration = new Configuration({
    apiKey: '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', // Directly using the OpenAI API key
});

const openai = new OpenAIApi(configuration);

async function chatgpt(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query is required' };
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: query },
            ],
        });

        // Check if the response is valid and has a message
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const message = response.data.choices[0].message.content;
            return { powered: 'By Bit X', response: message };
        } else {
            throw { statusCode: 500, message: 'No response from OpenAI', details: 'The response was empty or malformed' };
        }
    } catch (error) {
        console.error('Error fetching ChatGPT response:', error);

        // Enhanced error handling
        let errorMessage = 'Failed to fetch ChatGPT response';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error.message || errorMessage;
        }

        throw {
            statusCode: 500,
            message: errorMessage,
            details: error.message || 'Unknown error',
        };
    }
}

module.exports = { chatgpt };
