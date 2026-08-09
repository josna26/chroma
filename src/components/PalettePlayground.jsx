import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

import "../styles/components/palette-playground.css";
import { getColorDetails, findBestContrastPair } from "../utils/colorUtils";
import { generateCSS, generateJSON, generateTailwind } from "../utils/exportUtils";

function PalettePlayground({ palette, setPalette }) {
    const [activeTab, setActiveTab] = useState("preview");
    const [format, setFormat] = useState("css");
    const [copied, setCopied] = useState(false);

    if (!palette.length) {
        return null;
    }

    const colorDetails = palette.map((color, index) =>
        getColorDetails(color, index)
    );

    const background = colorDetails.find(
        color => color.role === "Background"
    )?.hex;

    const primary = colorDetails.find(
        color => color.role === "Primary"
    )?.hex;

    const secondary = colorDetails.find(
        color => color.role === "Secondary"
    )?.hex;

    const accent = colorDetails.find(
        color => color.role === "Accent"
    )?.hex;

    const highlight = colorDetails.find(
        color => color.role === "Highlight"
    )?.hex;

    const bestPair = findBestContrastPair(palette);

    const output =
        format === "css"
            ? generateCSS(colorDetails)
            : format === "json"
                ? generateJSON(colorDetails)
                : generateTailwind(colorDetails);

    const copyOutput = async () => {
        await navigator.clipboard.writeText(output);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const downloadOutput = () => {
        const extension =
            format === "css"
                ? "css"
                : format === "json"
                    ? "json"
                    : "js";

        const filename =
            format === "css"
                ? "palette.css"
                : format === "json"
                    ? "palette.json"
                    : "tailwind.config.js";

        const mimeType =
            format === "json"
                ? "application/json"
                : format === "css"
                    ? "text/css"
                    : "text/javascript";

        const blob = new Blob(
            [output],
            { type: mimeType }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <section className="palette-playground">

            <div className="playground-header">

                <div>
                    <span className="playground-label">
                        Palette Playground
                    </span>

                    <h2>
                        See what your palette can become.
                    </h2>

                    <p>
                        Explore how your generated colors work
                        together in different design contexts.
                    </p>
                </div>

                <div className="playground-tabs">

                    <button
                        className={
                            activeTab === "preview"
                                ? "active"
                                : ""
                        }
                        onClick={() => setActiveTab("preview")}
                    >
                        UI Preview
                    </button>

                    <button
                        className={
                            activeTab === "contrast"
                                ? "active"
                                : ""
                        }
                        onClick={() => setActiveTab("contrast")}
                    >
                        Contrast
                    </button>

                    <button
                        className={
                            activeTab === "tokens"
                                ? "active"
                                : ""
                        }
                        onClick={() => setActiveTab("tokens")}
                    >
                        Color Tokens
                    </button>

                </div>

            </div>

            <div className="playground-content">

                {/* ============================= */}
                {/* UI PREVIEW */}
                {/* ============================= */}

                {activeTab === "preview" && (
                    <div
                        className="ui-preview"
                        style={{
                            backgroundColor: background,
                            color: highlight
                        }}
                    >

                        <div
                            className="preview-nav"
                            style={{
                                borderColor: `${highlight}33`
                            }}
                        >

                            <strong>
                                CHROMA
                            </strong>

                            <div>
                                <span>Explore</span>
                                <span>About</span>

                                <button
                                    style={{
                                        backgroundColor: primary,
                                        color: background
                                    }}
                                >
                                    Create
                                </button>
                            </div>

                        </div>

                        <div className="preview-hero">

                            <span
                                style={{
                                    color: accent
                                }}
                            >
                                COLOR SYSTEM
                            </span>

                            <h3>
                                Your palette,
                                <br />
                                brought to life.
                            </h3>

                            <p
                                style={{
                                    color: secondary
                                }}
                            >
                                A generated palette transformed
                                into a real interface.
                            </p>

                            <button
                                className="preview-main-button"
                                style={{
                                    backgroundColor: primary,
                                    color: background
                                }}
                            >
                                Explore Palette
                            </button>

                        </div>

                        <div className="preview-cards">

                            {[primary, accent, highlight].map(
                                (color, index) => (
                                    <div
                                        key={color}
                                        className="preview-card"
                                        style={{
                                            backgroundColor: `${color}18`,
                                            borderColor: `${color}55`
                                        }}
                                    >

                                        <div
                                            className="preview-dot"
                                            style={{
                                                backgroundColor: color
                                            }}
                                        ></div>

                                        <span>
                                            {
                                                [
                                                    "Primary",
                                                    "Accent",
                                                    "Highlight"
                                                ][index]
                                            }
                                        </span>

                                        <strong>
                                            {color}
                                        </strong>

                                    </div>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* ============================= */}
                {/* CONTRAST */}
                {/* ============================= */}

                {activeTab === "contrast" && bestPair && (
                    <div
                        className="contrast-playground"
                        style={{
                            backgroundColor: bestPair.background,
                            color: bestPair.foreground
                        }}
                    >
                        <div className="contrast-content">

                            <span className="contrast-label">
                                Best Contrast Pair
                            </span>

                            <h3>
                                Designed to work together.
                            </h3>

                            <p>
                                This pairing provides the strongest contrast
                                within your generated palette.
                            </p>

                            <div className="contrast-preview-box">

                                <span>
                                    Aa
                                </span>

                                <strong>
                                    {bestPair.ratio.toFixed(2)} : 1
                                </strong>

                            </div>

                            <div className="contrast-values">

                                <div>
                                    <span>Background</span>

                                    <strong>
                                        {bestPair.background}
                                    </strong>
                                </div>

                                <div>
                                    <span>Foreground</span>

                                    <strong>
                                        {bestPair.foreground}
                                    </strong>
                                </div>

                            </div>

                            <div className="contrast-status">

                                <span>
                                    WCAG Contrast
                                </span>

                                <strong>
                                    {bestPair.ratio >= 7
                                        ? "AAA"
                                        : bestPair.ratio >= 4.5
                                            ? "AA"
                                            : "Poor"}
                                </strong>

                            </div>

                        </div>
                    </div>
                )}

                {/* ============================= */}
                {/* COLOR TOKENS */}
                {/* ============================= */}

                {activeTab === "tokens" && (
                    <div className="tokens-playground">

                        <div className="tokens-header">

                            <div>
                                <span>
                                    DESIGN TOKENS
                                </span>

                                <h3>
                                    Your palette, ready to use.
                                </h3>
                            </div>

                            <div className="token-format-tabs">

                                <button
                                    className={
                                        format === "css"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        setFormat("css");
                                        setCopied(false);
                                    }}
                                >
                                    CSS
                                </button>

                                <button
                                    className={
                                        format === "json"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        setFormat("json");
                                        setCopied(false);
                                    }}
                                >
                                    JSON
                                </button>

                                <button
                                    className={
                                        format === "tailwind"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        setFormat("tailwind");
                                        setCopied(false);
                                    }}
                                >
                                    Tailwind
                                </button>

                            </div>

                        </div>

                        <div className="token-code">

                            <div className="code-header">

                                <span>
                                    {format === "css"
                                        ? "palette.css"
                                        : format === "json"
                                            ? "palette.json"
                                            : "tailwind.config.js"}
                                </span>

                                <button
                                    onClick={copyOutput}
                                >
                                    {copied ? (
                                        <>
                                            <Check size={14} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            Copy
                                        </>
                                    )}
                                </button>

                            </div>

                            <pre>
                                <code>
                                    {output}
                                </code>
                            </pre>

                        </div>

                        <div className="token-list">

                            {colorDetails.map((color) => (

                                <div
                                    className="token-item"
                                    key={color.hex}
                                >

                                    <div
                                        className="token-swatch"
                                        style={{
                                            backgroundColor: color.hex
                                        }}
                                    />

                                    <div className="token-info">

                                        <span>
                                            {color.role}
                                        </span>

                                        <strong>
                                            --{color.role
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}
                                        </strong>

                                    </div>

                                    <code>
                                        {color.hex}
                                    </code>

                                </div>

                            ))}

                        </div>

                        <button
                            className="download-tokens"
                            onClick={downloadOutput}
                        >
                            <Download size={15} />

                            Download{" "}
                            {format.toUpperCase()} file
                        </button>

                    </div>
                )}

            </div>

        </section>
    );
}

export default PalettePlayground;