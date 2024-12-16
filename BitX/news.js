const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch and validate news articles
async function hiru(startId = 390861) {
  const batchSize = 5; // Number of IDs to check in each batch
  let validArticles = []; // To store valid articles
  let lastValidArticle = null; // To track the last valid article

  try {
    let currentId = startId;

    while (validArticles.length === 0) {
      for (let i = 0; i < batchSize; i++) {
        const id = currentId + i;

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
            const article = { id, title, image, text };
            validArticles.push(article); // Add valid article to the list
            lastValidArticle = article; // Update the latest valid article
          }
        } catch (error) {
          console.warn(`Error processing ID ${id}: ${error.message}`);
        }
      }

      // Move to the next batch if no valid articles are found
      if (validArticles.length === 0) {
        currentId += batchSize;
      }
    }

    return {
      latestArticle: lastValidArticle,
      validArticles, // All valid articles from the batch
    };
  } catch (error) {
    console.error('Error fetching news batch:', error);
    throw new Error(
      `Failed to fetch news batch: ${error.message || 'Unknown error'}`,
    );
  }
}

module.exports = { hiru };
