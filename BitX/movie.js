// routes.js
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchMovies(query) {
  try {
    const response = await axios.get(`https://sinhalasub.lk/?s=${encodeURIComponent(query)}`);
    const html = response.data;
    const $ = cheerio.load(html);
    const results = [];

    $(".result-item").each((_, element) => {
      const movieName = $(element).find(".title a").text().trim();
      const thumbnail = $(element).find(".thumbnail img").attr("src");
      const link = $(element).find(".title a").attr("href");
      const imdbRating = $(element).find(".rating").text().trim().replace("IMDb ", "");
      const year = $(element).find(".meta .year").text().trim();

      results.push({
        powerd: 'By Bitx❤️',
        movieName,
        thumbnail,
        year,
        imdbRating,
        link,
      });
    });

    return results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movie data.");
  }
}

async function getDownloadLinks(link) {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    let downloadLinks = [];

    $('.sbox').each((i, elem) => {
      $(elem).find('.links_table tbody tr').each((i, row) => {
        const quality = $(row).find('.quality').text().trim();
        const size = $(row).find('td').eq(2).text().trim();
        const link = $(row).find('a').attr('href');
        downloadLinks.push({ quality, size, link });
      });
    });

    return downloadLinks;
  } catch (error) {
    console.error('Error scraping data', error);
    throw new Error('Failed to fetch download links');
  }
}

async function getDownloadLinkFromPixeldrain(link) {
  if (!link) {
    throw new Error('Query parameter "q" is required');
  }

  try {
    const { data } = await axios.get(link, { timeout: 5000 });
    const $ = cheerio.load(data);

    const downloadLink = $('#link').attr('href');
    let apiLink = null;

    if (downloadLink && downloadLink.includes('pixeldrain.com/u/')) {
      const fileId = downloadLink.split('/u/')[1];
      apiLink = `https://pixeldrain.com/api/file/${fileId}`;
    }

    return { originalLink: downloadLink, apiLink: apiLink || 'Not applicable' };
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw new Error('Error scraping data');
  }
}

module.exports = {
  fetchMovies,
  getDownloadLinks,
  getDownloadLinkFromPixeldrain,
};
