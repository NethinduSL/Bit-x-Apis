const ytSearch = require('yt-search');


async function video(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query parameter "q" is required' };
    }

    try {
        const results = await ytSearch(query);

        if (!results || results.videos.length === 0) {
            throw { statusCode: 404, message: 'No videos found for the search query' };
        }

        // Get the first 10 videos from the results
        const videos = results.videos.slice(0, 10);

        // Map the video details with actual download links
        const videoDetails = videos.map(video => ({
            powered: 'By Bitx❤️',
            title: video.title,
            viewCount: video.views,
            youtubeUrl: video.url,
            downloadUrl: `/api/download?videoId=${video.videoId}`, // API endpoint for downloading
            thumbnailUrl: video.thumbnail
        }));

        return videoDetails;
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to fetch video details', details: error.message };
    }
}






module.exports = { video, downloadVideo };
