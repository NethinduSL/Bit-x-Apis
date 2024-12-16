const axios = require('axios');
const cheerio = require('cheerio');

const hiru = async () => {
    let currentId = 390689; // Starting ID

    while (true) {
        try {
            const url = `https://www.hirunews.lk/${currentId}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const title = $('h1.main-tittle').text().trim();
            const image = $('img.lazyload').attr('data-src');
            const textContainer = $('#article-phara2');
            textContainer.find('iframe').remove();
            const text = textContainer.html().replace(/<br\s*\/?>/gi, '');

            return {
                id: currentId,
                title,
                image,
                text
            };
        } catch (error) {
            currentId++;
        }
    }
}

module.exports = { hiru };
