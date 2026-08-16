function getTokenName(color, index) {
    if (color.role) {
        return color.role
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    return `color-${index + 1}`;
}

export function generateCSS(palette) {
    const lines = palette.map((color, index) => {
        const name = getTokenName(color, index);

        return `    --${name}: ${color.hex};`;
    });

    return `:root {\n${lines.join("\n")}\n}`;
}

export function generateJSON(palette) {
    const tokens = {};

    palette.forEach((color, index) => {
        const name = getTokenName(color, index);

        tokens[name] = color.hex;
    });

    return JSON.stringify(tokens, null, 2);
}

export function generateTailwind(palette) {
    const colors = {};

    palette.forEach((color, index) => {
        const name = getTokenName(color, index);

        colors[name] = color.hex;
    });

    return `/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            colors: ${JSON.stringify(colors, null, 4)}
        }
    }
};`;
}

export function generateSVG(colorDetails) {
    const swatchWidth = 160;
    const swatchHeight = 180;

    const gap = 24;

    const sidePadding = 24;
    const topPadding = 24;

    const roleY = 225;
    const hexY = 250;

    const bottomPadding = 35;

    const totalWidth =
        colorDetails.length * swatchWidth +
        (colorDetails.length - 1) * gap +
        sidePadding * 2;

    const height =
        hexY +
        bottomPadding;

    const swatches = colorDetails
        .map((color, index) => {
            const x =
                sidePadding +
                index * (swatchWidth + gap);

            return `
        <g transform="translate(${x}, ${topPadding})">

            <rect
                x="0"
                y="0"
                width="${swatchWidth}"
                height="${swatchHeight}"
                rx="16"
                fill="${color.hex}"
            />

            <text
                x="0"
                y="${roleY}"
                font-family="Arial, Helvetica, sans-serif"
                font-size="16"
                font-weight="600"
                fill="#111827"
            >
                ${escapeXML(color.role)}
            </text>

            <text
                x="0"
                y="${hexY}"
                font-family="Arial, Helvetica, sans-serif"
                font-size="14"
                font-weight="500"
                fill="#6B7280"
            >
                ${escapeXML(color.hex)}
            </text>

        </g>
        `;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${totalWidth}"
    height="${height}"
    viewBox="0 0 ${totalWidth} ${height}"
>

    <rect
        width="100%"
        height="100%"
        fill="#FFFFFF"
    />

    ${swatches}

</svg>`;
}

function escapeXML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}