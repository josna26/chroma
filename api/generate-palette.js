import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed."
        });
    }

    try {
        const { prompt } = req.body || {};

        if (
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {
            return res.status(400).json({
                error: "Prompt is required."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `
You are a professional color designer.

Generate a harmonious 5-color color palette based on this description:

"${prompt}"

Return ONLY valid JSON.

Return exactly this structure:

[
    {
        "hex": "#RRGGBB",
        "role": "Background"
    },
    {
        "hex": "#RRGGBB",
        "role": "Primary"
    },
    {
        "hex": "#RRGGBB",
        "role": "Secondary"
    },
    {
        "hex": "#RRGGBB",
        "role": "Accent"
    },
    {
        "hex": "#RRGGBB",
        "role": "Highlight"
    }
]

Rules:
- hex must ALWAYS be a string.
- hex must ALWAYS be a valid 6-digit hexadecimal color beginning with #.
- role must ALWAYS be a string.
- Do not add rgb, hsl, descriptions, names, or other properties.
- Do not include markdown.
- Do not include code fences.
- Do not include explanations.
`
        });

        let text = response.text.trim();

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const palette = JSON.parse(text);

        if (
            !Array.isArray(palette) ||
            palette.length !== 5
        ) {
            throw new Error(
                "Gemini returned an invalid palette."
            );
        }

        const validRoles = [
            "Background",
            "Primary",
            "Secondary",
            "Accent",
            "Highlight"
        ];

        const isValidHex = (value) =>
            typeof value === "string" &&
            /^#[0-9A-Fa-f]{6}$/.test(value);

        const isValidPalette = palette.every(
            (color, index) =>
                color &&
                typeof color === "object" &&
                isValidHex(color.hex) &&
                color.role === validRoles[index]
        );

        if (!isValidPalette) {
            console.error(
                "Invalid Gemini palette:",
                palette
            );

            throw new Error(
                "Gemini returned an invalid palette format."
            );
        }

        const normalizedPalette = palette.map(
            (color) => ({
                hex: color.hex.toUpperCase(),
                role: color.role
            })
        );

        return res.status(200).json({
            palette: normalizedPalette
        });

    } catch (error) {
        console.error(
            "Palette generation error:",
            error
        );

        if (
            error?.status === 429 ||
            error?.message?.includes("429")
        ) {
            return res.status(429).json({
                error: "Rate limit exceeded."
            });
        }

        return res.status(500).json({
            error: "Failed to generate palette."
        });
    }
}