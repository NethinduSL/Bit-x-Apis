const axios = require('axios');
const cheerio = require('cheerio');

async function hiru() {
  const baseURL = 'https://www.hirunews.lk/';

  try {
    const response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);

    const latestNewsLink = $('.today-video-tittle')
      .next('.middle-article')
      .find('a')
      .first()
      .attr('href');

    if (!latestNewsLink) {
      throw new Error('No latest news link found');
    }

    const newsURL = `${latestNewsLink}`;
    const idMatch = newsURL.match(/\/(\d+)\//); // Match the numeric ID between slashes
    const id = idMatch ? idMatch[1] : 'Unknown';

    const newsResponse = await axios.get(newsURL);
    const newsPage = cheerio.load(newsResponse.data);

    const title = newsPage('h1.main-tittle').text().trim();
    const image = newsPage('img.lazyload').attr('data-src');

    const textContainer = newsPage('#article-phara2');
    textContainer.find('iframe').remove();
    const text = textContainer.html()
      .replace(/<br\s*\/?>/gi, '')
      .replace(/<[^>]*>?/gm, '')
      .trim();

    return {
      Power: 'by Bitx ❤️',
      id,
      newsURL,
      title,
      image,
      text,
    };
  } catch (error) {
    console.error('Error fetching latest news:', error.message);
    throw new Error(`Failed to fetch latest news: ${error.message}`);
  }
}

module.exports = { hiru };
