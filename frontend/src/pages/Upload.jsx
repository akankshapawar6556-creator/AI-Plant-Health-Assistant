import { useRef, useState } from "react";
import "./upload.css";

function Upload() {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid plant image.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setFileName(file.name);
    setSelectedFile(file);
    setResult(null);
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setFileName("");
    setSelectedFile(null);
    setResult(null);
  };

  const analyzePlant = async () => {
    if (!selectedFile) {
      alert("Please select a plant image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
      });

    } catch (error) {
      console.error(error);

      setResult({
        error:
          "Backend connection failed. Please make sure the Python server is running.",
      });

    } finally {
      setLoading(false);
    }
  };

  const formatPrediction = (prediction) => {
    if (!prediction) return "";

    return prediction
      .replace(/___/g, " - ")
      .replace(/_/g, " ");
  };

  const isHealthy =
    result?.prediction?.toLowerCase().includes("healthy");

  const recommendation = isHealthy
    ? "Your plant appears healthy. Continue proper watering, sunlight and regular monitoring."
    : "Remove badly affected leaves, maintain good air circulation and avoid watering the leaves directly.";

  return (
    <div className="upload-page">

      <div className="upload-header">
        <span>🌿 PlantCare AI</span>
        <p>AI-Powered Plant Health Assistant</p>
      </div>

      <div className="upload-container">

        <div className="upload-intro">
          <span className="upload-badge">
            🌱 PLANT HEALTH CHECK
          </span>

          <h1>
            Upload Your
            <span> Plant Image</span>
          </h1>

          <p>
            Upload a clear photo of your plant leaf and our AI
            will analyze it for possible diseases.
          </p>
        </div>

        <div
          className={`upload-box ${image ? "has-image" : ""}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >

          {!image ? (
            <>
              <div className="upload-icon">📷</div>

              <h2>Drop your plant image here</h2>

              <p>or choose an image from your device</p>

              <button
                className="browse-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Browse Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />

              <small>
                Supported formats: JPG, JPEG, PNG
              </small>
            </>
          ) : (
            <div className="preview-area">

              <img
                src={image}
                alt="Selected plant"
                className="plant-preview"
              />

              <p className="file-name">
                📄 {fileName}
              </p>

              <div className="preview-buttons">

                <button
                  className="change-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Image
                </button>

                <button
                  className="remove-btn"
                  onClick={removeImage}
                >
                  Remove
                </button>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />

            </div>
          )}

        </div>

        {image && (
          <>
            <button
              className="analyze-btn"
              onClick={analyzePlant}
              disabled={loading}
            >
              {loading
                ? "🔄 Analyzing..."
                : "🔍 Analyze Plant Health"}
            </button>

            {result && (
              <div className="analysis-result">

                {result.error ? (
                  <p>❌ {result.error}</p>
                ) : (
                  <>
                    <h2>🌱 AI Analysis Result</h2>

                    <p>
                      <strong>Plant / Disease:</strong>{" "}
                      {formatPrediction(result.prediction)}
                    </p>

                    <p>
                      <strong>📊 Confidence:</strong>{" "}
                      {result.confidence}%
                    </p>

                    {result.confidence < 60 && (
                      <p>
                        ⚠️ Confidence is low. Please upload a
                        clearer, well-lit leaf image for better
                        results.
                      </p>
                    )}

                    <div className="recommendation">
                      <h3>💡 Care Recommendation</h3>

                      <p>{recommendation}</p>
                    </div>
                  </>
                )}

              </div>
            )}
          </>
        )}

        <div className="upload-tips">

          <div>
            <span>💡</span>
            <div>
              <strong>Use a clear image</strong>
              <p>Make sure the leaf is clearly visible.</p>
            </div>
          </div>

          <div>
            <span>☀️</span>
            <div>
              <strong>Good lighting</strong>
              <p>Avoid very dark or blurry photos.</p>
            </div>
          </div>

          <div>
            <span>🌿</span>
            <div>
              <strong>Focus on the leaf</strong>
              <p>Capture the affected area clearly.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Upload;