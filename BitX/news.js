const axios = require('axios');
const cheerio = require('cheerio');

let currentId = 390689;
let lastValidArticle = null;

const getNews = async (id) => {
    const url = `https://www.hirunews.lk/${id}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('h1.main-tittle').text().trim();
    const image = $('img.lazyload').attr('data-src');

    const textContainer = $('#article-phara2');
    textContainer.find('iframe').remove();
    const text = textContainer.html().replace(/<br\s*\/?>/gi, '');

    return {
        id,
        title,
        image,
        text
    };
}

const fetchLatest = async () => {
    try {
        const news = await getNews(currentId);
        lastValidArticle = news;
        currentId++;
        return news;
    } catch (error) {
        if (lastValidArticle) {
            return lastValidArticle;
        } else {
            throw new Error('No valid articles found.');
        }
    }
}

const hiru = async (externalId = currentId) => {
    currentId = externalId;
    return await fetchLatest();
}
