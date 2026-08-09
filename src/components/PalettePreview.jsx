import PaletteCard from "./PaletteCard";
import "../styles/components/palette-preview.css";
import { getColorDetails } from "../utils/colorUtils";

function PalettePreview({ palette }) {
    const colorDetails = palette.map((color, index) =>
      getColorDetails(color, index)
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