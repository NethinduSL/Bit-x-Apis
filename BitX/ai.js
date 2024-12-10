const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI API
const configuration = new Configuration({
    apiKey: 'your_openai_api_key', // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

async function fetchChatGPTResponse(prompt) {
    if (!prompt) {
        throw { statusCode: 400, message: 'Prompt is required' };
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        });

        // Extract the assistant's reply
        const message = response.data.choices[0].message.content;

        return { powered: 'By OpenAI', response: message };
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to fetch ChatGPT response', details: error.message };
    }
}

module.exports = { fetchChatGPTResponse };
