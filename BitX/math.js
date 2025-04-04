const axios = require('axios');

async function math(query) {
  if (!query) {
    throw new Error('Query is required'); // Error if no query is provided
  }

  try {
    const response = await axios.get('https://api.nexoracle.com/ai/math', {
      params: {
        prompt: query,
        apikey: 'free_key@maher_apis',
      },
    });

    // Check for valid response status
    if (response.data?.status) {
      return {
        "powerd": "By Bitx❤️",
        title: 'Math AI',
      
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
