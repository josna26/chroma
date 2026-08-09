import { useEffect, useState } from "react";
import {
    Copy,
    Check,
    SlidersHorizontal,
    RotateCcw
} from "lucide-react";

import {
    getContrastRating,
    getContrastRatio
} from "../utils/colorUtils";

import "../styles/components/palette-card.css";

function hexToHsl(hex) {
    const cleanHex = hex.replace("#", "");

    const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;
    const difference = max - min;

    if (difference !== 0) {
        s =
            l > 0.5
                ? difference / (2 - max - min)
                : difference / (max + min);

        switch (max) {
            case r:
                h =
                    ((g - b) / difference) +
                    (g < b ? 6 : 0);
                break;

            case g:
                h =
                    ((b - r) / difference) + 2;
                break;

            case b:
                h =
                    ((r - g) / difference) + 4;
                break;

            default:
                break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c =
        (1 - Math.abs(2 * l - 1)) * s;

    const x =
        c * (
            1 -
            Math.abs((h / 60) % 2 - 1)
        );

    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    const toHex = value =>
        Math.round((value + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function PaletteCard({ color, index, setPalette }) {
    const {
        hex,
        rgb,
        hsl,
        role
    } = color;

    const [editing, setEditing] = useState(false);
    const [copied, setCopied] = useState(false);

    const [originalColor, setOriginalColor] = useState(hex);

    const [hslValues, setHslValues] = useState(
        () => hexToHsl(hex)
    );

    /*
     * Keep the editor synchronized with
     * the actual palette color.
     */
    useEffect(() => {
        setHslValues(hexToHsl(hex));
    }, [hex]);

    const contrast =
        getContrastRatio(hex, "#0F172A");

    const rating =
        getContrastRating(contrast);

    const updatePaletteColor = newHex => {
        setPalette(currentPalette => {
            const updatedPalette = [...currentPalette];

            updatedPalette[index] = newHex;

            return updatedPalette;
        });
    };

    const updateFromHsl = values => {
        setHslValues(values);

        const newHex = hslToHex(
            values.h,
            values.s,
            values.l
        );

        updatePaletteColor(newHex);
    };

    const handleHueChange = event => {
        updateFromHsl({
            ...hslValues,
            h: Number(event.target.value)
        });
    };

    const handleSaturationChange = event => {
        updateFromHsl({
            ...hslValues,
            s: Number(event.target.value)
        });
    };

    const handleLightnessChange = event => {
        updateFromHsl({
            ...hslValues,
            l: Number(event.target.value)
        });
    };

    const handleNativeColorChange = event => {
        const newHex =
            event.target.value.toUpperCase();

        const newHsl =
            hexToHsl(newHex);

        setHslValues(newHsl);
        updatePaletteColor(newHex);
    };

    const openEditor = event => {
        event.stopPropagation();

        setOriginalColor(hex);
        setHslValues(hexToHsl(hex));
        setEditing(true);
    };

    const resetColor = event => {
        event.stopPropagation();

        setHslValues(
            hexToHsl(originalColor)
        );

        updatePaletteColor(originalColor);
    };

    const closeEditor = event => {
        event.stopPropagation();

        setEditing(false);
    };

    const copyColor = async event => {
        event.stopPropagation();

        await navigator.clipboard.writeText(hex);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div
            className={`palette-card ${
                editing ? "is-editing" : ""
            }`}
            style={{
                animationDelay:
                    `${index * 0.12}s`
            }}
        >
            <div className="palette-inner">

                {/* COLOR PREVIEW */}

                <div
                    className="color-preview"
                    style={{
                        backgroundColor: hex
                    }}
                />

                <div className="color-info">

                    {/* ROLE */}

                    <p>{role}</p>

                    {/* HEX + COPY */}

                    <div className="color-row">

                        <h3>{hex}</h3>

                        <button
                            type="button"
                            className="copy-status"
                            onClick={copyColor}
                        >
                            {copied ? (
                                <>
                                    <Check size={18} />
                                    <span>
                                        Copied!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    <span>
                                        Copy
                                    </span>
                                </>
                            )}
                        </button>

                    </div>

                    {/* RGB + HSL */}

                    <div className="color-details">
                        <span>{rgb}</span>
                        <span>{hsl}</span>
                    </div>

                    {/* CONTRAST */}

                    <div className="contrast-info">
                        <span>
                            Contrast
                        </span>

                        <strong>
                            {contrast.toFixed(2)} : 1
                        </strong>

                        <em
                            className={
                                `contrast-${rating.level}`
                            }
                        >
                            {rating.label}
                        </em>
                    </div>

                    {/* =====================
                        ADJUST BUTTON
                    ===================== */}

                    {!editing && (
                        <button
                            type="button"
                            className="adjust-color-button"
                            onClick={openEditor}
                        >
                            <SlidersHorizontal
                                size={15}
                            />

                            Adjust color
                        </button>
                    )}

                    {/* =====================
                        EDITOR
                    ===================== */}

                    {editing && (
                        <div
                            className="color-editor"
                            onClick={event =>
                                event.stopPropagation()
                            }
                        >

                            <div className="editor-header">

                                <div>
                                    <span>
                                        COLOR ADJUSTMENT
                                    </span>

                                    <strong>
                                        Tune this color
                                    </strong>
                                </div>

                                <input
                                    type="color"
                                    value={hex}
                                    onChange={
                                        handleNativeColorChange
                                    }
                                />

                            </div>

                            <div className="editor-controls">

                                {/* HUE */}

                                <label>
                                    <div className="slider-label">
                                        <span>
                                            Hue
                                        </span>

                                        <strong>
                                            {hslValues.h}°
                                        </strong>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={hslValues.h}
                                        onChange={
                                            handleHueChange
                                        }
                                        className="hue-slider"
                                    />
                                </label>

                                {/* SATURATION */}

                                <label>
                                    <div className="slider-label">
                                        <span>
                                            Saturation
                                        </span>

                                        <strong>
                                            {hslValues.s}%
                                        </strong>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={hslValues.s}
                                        onChange={
                                            handleSaturationChange
                                        }
                                        className="saturation-slider"
                                    />
                                </label>

                                {/* LIGHTNESS */}

                                <label>
                                    <div className="slider-label">
                                        <span>
                                            Lightness
                                        </span>

                                        <strong>
                                            {hslValues.l}%
                                        </strong>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={hslValues.l}
                                        onChange={
                                            handleLightnessChange
                                        }
                                        className="lightness-slider"
                                    />
                                </label>

                            </div>

                            <div className="editor-footer">

                                <button
                                    type="button"
                                    className="reset-color-button"
                                    onClick={
                                        resetColor
                                    }
                                >
                                    <RotateCcw
                                        size={14}
                                    />

                                    Reset
                                </button>

                                <button
                                    type="button"
                                    className="done-color-button"
                                    onClick={
                                        closeEditor
                                    }
                                >
                                    Done
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default PaletteCard;