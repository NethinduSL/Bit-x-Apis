const ytSearch = require('yt-search');
const playdl = require('play-dl'); // You'll need to install this package

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
        // Get video info
        const videoInfo = await playdl.video_info(`https://www.youtube.com/watch?v=${videoId}`);
        const videoDetails = videoInfo.video_details;
        const title = videoDetails.title.replace(/[^\w\s]/gi, '_');
        
        // Get the best quality format
        const formats = videoInfo.format;
        const highestQualityFormat = playdl.chooseFormat(formats, { quality: 'highest', filter: 'videoandaudio' });
        
        // Set headers to force download
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Create a readable stream from the video URL and pipe it to the response
        const stream = await playdl.stream_from_info(videoInfo, { format: highestQualityFormat });
        stream.stream.pipe(res);
        
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to download video', details: error.message };
    }
}

module.exports = { video, downloadVideo };
