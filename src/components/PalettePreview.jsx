import PaletteCard from "./PaletteCard";
import "../styles/components/palette-preview.css";

function PalettePreview({ palette }) {
    return (
        <section className="palette-preview">

            <h2>Palette Preview</h2>

            <p>
                Your generated colors will appear here.
            </p>

            <div className="palette-grid">

                {palette.map((color, index) => (
                    <PaletteCard
                        key={color}
                        color={color}
                        index={index}
                    />
                ))}

            </div>

        </section>
    );
}

export default PalettePreview;