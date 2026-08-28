export async function generatePalette(prompt) {
    const response = await fetch(
        "http://localhost:3001/api/generate-palette",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.error || "Failed to generate palette."
        );

        error.status = response.status;

        throw error;
    }

    return data.palette;
}