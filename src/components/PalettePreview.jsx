import PaletteCard from "./PaletteCard";
import ContrastPreview from "./ContrastPreview";
import "../styles/components/palette-preview.css";
import {
    getColorDetails,
    findBestContrastPair
} from "../utils/colorUtils";

function PalettePreview({ palette }) {
    const colorDetails = palette.map((color, index) =>
        getColorDetails(color, index)
    );

    const bestPair = findBestContrastPair(palette);

    return (
        <section className="palette-preview">

            <h2>Palette Preview</h2>

            <p>
                Your generated colors will appear here.
            </p>

            {bestPair && (
                <div className="best-pair">

                    <div className="best-pair-header">
                        <span>Best Contrast Pair</span>

                        <strong>
                            {bestPair.ratio.toFixed(2)} : 1
                        </strong>
                    </div>

                    <ContrastPreview
                      background={bestPair.background}
                      foreground={bestPair.foreground}
                      ratio={bestPair.ratio}
                  />
                </div>
            )}

            <div className="palette-grid">

                {colorDetails.map((color, index) => (
                    <PaletteCard
                        key={color.hex}
                        color={color}
                        index={index}
                    />
                ))}

            </div>

        </section>
    );
}

export default PalettePreview;