const ytSearch = require('yt-search');
const y2mate = require('y2mate-api');
const http = require('http');
const https = require('https');

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

// Function to download file from URL and pipe to response
function downloadFromUrl(url, filename, res) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            // Check if the response is a redirect
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFromUrl(response.headers.location, filename, res)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            // Handle response errors
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            // Set headers for file download
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'video/mp4');
            
            // Pipe the response to client
            response.pipe(res);
            
            // Handle completion and errors
            response.on('end', () => resolve());
            response.on('error', (err) => reject(err));
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// New function to handle the actual download
async function downloadVideo(videoId, res) {
    if (!videoId) {
        throw { statusCode: 400, message: 'Video ID is required' };
    }

    try {
        // Get downloadable links using y2mate
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const videoInfo = await y2mate.getVideoInfo(videoUrl);
        
        // Clean the title for filename
        const title = videoInfo.title.replace(/[^\w\s]/gi, '_');
        const filename = `${title}.mp4`;
        
        // Get download links for all available formats
        const links = await y2mate.getDownloadLinks(videoUrl);
        
        // Find the highest quality MP4 link
        let downloadLink = null;
        const mp4Formats = links.filter(link => link.type === 'mp4');
        
        if (mp4Formats.length > 0) {
            // Sort by quality (highest first)
            mp4Formats.sort((a, b) => {
                const qualityA = parseInt(a.quality.replace('p', ''));
                const qualityB = parseInt(b.quality.replace('p', ''));
                return qualityB - qualityA;
            });
            
            downloadLink = mp4Formats[0].url;
        } else {
            throw new Error('No MP4 download links available');
        }
        
        // Download and pipe to response
        await downloadFromUrl(downloadLink, filename, res);
        
    } catch (error) {
        throw { statusCode: 500, message: 'Failed to download video', details: error.message };
    }
}

module.exports = { video, downloadVideo };
