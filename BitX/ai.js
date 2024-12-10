const axios = require('axios');

async function chatgpt(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query is required' };
    }

    try {
        const response = await axios.get(`https://bk9.fun/ai/GPT4o`, {
            params: {
                q: query, 
                userId: 'Bitx',
            }
        });

        if (response.data.status) {
            const resjson = {
                Power: 'by Bitx❤️',
                Bitx: response.data.BK9,
            };
            return resjson;
        } else {
            throw { statusCode: 500, message: 'Failed to get a valid response' };
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        let errorMessage = 'Failed to fetch response';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error.message || errorMessage;
        }
        throw { statusCode: 500, message: errorMessage, details: error.message || 'Unknown error' };
    }
}

module.exports = { chatgpt };
