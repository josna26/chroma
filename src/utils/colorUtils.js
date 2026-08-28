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

export function assignColorRoles(colors) {
    const analyzed = colors.map((color, originalIndex) => {
        const hex = color.hex;

        const { r, g, b } = hexToRgb(hex);
        const hsl = rgbToHsl(r, g, b);

        return {
            hex,
            originalIndex,
            ...hsl
        };
    });

    const remaining = [...analyzed];
    const roles = new Array(colors.length);

    const takeBest = (scoreFn, roleName) => {
        const winner = remaining.reduce((best, c) =>
            scoreFn(c) > scoreFn(best) ? c : best
        );

        roles[winner.originalIndex] = roleName;

        remaining.splice(
            remaining.indexOf(winner),
            1
        );
    };

    takeBest(
        (c) => c.l - c.s * 0.5,
        "Background"
    );

    takeBest(
        (c) => c.s - Math.abs(c.l - 50) * 0.6,
        "Primary"
    );

    takeBest(
        (c) => c.s * 0.6 + c.l * 0.4,
        "Highlight"
    );

    takeBest(
        (c) => c.s,
        "Secondary"
    );

    remaining.forEach((c) => {
        roles[c.originalIndex] = "Accent";
    });

    for (let i = 0; i < roles.length; i++) {
        if (!roles[i]) {
            roles[i] = "Supporting";
        }
    }

    return roles;
}

export function getColorDetails(hex, index, role) {
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
        role: role || getColorRole(hex, index)
    };
}

export function getColorRole(hex, index) {
    switch (index) {
        case 0:
            return "Background";

        case 1:
            return "Primary";

        case 2:
            return "Secondary";

        case 3:
            return "Accent";

        case 4:
            return "Highlight";

        default:
            return "Supporting";
    }
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

export function findBestContrastPair(colors) {
    let bestPair = null;
    let highestContrast = 0;

    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            const ratio = getContrastRatio(
                colors[i].hex,
                colors[j].hex
            );

            if (ratio > highestContrast) {
                highestContrast = ratio;

                bestPair = {
                    foreground: colors[i].hex,
                    background: colors[j].hex,
                    ratio
                };
            }
        }
    }

    return bestPair;
}