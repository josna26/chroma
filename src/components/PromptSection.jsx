import { Sparkles } from "lucide-react";
import { useState } from "react";

import "../styles/components/prompt-section.css";
import { examplePrompts } from "../constants/prompts";
import { generatePalette } from "../services/gemini";

function PromptSection() {
    const [prompt, setPrompt] = useState("");

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        try {
            const colors = await generatePalette(prompt);
            console.log(colors);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section id="prompt-section" className="prompt-section">
            <div className="prompt-container">

                <h2>Create a Palette with AI</h2>

                <p>
                    Describe a mood, aesthetic, object, place, or feeling.
                    Chroma will generate a matching color palette.
                </p>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: A dreamy lavender sunset over snowy mountains..."
                ></textarea>

                <div className="example-prompts">
                    {examplePrompts.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => setPrompt(item)}
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                >
                    <Sparkles size={18} />
                    Generate Palette
                </button>

            </div>
        </section>
    );
}

export default PromptSection;