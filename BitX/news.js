const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390861) {
  let step = 1; // Start with checking one ID at a time
  let attempts = 0; // Count attempts to find valid articles
  const maxAttempts = 50; // Maximum number of IDs to check before giving up

  while (attempts < maxAttempts) {
    try {
      const url = `https://www.hirunews.lk/${startId}`;
      const response = await axios.get(url);

      // Parse the HTML with Cheerio
      const $ = cheerio.load(response.data);
      const title = $('h1.main-tittle').text().trim();
      const image = $('img.lazyload').attr('data-src');
      const textContainer = $('#article-phara2');
      textContainer.find('iframe').remove();
      const text = textContainer.html()?.replace(/<br\s*\/?/gi, '') || '';

      if (title && image && text) {
        // Return the latest valid article
        return {
          message: 'Latest valid article fetched successfully',
          article: { id: startId, title, image, text },
        };
      } else {
        console.warn(`ID ${startId} is invalid or missing required fields.`);
      }
    } catch (error) {
      console.warn(`Error processing ID ${startId}: ${error.message}`);
    }

    // Move to the next ID based on the step size
    startId += step;
    attempts++;

    // If too many consecutive failures, increase the step size
    if (attempts % 10 === 0) {
      step = Math.min(step + 1, 5); // Cap step size to 5 to avoid skipping too far
      console.log(`Increasing step size to ${step}`);
    }
  }

  throw new Error('Unable to fetch any valid articles within the attempt limit.');
}

module.exports = { hiru };
