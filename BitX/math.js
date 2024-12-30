const axios = require('axios');

async function chatgpt(query) {
  if (!query) {
    throw new Error('Query is required'); // Error if no query is provided
  }

  try {
    const response = await axios.get('https://api.nexoracle.com/ai/math', {
      params: {
        q: query,
        apikey: 'free_key@maher_apis',
      },
    });

    // Check for valid response status
    if (response.data?.status) {
      return {
        title: 'Math AI',
        poweredBy: 'Team Bit X',
        response: response.data.result, // Return the appropriate field
      };
    } else {
      throw new Error('Failed to get a valid response from Math AI');
    }
  } catch (error) {
    console.error('Error fetching response from Math AI:', error.message);
    throw new Error(
      `Failed to fetch response from Math AI: ${error.message || 'Unknown error'}`
    );
  }
}

module.exports = { math };
