async function textImage(query, fontName, fontSize, align, color, style = '') {
    if (!query) throw new Error('Query parameter "q" is required');

    /* ---------- SPLIT TEXT FIRST ---------- */
    const lines = query.split(/\r?\n/);

    /* ---------- STYLE FLAGS ---------- */
    const isBold = style.includes('b');
    const isItalic = style.includes('i');
    const isUnderline = style.includes('u');

    /* ---------- FONT SETUP ---------- */
    ctx.font = `${fontSize}px "${fontName}"`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    /* ---------- DRAW ---------- */
    lines.forEach((line, index) => {
        const yPos = index * lineHeight + fontSize * 0.15;

        ctx.save();

        // Fake italic
        if (isItalic) {
            ctx.transform(1, 0, -0.3, 1, 0, 0);
        }

        // Fake bold
        const offsets = isBold ? [0, 1.2, 2.4] : [0];

        offsets.forEach(offset => {
            let drawX = xPos + offset;
            if (isItalic) drawX += yPos * 0.3;
            ctx.fillText(line, drawX, yPos);
        });

        ctx.restore();

        // Underline
        if (isUnderline) {
            const textWidth = ctx.measureText(line).width;
            let startX = xPos - textWidth / 2;
            if (align === 'left') startX = xPos;
            if (align === 'right') startX = xPos - textWidth;

            const underlineY = yPos + fontSize + 6;
            ctx.beginPath();
            ctx.moveTo(startX, underlineY);
            ctx.lineTo(startX + textWidth, underlineY);
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(2, fontSize * 0.06);
            ctx.stroke();
        }
    });
}
