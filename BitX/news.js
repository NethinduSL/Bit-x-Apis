const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390935) {
  let consecutiveFailures = 0; // Count consecutive failed attempts
  let step = 1; // Increment step for searching IDs

  while (true) {
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
        // If a valid article is found, reset failures and return the article
        consecutiveFailures = 0;
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

    // Increment ID and adjust step dynamically if too many failures occur
    startId += step;
    consecutiveFailures++;

    if (consecutiveFailures >= 5) {
      step = Math.min(step + 1, 5); // Gradually increase step size
      console.log(`Consecutive failures reached. Increasing step size to ${step}`);
      consecutiveFailures = 0; // Reset failure count after increasing step
    }
  }
}

module.exports = { hiru };
