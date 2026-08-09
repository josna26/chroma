import { useState } from "react";

import Hero from "./components/Hero";
import PromptSection from "./components/PromptSection";
import PalettePreview from "./components/PalettePreview";
import PalettePlayground from "./components/PalettePlayground";

function App() {
    const [palette, setPalette] = useState([]);

    return (
        <>
            <Hero />

            <PromptSection setPalette={setPalette} />

            <PalettePreview
                palette={palette}
                setPalette={setPalette}
            />

            <PalettePlayground
                palette={palette}
                setPalette={setPalette}
            />
        </>
    );
}

export default App;