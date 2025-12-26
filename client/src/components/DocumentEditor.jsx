import React, { useState } from "react";
import { apiFetch } from "../api";
import "../styles.css";

function DocumentEditor({ onBack, initialData = null }) {
  // ✅ Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Form state (supports new + existing docs)
  const [formData, setFormData] = useState({
    title: initialData ? initialData.title : "",
    content: initialData ? initialData.text : "",
    category: initialData?.category || "contract",
  });

  const [analyzing, setAnalyzing] = useState(false);

  // ✅ Analysis + document tracking
  const [analysis, setAnalysis] = useState(
    initialData ? initialData.analysis : null
  );
  const [currentDocId, setCurrentDocId] = useState(
    initialData ? initialData._id : null
  );

  // =========================
  // ANALYZE DOCUMENT
  // =========================
  const handleAnalyze = async () => {
    if (!formData.title || !formData.content) {
      return alert("Please enter a title and document content.");
    }

    setAnalyzing(true);

    try {
      const data = await apiFetch("/api/documents", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          text: formData.content,
          category: formData.category,
          userEmail: user.email, // ✅ REAL USER
        }),
      });

      // Save returned document + analysis
      setCurrentDocId(data._id);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze document.");
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================
  // ESCALATE TO LAWYER
  // =========================
  const handleEscalate = async () => {
    if (!currentDocId) {
      return alert("Please analyze the document first.");
    }

    try {
      const res = await apiFetch("/api/escalations", {
        method: "POST",
        body: JSON.stringify({
          documentId: currentDocId,
          requesterEmail: user.email, // ✅ REAL USER
        }),
      });

      alert(`Sent to lawyer successfully!\nCase ID: ${res.escalationId}`);
    } catch (err) {
      alert("Escalation failed: " + err.message);
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        {onBack && (
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
        )}
        <h1>{initialData ? "Document Analysis" : "New Document Analysis"}</h1>
      </div>

      <div className="editor-layout">
        {/* LEFT PANEL */}
        <div className="editor-panel">
          <div className="form-group">
            <label>Document Title</label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={!!initialData}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={!!initialData}
            >
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="nda">NDA</option>
            </select>
          </div>

          <div className="form-group">
            <label>Document Content</label>
            <textarea
              className="textarea"
              rows="12"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              disabled={!!initialData}
            />
          </div>

          {!initialData && (
            <button
              className="btn btn-primary btn-large"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "🤖 Analyze Document"}
            </button>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="info-panel">
          {analysis ? (
            <div className="results-container">
              <h3>Analysis Results</h3>

              <div className="result-card">
                <h4>Summary</h4>
                <ul>
                  {analysis.summary?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card">
                <h4>Risk Flags</h4>
                <div>
                  {analysis.flags?.length ? (
                    analysis.flags.map((f, i) => (
                      <span key={i} className="flag-tag">
                        ⚠️ {f}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "green" }}>
                      No risks detected.
                    </span>
                  )}
                </div>
              </div>

              <div className="result-card highlight-box">
                <h4>Suggested Clause</h4>
                <p>{analysis.suggested_clause}</p>
              </div>

              <button
                className="btn btn-secondary btn-large"
                onClick={handleEscalate}
                style={{
                  marginTop: "15px",
                  width: "100%",
                  background: "#e67e22",
                  color: "white",
                }}
              >
                Escalate to Lawyer
              </button>
            </div>
          ) : (
            <div>
              <h3>AI Analysis Tips</h3>
              <p>
                Upload a legal document to receive summaries, risk flags,
                and suggested improvements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentEditor;
