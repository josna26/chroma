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