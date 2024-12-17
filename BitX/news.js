const axios = require('axios');
const cheerio = require('cheerio');

async function getLatestNews() {
  const baseURL = 'https://www.hirunews.lk/';

  try {
    // Step 1: Fetch the Hiru News homepage
    const response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);

    // Step 2: Find the 'today-video-tittle' section and extract the first news link
    const latestNewsLink = $('.today-video-tittle')
      .next('.middle-article') // Move to the middle-article container
      .find('a')               // Find all <a> tags
      .first()                 // Get the first news link
      .attr('href');           // Extract the link

    if (!latestNewsLink) {
      throw new Error('No latest news link found');
    }

    const newsURL = `${baseURL}${latestNewsLink}`;

    // Step 3: Fetch the individual news page
    const newsResponse = await axios.get(newsURL);
    const newsPage = cheerio.load(newsResponse.data);

    // Extract news details: title, image, and text
    const title = newsPage('h1.main-tittle').text().trim();
    const image = newsPage('img.lazyload').attr('data-src');

    const textContainer = newsPage('#article-phara2');
    textContainer.find('iframe').remove(); // Remove unnecessary iframes
    const text = textContainer.html()
      .replace(/<br\s*\/?>/gi, '')          // Remove <br> tags
      .replace(/<[^>]*>?/gm, '')           // Remove all remaining HTML tags
      .trim();

    // Return the fetched news data
    return {
      Power: 'by Bitx ❤️',
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

// Example Usage
(async () => {
  try {
    const news = await getLatestNews();
    console.log('Latest News:', news);
  } catch (error) {
    console.error(error.message);
  }
})();
