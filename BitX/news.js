const axios = require('axios');
const cheerio = require('cheerio');

const hiru = async () => {
    let currentId = 390689; // Starting ID, adjust this if needed
    let latestNews = null;

    while (true) {
        try {
            const url = `https://www.hirunews.lk/${currentId}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            // Check if the article exists
            const title = $('h1.main-tittle').text().trim();
            if (!title) {
                // If no title is found, no article exists for this ID, try the next ID
                currentId++;
                continue;
            }

            // Extract the article details
            const image = $('img.lazyload').attr('data-src');
            const textContainer = $('#article-phara2');
            textContainer.find('iframe').remove();
            const text = textContainer.html().replace(/<br\s*\/?>/gi, '');

            latestNews = {
                id: currentId,
                title,
                image,
                text
            };

            // After finding a news article, we check if there might be newer articles
            // Check the next ID (+1 or +9)
            const nextId = currentId + 1;
            const urlNext = `https://www.hirunews.lk/${nextId}`;
            const responseNext = await axios.get(urlNext);
            const $next = cheerio.load(responseNext.data);

            const nextTitle = $('h1.main-tittle').text().trim();
            if (nextTitle) {
                // If there's a valid title for the next ID, continue to fetch newer articles
                currentId = nextId; // Move to the next ID if a newer article exists
                continue;
            } else {
                // If no article exists for the next ID, stop and return the latest one
                break;
            }
        } catch (error) {
            console.error(`Error fetching ID ${currentId}: ${error.message}`);
            // Handle error by trying the next ID, either increment by 1 or 9
            if (error.message.includes('404')) {
                currentId = currentId + 9; // Try next ID with +9 if the current ID doesn't exist
            } else {
                currentId++; // Default to +1 for other types of errors
            }
        }
    }

    return latestNews;
};

module.exports = { hiru };
