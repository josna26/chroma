import { useState } from "react";
import { Copy, Check } from "lucide-react";

import "../styles/components/palette-card.css";

function PaletteCard({ color, index }) {
  const [copied, setCopied] = useState(false);

  const copyColor = async () => {
    await navigator.clipboard.writeText(color);

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
      <div
        className="color-preview"
        style={{ background: color }}
      ></div>

      <div className="color-info">
        <div className="color-header">
          <div>
            <p>Color</p>
            <h3>{color}</h3>
          </div>

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
  );
}

export default PaletteCard;