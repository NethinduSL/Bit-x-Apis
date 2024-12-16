const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390861) {
  // Default starting ID is 390861 if not provided
  const batchSize = 4; // Number of IDs to check
  let currentId = startId; // Initialize the current ID
  const validArticles = []; // To store valid articles

  try {
    let foundNewArticle = true; // Flag to check if a new valid article is found

    while (foundNewArticle) {
      try {
        const url = `https://www.hirunews.lk/${currentId}`;
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);
        const title = $('h1.main-tittle').text().trim();
        const image = $('img.lazyload').attr('data-src');
        const textContainer = $('#article-phara2');
        textContainer.find('iframe').remove();
        const text = textContainer.html()?.replace(/<br\s*\/?>/gi, '') || '';

        if (title && image && text) {
          validArticles.push({ id: currentId, title, image, text });
          console.log(`Fetched article ID: ${currentId}`);
          currentId++; // Move to the next ID
        } else {
          throw new Error(`No valid content for ID ${currentId}`); // Stop fetching when invalid content is found
        }
      } catch (error) {
        console.warn(`Error processing ID ${currentId}: ${error.message}`); // Log and continue
        foundNewArticle = false; // Stop if no valid article found
      }
    }

    if (validArticles.length > 0) {
      const latestArticle = validArticles[validArticles.length - 1];
      return {
        message: 'Latest valid article fetched successfully',
        latestArticle,
      };
    } else {
      throw new Error('No valid articles found in the given batch');
    }
  } catch (error) {
    console.error('Error fetching news batch:', error);
    throw new Error(
      `Failed to fetch news batch: ${error.message || 'Unknown error'}`,
    );
  }
}

module.exports = { hiru };
