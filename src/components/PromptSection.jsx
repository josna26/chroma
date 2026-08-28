import { Sparkles, LoaderCircle, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

import "../styles/components/prompt-section.css";
import { examplePrompts } from "../constants/prompts";
import { generatePalette } from "../services/gemini";

function PromptSection({ setPalette }) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const colors = await generatePalette(prompt);

            setPalette(colors);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        } catch (error) {
            console.error(error);

            if (
                error?.status === 429 ||
                error?.message?.toLowerCase().includes("rate limit")
            ) {
                setError(
                    "Chroma needs a moment ✨ Try again in a few seconds."
                );
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
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
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        setError("");
                    }}
                    placeholder="Example: A dreamy lavender sunset over snowy mountains..."
                    disabled={loading}
                />

                <div className="example-prompts">
                    {examplePrompts.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => {
                                if (!loading) {
                                    setPrompt(item);
                                    setError("");
                                }
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loading}
                    className={loading ? "generating" : ""}
                >
                    {loading ? (
                        <>
                            <LoaderCircle size={18} className="spinner" />
                            Generating Palette...
                        </>
                    ) : success ? (
                        <>
                            <Check size={18} />
                            Palette Generated
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Generate Palette
                        </>
                    )}
                </button>

                {error && (
                    <div className="prompt-error">
                        <AlertCircle size={17} />
                        <span>{error}</span>
                    </div>
                )}

            </div>
        </section>
    );
}

export default PromptSection;