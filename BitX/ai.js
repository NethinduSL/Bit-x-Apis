const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function chatgpt(query) {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: query }
      ]
    });

    return {
      status: true,
      Created_by: 'Bitx',
      title: 'ChatGPT',
      poweredBy: 'Groq ⚡ (Free)',
      response: completion.choices[0].message.content
    };

  } catch (error) {
    console.error('Groq AI Error:', error.message);
    throw new Error('Failed to fetch response from AI');
  }
}

module.exports = { chatgpt };