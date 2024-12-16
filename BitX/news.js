const axios = require('axios');
const cheerio = require('cheerio');

async function hiru(startId = 390861) {
  let currentId = startId;
  let latestArticle = null;

  try {
    while (true) {
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
          latestArticle = { id: currentId, title, image, text };
          currentId++;
        } else {
          currentId++; // Skip invalid article and move to next ID
        }
      } catch (error) {
        currentId++; // Skip to next ID on error
      }
    }
  } catch (error) {
    return {
      message: `Failed to fetch the news: ${error.message || 'Unknown error'}`,
    };
  }
}

module.exports = { hiru };
