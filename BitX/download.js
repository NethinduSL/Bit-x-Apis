const ytSearch = require('yt-search');
const { alldl } = require('rahad-all-downloader');

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

async function downloadVideo(videoId, res) {
    if (!videoId) {
        throw { statusCode: 400, message: 'Video ID is required' };
    }

    try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const result = await alldl(videoUrl);

        if (!result || !result.data || !result.data.videoUrl) {
            throw { statusCode: 500, message: 'Invalid response from video downloader' };
        }

        const videoDetails = {
            powered: 'By Bitx❤️',
            title: result.data.title || 'Unknown Title',
            url: result.data.videoUrl
        };

        res.json({ success: true, video: videoDetails });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to download video', details: error.message });
    }
}






module.exports = { video, downloadVideo };
