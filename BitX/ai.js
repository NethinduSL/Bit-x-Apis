const ollama = require('ollama');

async function chatgpt(query) {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    const response = await ollama.chat({
      model: 'llama3',
      messages: [
        { role: 'user', content: query }
      ],
    });

    return {
      title: 'ChatGPT',
      poweredBy: 'Local AI (Ollama)',
      response: response.message.content,
    };

  } catch (error) {
    console.error('Error fetching response:', error.message);
    throw new Error(`Failed to fetch response: ${error.message}`);
  }
}

module.exports = { chatgpt };