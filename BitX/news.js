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
          throw new Error(`No valid content for ID ${currentId}`);
        }
      } catch (error) {
        currentId++;
      }

      if (latestArticle) {
        return {
          message: 'Latest valid article fetched successfully',
          latestArticle,
        };
      }
    }
  } catch (error) {
    throw new Error(`Failed to fetch the news: ${error.message || 'Unknown error'}`);
  }
}

module.exports = { hiru };
