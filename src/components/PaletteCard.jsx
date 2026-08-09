import { useState, useRef } from "react";
import {
    Copy,
    Check,
    Palette,
    RotateCcw
} from "lucide-react";

import {
    getContrastRating,
    getContrastRatio,
    hexToRgb,
    rgbToHsl
} from "../utils/colorUtils";

import "../styles/components/palette-card.css";

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
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

    const toHex = (value) =>
        Math.round((value + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function PaletteCard({ color, index, setPalette }) {
    const { hex, rgb, hsl, role } = color;

    /*
     * Capture the original generated color once.
     * This is what Reset should return to.
     */
    const originalHex = useRef(hex);

    const { r, g, b } = hexToRgb(hex);
    const initialHsl = rgbToHsl(r, g, b);

    const originalHsl = useRef(initialHsl);

    const contrast = getContrastRatio(hex, "#0F172A");
    const rating = getContrastRating(contrast);

    const [editing, setEditing] = useState(false);

    const [hue, setHue] = useState(
        originalHsl.current.h
    );

    const [saturation, setSaturation] = useState(
        originalHsl.current.s
    );

    const [lightness, setLightness] = useState(
        originalHsl.current.l
    );

    const [copied, setCopied] = useState(false);

    const updateColor = (
        newHue,
        newSaturation,
        newLightness
    ) => {
        const newHex = hslToHex(
            newHue,
            newSaturation,
            newLightness
        );

        setHue(newHue);
        setSaturation(newSaturation);
        setLightness(newLightness);

        setPalette((currentPalette) =>
            currentPalette.map(
                (currentColor, currentIndex) =>
                    currentIndex === index
                        ? newHex
                        : currentColor
            )
        );
    };

    const handleHueChange = (event) => {
        const value = Number(event.target.value);

        updateColor(
            value,
            saturation,
            lightness
        );
    };

    const handleSaturationChange = (event) => {
        const value = Number(event.target.value);

        updateColor(
            hue,
            value,
            lightness
        );
    };

    const handleLightnessChange = (event) => {
        const value = Number(event.target.value);

        updateColor(
            hue,
            saturation,
            value
        );
    };

    const resetColor = () => {
        /*
         * Restore the exact original HEX.
         */
        const originalColor = originalHex.current;

        const {
            r,
            g,
            b
        } = hexToRgb(originalColor);

        const resetHsl = rgbToHsl(r, g, b);

        setHue(resetHsl.h);
        setSaturation(resetHsl.s);
        setLightness(resetHsl.l);

        setPalette((currentPalette) =>
            currentPalette.map(
                (currentColor, currentIndex) =>
                    currentIndex === index
                        ? originalColor
                        : currentColor
            )
        );
    };

    const copyColor = async (event) => {
        event.stopPropagation();

        await navigator.clipboard.writeText(hex);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const toggleEditor = (event) => {
        event.stopPropagation();

        setEditing((current) => !current);
    };

    const handleDone = (event) => {
        event.stopPropagation();

        setEditing(false);
    };

    return (
        <div
            className={`palette-card ${
                editing ? "is-editing" : ""
            }`}
            style={{
                animationDelay: `${index * 0.12}s`
            }}
        >
            <div className="palette-inner">

                <div
                    className="color-preview"
                    style={{
                        background: hex
                    }}
                />

                <div className="color-info">

                    <p>{role}</p>

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

                    <div className="color-details">

                        <span>
                            {rgb}
                        </span>

                        <span>
                            {hsl}
                        </span>

                    </div>

                    <div className="contrast-info">

                        <span>
                            Contrast
                        </span>

                        <strong>
                            {contrast.toFixed(2)} : 1
                        </strong>

                        <em
                            className={`contrast-${rating.level}`}
                        >
                            {rating.label}
                        </em>

                    </div>

                    <button
                        type="button"
                        className="adjust-color-button"
                        onClick={toggleEditor}
                    >
                        <Palette size={15} />

                        <span>
                            {editing
                                ? "Close"
                                : "Adjust"}
                        </span>
                    </button>

                </div>

            </div>

            {editing && (
                <div
                    className="color-editor"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <div className="editor-header">

                        <div>

                            <span>
                                COLOR ADJUSTMENT
                            </span>

                            <strong>
                                {hex}
                            </strong>

                        </div>

                        <input
                            type="color"
                            value={hex}
                            onChange={(event) => {

                                const newHex =
                                    event.target.value;

                                const {
                                    r,
                                    g,
                                    b
                                } = hexToRgb(newHex);

                                const newHsl =
                                    rgbToHsl(
                                        r,
                                        g,
                                        b
                                    );

                                updateColor(
                                    newHsl.h,
                                    newHsl.s,
                                    newHsl.l
                                );
                            }}
                        />

                    </div>

                    <div className="editor-controls">

                        <label>

                            <div className="slider-label">

                                <span>
                                    Hue
                                </span>

                                <strong>
                                    {hue}°
                                </strong>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={
                                    handleHueChange
                                }
                                className="hue-slider"
                            />

                        </label>

                        <label>

                            <div className="slider-label">

                                <span>
                                    Saturation
                                </span>

                                <strong>
                                    {saturation}%
                                </strong>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={saturation}
                                onChange={
                                    handleSaturationChange
                                }
                                className="saturation-slider"
                                style={{
                                    "--slider-color": hex
                                }}
                            />

                        </label>

                        <label>

                            <div className="slider-label">

                                <span>
                                    Lightness
                                </span>

                                <strong>
                                    {lightness}%
                                </strong>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={lightness}
                                onChange={
                                    handleLightnessChange
                                }
                                className="lightness-slider"
                                style={{
                                    "--slider-color": hex
                                }}
                            />

                        </label>

                    </div>

                    <div className="editor-footer">

                        <button
                            type="button"
                            className="reset-color-button"
                            onClick={resetColor}
                        >
                            <RotateCcw size={13} />

                            Reset
                        </button>

                        <button
                            type="button"
                            className="done-color-button"
                            onClick={handleDone}
                        >
                            <Check size={13} />

                            Done
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default PaletteCard;