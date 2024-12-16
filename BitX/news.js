const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390861) {
  let currentId = startId;
  let latestArticle = null;

  while (true) {
    try {
      const article = await fetchNewsById(currentId);

      if (article) {
        // Found a valid article; update the latest article
        latestArticle = article;

        // Move to the next ID for the next check
        currentId++;
      } else {
        // If the current ID fails, stop checking further
        break;
      }
    } catch (error) {
      console.warn(`Error processing ID ${currentId}: ${error.message}`);
      break; // Stop if there are consecutive failures
    }
  }

  return latestArticle;
}

// Helper function to fetch a single news article by ID
async function fetchNewsById(id) {
  try {
    const url = `https://www.hirunews.lk/${id}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('h1.main-tittle').text().trim();
    const image = $('img.lazyload').attr('data-src');
    const textContainer = $('#article-phara2');
    textContainer.find('iframe').remove();
    const text = textContainer.html()?.replace(/<br\s*\/?>/gi, '') || '';

    const dateElement = $('.article-date'); // Adjust the selector if needed
    const date = dateElement.text().trim();

    // Check if the article has the required fields
    if (title && image && text && date) {
      return { id, title, image, text, date };
    } else {
      return null; // Invalid article
    }
  } catch (error) {
    return null; // Treat as invalid article
  }
}

module.exports = { hiru };
