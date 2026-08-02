import PaletteCard from "./PaletteCard";
import "../styles/components/palette-preview.css";

const demoPalette = [
  { role: "Primary", hex: "#7C3AED" },
  { role: "Secondary", hex: "#3B82F6" },
  { role: "Accent", hex: "#06B6D4" },
  { role: "Highlight", hex: "#EC4899" },
  { role: "Background", hex: "#F8FAFC" },
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