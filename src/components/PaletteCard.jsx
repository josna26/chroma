import { useState } from "react";
import { Copy, Check } from "lucide-react";

import "../styles/components/palette-card.css";

function PaletteCard({ color, index }) {
    const { role, hex } = color;
    const [copied, setCopied] = useState(false);

    const copyColor = async () => {
        await navigator.clipboard.writeText(hex);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="palette-card">
            <div className="palette-inner">
                <div
                    className="palette-card"
                    style={{ animationDelay: `${index * 0.12}s` }}
                    onClick={copyColor}
                >
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

                    </div>
                </div>
            </div>

        </div>
    );
}

export default PaletteCard;