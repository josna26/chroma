export function hexToRgb(hex) {
    const value = hex.replace("#", "");

    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);

    return { r, g, b };
}

export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    let s;

    const l = (max + min) / 2;

    if (max === min) {
        h = 0;
        s = 0;
    } else {
        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            default:
                h = (r - g) / d + 4;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

export function getColorDetails(hex, index) {
    const rgb = hexToRgb(hex);

    const hsl = rgbToHsl(
        rgb.r,
        rgb.g,
        rgb.b
    );

    return {
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        role: getColorRole(hex, index)
    };
}

export function getColorRole(hex, index) {
    const { r, g, b } = hexToRgb(hex);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (index === 0 && brightness < 80) {
        return "Background";
    }

    if (index === 0) {
        return "Primary";
    }

    if (index === 1) {
        return "Secondary";
    }

    if (index === 2) {
        return "Accent";
    }

    if (index === 3) {
        return "Highlight";
    }

    return "Supporting";
}

function getLuminance(r, g, b) {
    const values = [r, g, b].map((value) => {
        const channel = value / 255;

        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow(
                (channel + 0.055) / 1.055,
                2.4
            );
    });

    return (
        0.2126 * values[0] +
        0.7152 * values[1] +
        0.0722 * values[2]
    );
}

export function getContrastRatio(hex1, hex2) {
    const color1 = hexToRgb(hex1);
    const color2 = hexToRgb(hex2);

    const luminance1 = getLuminance(
        color1.r,
        color1.g,
        color1.b
    );

    const luminance2 = getLuminance(
        color2.r,
        color2.g,
        color2.b
    );

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRating(ratio) {
    if (ratio >= 7) {
        return {
            label: "AAA",
            level: "excellent"
        };
    }

    if (ratio >= 4.5) {
        return {
            label: "AA",
            level: "good"
        };
    }

    if (ratio >= 3) {
        return {
            label: "AA Large",
            level: "fair"
        };
    }

    return {
        label: "Poor",
        level: "poor"
    };
}