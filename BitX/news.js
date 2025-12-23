const axios = require('axios');
const cheerio = require('cheerio');

async function hiru() {
  const baseURL = 'https://www.hirunews.lk/';

  try {
    const response = await axios.get(baseURL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const latestNewsLink = $('.today-video-tittle')
      .next('.middle-article')
      .find('a')
      .first()
      .attr('href');

    if (!latestNewsLink) {
      throw new Error('No latest news link found');
    }

    const newsURL = latestNewsLink;

    const newsResponse = await axios.get(newsURL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    const newsPage = cheerio.load(newsResponse.data);

    const title = newsPage('h1.main-tittle').text().trim();
    const image = newsPage('img.lazyload').attr('data-src');

    const textContainer = newsPage('#article-phara2');
    textContainer.find('iframe').remove();

    const text = textContainer
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    return {
      Power: 'by Bitx ❤️',
      title,
      image,
      newsURL,
      text,
    };
  } catch (error) {
    console.error('Error fetching latest news:', error.message);
    throw error;
  }
}

module.exports = { hiru };
