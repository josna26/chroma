import PaletteCard from "./PaletteCard";
import "../styles/components/palette-preview.css";
import { getColorDetails } from "../utils/colorUtils";

function PalettePreview({ palette, setPalette }) {
    const colorDetails = palette.map((color, index) =>
        getColorDetails(color.hex, index, color.role)
    );

    return (
        <section className="palette-preview">

            <h2>Palette Preview</h2>

            <p>
                Your generated colors will appear here.
            </p>

            <div className="palette-grid">

                {colorDetails.map((color, index) => (
                    <PaletteCard
                        key={index}
                        color={color}
                        index={index}
                        setPalette={setPalette}
                    />
                ))}

            </div>

        </section>
    );
}

export default PalettePreview;