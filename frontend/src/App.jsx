import Upload from "./pages/Upload";
import "./App.css";

function App() {
  // Upload page
  if (window.location.pathname === "/upload") {
    return <Upload />;
  }

  // Go to Upload page
  const goToUpload = () => {
    window.location.href = "/upload";
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">🌿</span>
          <span>
            Plant<span>Care AI</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <button className="nav-btn" onClick={goToUpload}>
          Check Plant
        </button>

      </nav>


      {/* Hero Section */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="small-badge">
            🌱 AI-Powered Plant Health Assistant
          </div>

          <h1>
            Keep Your Plants
            <span> Healthy & Happy</span>
          </h1>

          <p>
            Upload a photo of your plant and let our AI assistant
            analyze its health, detect possible diseases and provide
            helpful care recommendations.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={goToUpload}
            >
              🔍 Check Plant Health
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                document.getElementById("features").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Explore Features →
            </button>

          </div>

          <div className="trust-text">
            ✓ Easy to use &nbsp;&nbsp;
            ✓ AI-based analysis &nbsp;&nbsp;
            ✓ Plant care guidance
          </div>

        </div>


        {/* Plant Visual */}
        <div className="hero-visual">

          <div className="circle-bg"></div>

          <div className="plant-card">

            <div className="plant-emoji">🌿</div>

            <div className="scan-line"></div>

            <div className="ai-badge">
              ✨ AI Ready
            </div>

          </div>


          <div className="floating-card top-card">

            <span>🌱</span>

            <div>
              <strong>Plant Health</strong>
              <small>AI Analysis</small>
            </div>

          </div>


          <div className="floating-card bottom-card">

            <span>✓</span>

            <div>
              <strong>Healthy Plant</strong>
              <small>Ready to check</small>
            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <span>WHAT WE OFFER</span>

          <h2>
            Smart Plant Care With AI
          </h2>

          <p>
            Simple tools to help you understand and care for your plants.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📷
            </div>

            <h3>
              Upload Plant Image
            </h3>

            <p>
              Upload a clear image of your plant leaf for AI-based analysis.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              AI Disease Detection
            </h3>

            <p>
              Our AI model will analyze the image and identify supported
              plant diseases.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              💡
            </div>

            <h3>
              Care Recommendations
            </h3>

            <p>
              Get useful information about symptoms, prevention and plant care.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Health History
            </h3>

            <p>
              Keep track of previous plant diagnosis and health information.
            </p>

          </div>

        </div>

      </section>


      {/* About */}
      <section className="about-section" id="about">

        <div className="about-icon">
          🌿
        </div>

        <div>

          <span>
            ABOUT PLANTCARE AI
          </span>

          <h2>
            Technology that helps
            <br />
            plants grow better.
          </h2>

          <p>
            PlantCare AI is designed to make plant health monitoring
            easier using artificial intelligence and image analysis.
            Simply upload a plant image and get an easy-to-understand
            health report.
          </p>

        </div>

      </section>


      {/* Footer */}
      <footer>

        <div className="logo">

          <span className="logo-icon">
            🌿
          </span>

          Plant<span>Care AI</span>

        </div>

        <p>
          AI-powered plant health assistance 🌱
        </p>

      </footer>

    </div>
  );
}

export default App;