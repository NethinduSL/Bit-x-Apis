const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch the latest valid news article
async function hiru(startId = 390861) {
  const batchSize = 5; // Number of IDs to check in each batch
  let currentId = startId;
  let latestArticle = null;

  try {
    while (!latestArticle) {
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

          // Validate if the article has required data
          if (title && image && text) {
            latestArticle = { id, title, image, text }; // Store the latest valid article
            break; // Exit the loop once a valid article is found
          }
        } catch (error) {
          
        }
      }

      // Move to the next batch if no valid article was found
      if (!latestArticle) {
        currentId += batchSize;
      }
    }

    return latestArticle;
  } catch (error) {
    throw new Error(`Failed to fetch the latest news: ${error.message || 'Unknown error'}`);
  }
}

module.exports = { hiru };
