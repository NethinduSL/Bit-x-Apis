const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

function findFontFile(fontDir, fontName) {
    const files = fs.readdirSync(fontDir);
    return files.find(f =>
        f.toLowerCase() === `${fontName.toLowerCase()}.ttf`
    );
}

async function textImage(
    query,
    fontName = 'sans',
    fontSize = 200,
    align = 'center',
    color = '#000000',
    style = '' // b, i, u, bi, bu, iu, biu
) {
    if (!query) throw new Error('Query parameter "q" is required');

    const fontDir = path.join(__dirname, 'Font');
    const fontFile = findFontFile(fontDir, fontName);

    if (!fontFile) {
        throw new Error(`Font "${fontName}" not found (.ttf or .TTF)`);
    }

    const fontPath = path.join(fontDir, fontFile);
    registerFont(fontPath, { family: fontName });

    /* ---------- STYLE PARSING ---------- */
    const isBold = style.includes('b');
    const isItalic = style.includes('i');
    const isUnderline = style.includes('u');

    const fontStyle =
        `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}px "${fontName}"`;

    const lines = query.split(/\r?\n/);

    /* ---------- MEASURE ---------- */
    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = fontStyle;

    let maxWidth = 0;
    lines.forEach(line => {
        maxWidth = Math.max(maxWidth, tempCtx.measureText(line).width);
    });

    const lineHeight = fontSize * 1.2;
    const width = Math.ceil(maxWidth + fontSize * 0.5);
    const height = Math.ceil(lineHeight * lines.length + fontSize * 0.3);

    /* ---------- DRAW ---------- */
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.font = fontStyle;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    let xPos = width / 2;
    if (align === 'left') xPos = fontSize * 0.25;
    if (align === 'right') xPos = width - fontSize * 0.25;

    lines.forEach((line, index) => {
        const yPos = index * lineHeight + fontSize * 0.15;
        ctx.fillText(line, xPos, yPos);

        /* ---------- UNDERLINE ---------- */
        if (isUnderline) {
            const textWidth = ctx.measureText(line).width;
            let startX = xPos - textWidth / 2;
            if (align === 'left') startX = xPos;
            if (align === 'right') startX = xPos - textWidth;

            const underlineY = yPos + fontSize + 5;
            ctx.beginPath();
            ctx.moveTo(startX, underlineY);
            ctx.lineTo(startX + textWidth, underlineY);
            ctx.lineWidth = Math.max(2, fontSize * 0.05);
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    });

    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    return {
        status: true,
        text: query,
        font: fontName,
        size: fontSize,
        align,
        color,
        style,
        image: base64Image
    };
}

module.exports = { textImage };
