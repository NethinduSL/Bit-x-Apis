const axios = require('axios');
const cheerio = require('cheerio');

async function mahindaNews() {
  const baseURL = 'https://news.mahindatv.lk/';

  try {
    const response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);

    const latestNewsLink = $('.jl_imgin').next('a.jl_imgl').attr('href');

    if (!latestNewsLink) {
      throw new Error('No latest news link found');
    }

    const newsURL = latestNewsLink;
    const newsResponse = await axios.get(newsURL);
    const newsPage = cheerio.load(newsResponse.data);

    const title = newsPage('h1.jl_head_title').text().trim();
    const image = newsPage('img.jl-lazyload').attr('data-src');
    const text = newsPage('p.has-drop-cap').text().trim();
    const date = newsPage('span.post-date').text().trim();
    const msg = newsPage('p strong').text().trim();
    const views = newsPage('span.jl_view_options').text().trim();

    return {
      Info: 'by Mahinda TV 💛🖤',
      Power: 'by Bitx ❤️',
      newsURL,
      title,
      image,
      text,
      date,
      msg,
      views,
    };
  } catch (error) {
    console.error('Error fetching latest news:', error.message);
    throw new Error(`Failed to fetch latest news: ${error.message}`);
  }
}

module.exports = {  mahindaNews};
