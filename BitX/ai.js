const axios = require('axios');

async function chatgpt(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query is required' };
    }

    try {
        const response = await axios.get(`https://bk9.fun/ai/GPT4o`, {
            params: {
                q: query, 
                userId: 'Bitx',
            }
        });

        if (response.data.status) {
            const resjson = {
title:'gemini',
                Power: 'by Bitx❤️',
                Bitx: response.data.BK9,
            };
            return resjson;
        } else {
            throw { statusCode: 500, message: 'Failed to get a valid response' };
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        let errorMessage = 'Failed to fetch response';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error.message || errorMessage;
        }
        throw { statusCode: 500, message: errorMessage, details: error.message || 'Unknown error' };
    }
}

module.exports = { chatgpt };



const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyD6g7ZDG5VANBGC-GFmnzIG29inROwy0u0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function gemini(query) {
    if (!query) {
        throw { statusCode: 400, message: 'Query is required' };
    }

    try {
        const result = await model.generateContent(query);

        if (result && result.response) {
            return {
                title:'gemini',
                Power: 'by Bitx ❤️',
                Gemini: result.response.text(), // The text response from the model
            };
        } else {
            throw { statusCode: 500, message: 'Failed to get a valid response from Gemini' };
        }
    } catch (error) {
        console.error('Error fetching response from Gemini:', error);
        let errorMessage = 'Failed to fetch response from Gemini';
        if (error.message) {
            errorMessage = error.message;
        }
        throw { statusCode: 500, message: errorMessage, details: error.stack || 'Unknown error' };
    }
}

module.exports = { gemini };
