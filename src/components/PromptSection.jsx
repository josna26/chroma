import { Sparkles } from "lucide-react";
import "../styles/components/prompt-section.css";

function PromptSection() {
    return (
        <section className="prompt-section">
            <div className="prompt-container">

                <h2>Create a Palette with AI</h2>

                <p>
                    Describe a mood, aesthetic, object, place, or feeling.
                    Chroma will generate a matching color palette.
                </p>

                <textarea
                    placeholder="Example: A dreamy lavender sunset over snowy mountains..."
                ></textarea>

                <div className="example-prompts">
                    <span>Cyberpunk</span>
                    <span>Ocean Breeze</span>
                    <span>Vintage Cafe</span>
                    <span>Forest Cabin</span>
                    <span>Neon Tokyo</span>
                </div>

                <button>
                    <Sparkles size={18} />
                    Generate Palette
                </button>

            </div>
        </section>
    );
}

export default PromptSection;