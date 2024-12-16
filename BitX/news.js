const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390861) {
  // Default starting ID is 390861 if not provided
  const batchSize = 4; // Number of IDs to check
  const validArticles = []; // To store valid articles

  try {
    for (let offset = 0; offset < batchSize; offset++) {
      const id = startId + offset;
      try {
        const url = `https://www.hirunews.lk/${id}`;
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);
        const title = $('h1.main-tittle').text().trim();
        const image = $('img.lazyload').attr('data-src');
        const textContainer = $('#article-phara2');
        textContainer.find('iframe').remove();
        const text = textContainer.html()?.replace(/<br\s*\/?>/gi, '') || '';

        if (title && image && text) {
          validArticles.push({ id, title, image, text });
        }
      } catch (error) {
        console.warn(`Error processing ID ${id}: ${error.message}`); // Log and continue
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
