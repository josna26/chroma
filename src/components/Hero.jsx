import "../styles/components/hero.css";

function Hero() {
  return (
    <main className="hero">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <section className="hero-content">

        <p className="tagline">
          AI Powered Color Palette Generator
        </p>

        <h1>
          Transform Ideas into
          <span> Beautiful Colors.</span>
        </h1>

        <p className="subtitle">
          Describe your idea and let AI create stunning,
          harmonious color palettes for your next design,
          website, artwork or brand.
        </p>

        <div className="prompt-box">

          <button
            className="hero-btn"
            onClick={() =>
              document
                .getElementById("prompt-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Creating →
          </button>

        </div>

      </section>

    </main>
  );
}

export default Hero;