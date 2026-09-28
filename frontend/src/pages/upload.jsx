import { useRef, useState } 
from "react";
import "./upload.css";

function Upload() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid plant image.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setFileName(file.name);
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
  };

  return (
    <div className="upload-page">

      <div className="upload-header">
        <span>🌿 PlantCare AI</span>
        <p>AI-Powered Plant Health Assistant</p>
      </div>

      <div className="upload-container">

        <div className="upload-intro">
          <span className="upload-badge">🌱 PLANT HEALTH CHECK</span>

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
          <button className="analyze-btn">
            🔍 Analyze Plant Health
          </button>
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