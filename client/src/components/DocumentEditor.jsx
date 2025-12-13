import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";

// 1. Accept 'initialData' prop
function DocumentEditor({ onBack, initialData }) {
  
  // 2. Initialize state with existing data if available
  const [formData, setFormData] = useState({
    title: initialData ? initialData.title : '',
    content: initialData ? initialData.text : '', // DB uses 'text', App uses 'content'
    category: 'contract'
  });
  
  const [analyzing, setAnalyzing] = useState(false);
  // 3. Load existing analysis immediately
    const [analysis, setAnalysis] = useState(initialData ? initialData.analysis : null);
    // Add this line with your other state variables
const [currentDocId, setCurrentDocId] = useState(initialData ? initialData._id : null);

  const handleAnalyze = async () => {
    if (!formData.title || !formData.content) return alert("Please enter a title and content.");

    setAnalyzing(true);
    setAnalysis(null);

    try {
      const data = await apiFetch("/api/documents", {
        method: "POST",
        body: JSON.stringify({ 
          title: formData.title, 
          text: formData.content, 
          userEmail: "demo@user.com" 
        }),
      });

      // ✅ FIX: Save the ID from the response!
      setCurrentDocId(data._id); 
      setAnalysis(data.analysis); 
      
    } catch (err) {
      console.error(err);
      alert("Connection Failed! Is the server running?");
    }
    setAnalyzing(false);
    };
    
    

  const handleEscalate = async () => {
    // ✅ FIX: Use currentDocId (which covers both new and saved docs)
    const docIdToSend = currentDocId; 

    if(!docIdToSend) return alert("Error: No Document ID found. Try saving first.");

    try {
      const res = await apiFetch("/api/escalations", {
        method: "POST",
        body: JSON.stringify({
          documentId: docIdToSend,
          // We don't strictly need analysisId if we have the documentId
          requesterEmail: "demo@user.com"
        })
      });
      alert(`Sent to lawyer! Case ID: ${res.escalationId}`);
    } catch (err) {
      alert("Escalation failed: " + err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        {onBack && (
          <button className="btn-back" onClick={onBack}>← Back</button>
        )}
        <h1>{initialData ? 'View Analysis' : 'New Document Analysis'}</h1>
      </div>

      <div className="editor-layout">
        <div className="editor-panel">
          <div className="form-group">
            <label>Document Title</label>
            <input
              type="text"
              className="input"
              placeholder="Enter document title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              // Disable editing if viewing a saved doc (Optional)
              disabled={!!initialData} 
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              placeholder="Paste document content here..."
              rows="12"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={!!initialData}
            />
          </div>

          {!initialData && (
            <button
              className="btn btn-primary btn-large"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : '🤖 Analyze Document'}
            </button>
          )}
        </div>

        <div className="info-panel">
          {analysis ? (
            <div className="results-container">
              <h3>Analysis Results</h3>
              <div className="result-card">
                <h4>Summary</h4>
                <ul>
                  {analysis.summary?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="result-card">
                <h4>Risk Flags</h4>
                <div>
                  {analysis.flags?.length === 0 
                    ? <span style={{color: 'green'}}>No risks detected.</span> 
                    : analysis.flags?.map((f, i) => (
                      <span key={i} className="flag-tag">⚠️ {f}</span>
                  ))}
                </div>
              </div>

              <div className="result-card highlight-box">
                <h4>Suggested Clause</h4>
                <p>{analysis.suggested_clause}</p>
              </div>

              <button 
                className="btn btn-secondary btn-large" 
                onClick={handleEscalate}
                style={{ marginTop: '15px', width: '100%', background: '#e67e22', color: 'white' }}
              >
                Escalate to Lawyer
              </button>
            </div>
          ) : (
            <>
              <h3>AI Analysis Tips</h3>
               {/* Tips section ... */}
               <p>Upload a document to see AI insights here.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentEditor;