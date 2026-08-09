import { useState } from "react";

import Hero from "./components/Hero";
import PromptSection from "./components/PromptSection";
import PalettePreview from "./components/PalettePreview";

function App() {
    const [palette, setPalette] = useState([]);

    return (
        <>
            <Hero />
            <PromptSection setPalette={setPalette} />
            <PalettePreview palette={palette} />
        </>
    );
}

export default App;