const ytSearch = require('yt-search');
const axios = require('axios');

// BitX/ytdl.js — polling version

async function getYouTubeMp3(youtubeUrl) {
  try {
    if (!youtubeUrl) {
      throw new Error('YouTube URL is required');
    }

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0',
      'Referer': 'https://ytmp3.cc/',
      'Origin': 'https://ytmp3.cc',
    };

    const convertRes = await axios.post(
      'https://ytmp3.nu/@api/ajaxSearch/index',
      new URLSearchParams({ q: youtubeUrl }),
      { headers, timeout: 12000 }
    );

    const data = convertRes.data;

    if (!data || !data.vid || !data.title) {
      throw new Error('Conversion init failed');
    }

    const vid = data.vid;
    const title = data.title;
    const hash = data.hash || '';

    let mp3Url = null;
    let tries = 0;

    while (!mp3Url && tries < 20) {
      await new Promise(r => setTimeout(r, 2200));

      const progressRes = await axios.post(
        'https://ytmp3.nu/@api/ajaxSearch/progress',
        new URLSearchParams({ id: vid, hash }),
        { headers, timeout: 10000 }
      );

      const progress = progressRes.data;

      if (progress?.progress === 1000 && progress?.download_url) {
        mp3Url = progress.download_url;
        break;
      }

      if (progress?.error) {
        throw new Error(progress.error);
      }

      tries++;
    }

    if (!mp3Url) {
      throw new Error('Timeout — MP3 not ready');
    }

    return {
      success: true,
      title,
      downloadUrl: mp3Url,
      note: 'Direct MP3 link (may expire soon)',
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Failed: ${err.message}`);
  }
}

async function video(query) {
  if (!query) {
    throw {
      statusCode: 400,
      message: 'Query parameter "q" is required',
    };
  }

  try {
    const results = await ytSearch(query);

    if (!results || !results.videos || results.videos.length === 0) {
      throw {
        statusCode: 404,
        message: 'No videos found for the search query',
      };
    }

    return results.videos.slice(0, 10).map(v => ({
      powered: 'By Bitx❤️',
      title: v.title,
      viewCount: v.views,
      youtubeUrl: v.url,
      videoId: v.videoId,
      downloadUrl: `/api/download?videoId=${v.videoId}`,
      thumbnailUrl: v.thumbnail,
    }));
  } catch (error) {
    throw {
      statusCode: 500,
      message: 'Failed to fetch video details',
      details: error.message,
    };
  }
}

// ✅ EXPORT BOTH (THIS WAS THE BIG BUG)
module.exports = {
  getYouTubeMp3,
  video,
};
