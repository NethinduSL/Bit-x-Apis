lines.forEach((line, index) => {
    const yPos = index * lineHeight + fontSize * 0.15;

    ctx.save();

    /* ---------- FAKE ITALIC ---------- */
    if (isItalic) {
        ctx.transform(1, 0, -0.3, 1, 0, 0); // skew
    }

    /* ---------- FAKE BOLD ---------- */
    const boldOffsets = isBold ? [0, 1.2, 2.4] : [0];

    boldOffsets.forEach(offset => {
        let drawX = xPos + offset;

        if (align === 'center' && isItalic) drawX += yPos * 0.3;
        if (align === 'left' && isItalic) drawX += yPos * 0.3;
        if (align === 'right' && isItalic) drawX += yPos * 0.3;

        ctx.fillText(line, drawX, yPos);
    });

    ctx.restore();

    /* ---------- UNDERLINE ---------- */
    if (isUnderline) {
        const textWidth = ctx.measureText(line).width;
        let startX = xPos - textWidth / 2;
        if (align === 'left') startX = xPos;
        if (align === 'right') startX = xPos - textWidth;

        const underlineY = yPos + fontSize + 6;
        ctx.beginPath();
        ctx.moveTo(startX, underlineY);
        ctx.lineTo(startX + textWidth, underlineY);
        ctx.lineWidth = Math.max(2, fontSize * 0.06);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
});
