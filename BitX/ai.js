const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI API
const configuration = new Configuration({
    apiKey: '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', // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

async function chatgpt(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Prompt is required' };
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: query },
            ],
        });

        // Extract the assistant's reply
        const message = response.data.choices[0].message.content;

        return { powered: 'By Bit X', response: message };
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to fetch ChatGPT response', details: error.message };
    }
}

module.exports = { chatgpt };
