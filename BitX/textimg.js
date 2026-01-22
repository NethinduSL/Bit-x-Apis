const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

async function textImage(query, fontName = 'sans', fontSize = 200, align = 'center', color = '#000000') {
    if (!query) throw new Error('Query parameter "q" is required');

    const fontPath = path.join(__dirname, 'Font', `${fontName}.ttf`);
    if (!fs.existsSync(fontPath)) throw new Error(`Font "${fontName}" not found`);
    registerFont(fontPath, { family: fontName });

    const lines = query.split(/\r?\n/); // split by \n or \r\n
    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `bold ${fontSize}px "${fontName}"`;

    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = tempCtx.measureText(line);
        if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const width = Math.ceil(maxWidth + fontSize * 0.5);
    const lineHeight = fontSize * 1.2;
    const height = Math.ceil(lineHeight * lines.length + fontSize * 0.3);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px "${fontName}"`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    let xPos = width / 2;
    if (align === 'left') xPos = fontSize * 0.25;
    if (align === 'right') xPos = width - fontSize * 0.25;

    lines.forEach((line, index) => {
        const yPos = index * lineHeight + fontSize * 0.15;
        ctx.fillText(line, xPos, yPos);
    });

    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    return {
        status: true,
        text: query,
        font: fontName,
        size: fontSize,
        align: align,
        color: color,
        image: base64Image
    };
}

module.exports = { textImage };
