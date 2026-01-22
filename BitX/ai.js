
async function chatgpt(query) {
  if (!query) throw new Error('Query is required');

  try {
    // Chat with Grok 4.1 Fast
    const response ="hi";

    return {
      status: true,
      Created_by: 'Bitx',
      title: 'ChatGPT',
      poweredBy: 'Grok 4.1 Fast',
      response: response.message.content
    };

  } catch (error) {
    console.error('Puter AI Error:', error.message);
    throw new Error('Failed to fetch AI response: ' + error.message);
  }
}

module.exports = { chatgpt };
