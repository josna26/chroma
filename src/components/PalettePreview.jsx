import PaletteCard from "./PaletteCard";
import "../styles/components/palette-preview.css";

const demoPalette = [
  "#7C3AED",
  "#3B82F6",
  "#06B6D4",
  "#EC4899",
  "#F8FAFC",
];

function PalettePreview() {
  return (
    <section className="palette-preview">

      <h2>Palette Preview</h2>

      <p>
        Your generated colors will appear here.
      </p>

      <div className="palette-grid">

        {demoPalette.map((color, index) => (
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