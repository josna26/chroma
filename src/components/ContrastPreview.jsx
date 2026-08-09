function ContrastPreview({ background, foreground, ratio }) {
    return (
        <div
            className="contrast-preview"
            style={{
                backgroundColor: background,
                color: foreground
            }}
        >
            <div className="preview-header">
                <span>CHROMA</span>
                <span>Design Preview</span>
            </div>

            <div className="preview-content">

                <p className="preview-label">
                    COLOR SYSTEM
                </p>

                <h3>
                    Designed with contrast.
                </h3>

                <p className="preview-description">
                    See how your palette can work inside
                    a real interface.
                </p>

                <button
                    className="preview-button"
                    style={{
                        backgroundColor: foreground,
                        color: background
                    }}
                >
                    Get Started
                </button>

                <div className="preview-footer">
                    <span>✓ Accessible pairing</span>

                    <strong>
                        {ratio.toFixed(2)} : 1
                    </strong>
                </div>

            </div>
        </div>
    );
}

export default ContrastPreview;