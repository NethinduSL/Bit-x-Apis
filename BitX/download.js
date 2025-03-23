const ytSearch = require('yt-search');
const ytdl = require('ytdl-core'); // You'll need to install this package

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

// New function to handle the actual download
async function downloadVideo(videoId, res) {
    if (!videoId) {
        throw { statusCode: 400, message: 'Video ID is required' };
    }

    try {
        const info = await ytdl.getInfo(videoId);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '_');
        
        // Set headers to force download
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Pipe the video stream to the response
        ytdl(videoId, {
            format: 'mp4',
            quality: 'highest'
        }).pipe(res);
        
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to download video', details: error.message };
    }
}

module.exports = { video, downloadVideo };
