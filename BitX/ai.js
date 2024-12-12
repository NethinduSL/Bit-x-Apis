const axios = require('axios');

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



module.exports = { chatgpt};
