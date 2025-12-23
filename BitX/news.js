const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function hiru() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.hirunews.lk/', {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const latestNewsLink = $('.today-video-tittle')
      .next('.middle-article')
      .find('a')
      .first()
      .attr('href');

    if (!latestNewsLink) {
      throw new Error('No latest news link found');
    }

    await page.goto(latestNewsLink, {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    const newsHTML = await page.content();
    const newsPage = cheerio.load(newsHTML);

    const title = newsPage('h1.main-tittle').text().trim();
    const image = newsPage('img.lazyload').attr('data-src');

    const text = newsPage('#article-phara2')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    return {
      Power: 'by Bitx ❤️',
      title,
      image,
      newsURL: latestNewsLink,
      text,
    };
  } finally {
    await browser.close();
  }
}

module.exports = { hiru };
