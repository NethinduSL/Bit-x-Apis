const axios = require('axios');

async function chatgpt(query) {
  if (!query) {
    throw new Error('Query is required'); // Error if no query is provided
  }

  try {
    const response = await axios.get('https://bk9.fun/ai/GPT4o', {
      params: {
        q: query,
        userId: 'Bitx',
      },
    });

    // Check for valid response status
    if (response.data?.status) {
      return {
        title: 'ChatGPT',
        poweredBy: 'by Bitx❤️',
        response: response.data.BK9, // Return the appropriate field
      };
    } else {
      throw new Error('Failed to get a valid response from ChatGPT');
    }
  } catch (error) {
    console.error('Error fetching response from ChatGPT:', error.message);
    throw new Error(
      `Failed to fetch response from ChatGPT: ${error.message || 'Unknown error'}`
    );
  }
}

module.exports = { chatgpt };
