const axios = require('axios');

async function hiru(externalId = 390689) {
  if (!externalId) {
    throw new Error('External ID is required');
  }

  try {
    const url = `https://www.hirunews.lk/${externalId}`;
    const response = await axios.get(url);
    const $ = require('cheerio').load(response.data);

    const title = $('h1.main-tittle').text().trim();
    const image = $('img.lazyload').attr('data-src');

    const textContainer = $('#article-phara2');
    textContainer.find('iframe').remove();
    const text = textContainer.html().replace(/<br\s*\/?>/gi, '');

    return {
    Power: 'by Bitx❤️',
      id: externalId,
        image,
      title,
      
      text,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error(`Failed to fetch news: ${error.message || 'Unknown error'}`);
  }
}

module.exports = { hiru };
