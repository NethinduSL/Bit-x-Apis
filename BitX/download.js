const ytSearch = require('yt-search');
const youtubeDl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

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

// Use /tmp directory which is writable in most serverless environments
const tempDir = '/tmp';

// New function to handle the actual download
async function downloadVideo(videoId, res) {
    if (!videoId) {
        throw { statusCode: 400, message: 'Video ID is required' };
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const tempFilePath = path.join(tempDir, `${videoId}-${Date.now()}.mp4`);

    try {
        // First get video info to get the title
        const info = await youtubeDl(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
        });

        // Clean the title for filename
        const title = info.title.replace(/[^\w\s]/gi, '_');

        // Download video
        await youtubeDl(videoUrl, {
            output: tempFilePath,
            format: 'best[ext=mp4]',
            noCheckCertificates: true,
            noWarnings: true,
        });

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        // Stream the file to the response
        const fileStream = fs.createReadStream(tempFilePath);
        fileStream.pipe(res);

        // Clean up temp file when done
        fileStream.on('end', () => {
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error(`Failed to delete temporary file: ${err.message}`);
            });
        });

    } catch (error) {
        // Clean up any partial file
        if (fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (unlinkError) {
                console.error('Failed to delete partial file:', unlinkError);
            }
        }
        throw { statusCode: 500, message: 'Failed to download video', details: error.message };
    }
}

module.exports = { video, downloadVideo };
