import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { getContrastRating, getContrastRatio } from "../utils/colorUtils";
import "../styles/components/palette-card.css";

function PaletteCard({ color, index }) {
    const { hex, rgb, hsl, role } = color;

    const contrast = getContrastRatio(hex, "#0F172A");
    const rating = getContrastRating(contrast); 

    const [copied, setCopied] = useState(false);

    const copyColor = async () => {
        await navigator.clipboard.writeText(hex);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div
            className="palette-card"
            style={{ animationDelay: `${index * 0.12}s` }}
            onClick={copyColor}
        >
            <div className="palette-inner">

                <div
                    className="color-preview"
                    style={{ background: hex }}
                ></div>

                <div className="color-info">

                    <p>{role}</p>

                    <div className="color-row">

                        <h3>{hex}</h3>

                        <div className="copy-status">
                            {copied ? (
                                <>
                                    <Check size={18} />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    <span>Copy</span>
                                </>
                            )}
                        </div>

                    </div>

                    <div className="color-details">
                        <span>{rgb}</span>
                        <span>{hsl}</span>
                    </div>

                    <div className="contrast-info">
                        <span>Contrast</span>

                        <strong>
                            {contrast.toFixed(2)} : 1
                        </strong>

                        <em className={`contrast-${rating.level}`}>
                            {rating.label}
                        </em>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default PaletteCard;