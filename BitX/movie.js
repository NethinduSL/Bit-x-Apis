const axios = require('axios');
const cheerio = require('cheerio');

/* ---------------- CONFIG ---------------- */
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/* ---------------- SEARCH MOVIES ---------------- */
async function fetchMovies(query) {
  if (!query) throw new Error('Query parameter "q" is required');

  try {
    const { data } = await axios.get(
      `https://sinhalasub.lk/search/${encodeURIComponent(query)}`,
      { headers: HEADERS, timeout: 15000 }
    );

    const $ = cheerio.load(data);
    const results = [];

    $('.result-item').each((_, el) => {
      results.push({
        powered: 'By Bitx ❤️',
        movieName: $(el).find('.title a').text().trim(),
        thumbnail: $(el).find('.thumbnail img').attr('src') || null,
        year: $(el).find('.meta .year').text().trim() || 'N/A',
        imdbRating: $(el)
          .find('.rating')
          .text()
          .replace('IMDb', '')
          .trim() || 'N/A',
        link: $(el).find('.title a').attr('href'),
      });
    });

    return results;
  } catch (err) {
    console.error('Scraping error:', err.message);
    throw new Error('Failed to fetch movie data');
  }
}

/* ---------------- GET DOWNLOAD LINKS ---------------- */
async function getDownloadLinks(movieUrl) {
  if (!movieUrl) throw new Error('Movie URL is required');

  try {
    const { data } = await axios.get(movieUrl, {
      headers: HEADERS,
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const links = [];

    $('.links_table tbody tr').each((_, row) => {
      const quality = $(row).find('.quality').text().trim();
      const size = $(row).find('td').eq(2).text().trim();
      const link = $(row).find('a').attr('href');

      links.push({
        quality: quality || 'Unknown',
        size: size || 'Unknown',
        link,
        pixeldrain_api: pixeldrainToApi(link),
      });
    });

    return links;
  } catch (err) {
    console.error('Error scraping download links:', err.message);
    throw new Error('Failed to fetch download links');
  }
}

/* ---------------- PIXELDRAIN HELPER ---------------- */
function pixeldrainToApi(url) {
  if (!url || !url.includes('pixeldrain.com/u/')) return null;
  const id = url.split('/u/')[1];
  return id ? `https://pixeldrain.com/api/file/${id}` : null;
}

/* ---------------- EXPORTS ---------------- */
module.exports = {
  fetchMovies,
  getDownloadLinks,
  pixeldrainToApi,
};
