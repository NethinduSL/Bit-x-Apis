const ytSearch = require('yt-search');

async function fetchVideoDetails(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query parameter "q" is required' };
    }

    try {
        const results = await ytSearch(query);

        if (!results || results.videos.length === 0) {
            throw { statusCode: 404, message: 'No videos found for the search query' };
        }

        const video = results.videos[0];

        return {
            powered: 'By Bitx❤️',
            title: video.title,
            viewCount: video.views,
            downloadUrl: video.url,
            thumbnailUrl: video.thumbnail
        };
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to fetch video details', details: error.message };
    }
}

module.exports = { fetchVideoDetails };
