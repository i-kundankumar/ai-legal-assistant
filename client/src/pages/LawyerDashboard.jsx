import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";

function LawyerDashboard() {
  // 1. STATE: Store real cases from MongoDB
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. STATE: For the "Review Mode"
  const [selectedCase, setSelectedCase] = useState(null);
  const [reviewData, setReviewData] = useState({ revised_clause: '', comments: '' });

  // 3. FETCH DATA ON LOAD
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await apiFetch('/api/escalations');
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. HANDLE "REVIEW" BUTTON CLICK
  const handleReview = async (kase) => {
    // Fetch the full original document text so lawyer can read it
    try {
      const doc = await apiFetch(`/api/documents/${kase.document_id}`);
      setSelectedCase({ ...kase, fullDocument: doc });
    } catch (err) {
      alert("Error loading document details");
    }
  };

  // 5. SUBMIT THE FIX BACK TO THE USER
  const handleSubmitReview = async () => {
    if (!selectedCase) return;
    try {
      await apiFetch(`/api/escalations/${selectedCase._id}/submit-review`, {
        method: 'POST',
        body: JSON.stringify({
          edited_clause: reviewData.revised_clause,
          comments: reviewData.comments,
          lawyerName: "Senior Partner"
        })
      });
      alert("Review Submitted!");
      setSelectedCase(null); // Close review panel
      setReviewData({ revised_clause: '', comments: '' });
      loadCases(); // Refresh table
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  };

  // --- IF REVIEWING, SHOW THE WORKSPACE ---
  if (selectedCase) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="btn-back" onClick={() => setSelectedCase(null)}>← Back to List</button>
          <h1>Reviewing: {selectedCase.document_title}</h1>
        </div>
        
        <div className="editor-layout">
            <div className="editor-panel">
                <label><strong>Original AI-Flagged Document:</strong></label>
                <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                    {selectedCase.fullDocument?.text || "Loading text..."}
                </div>

                <div className="form-group">
                    <label>Draft New Clause (Fix)</label>
                    <textarea 
                        className="textarea" 
                        rows="5"
                        placeholder="Type the corrected legal clause here..."
                        value={reviewData.revised_clause}
                        onChange={e => setReviewData({...reviewData, revised_clause: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Comments to Client</label>
                    <input 
                        className="input"
                        placeholder="E.g. 'I removed the uncapped liability...'"
                        value={reviewData.comments}
                        onChange={e => setReviewData({...reviewData, comments: e.target.value})}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSubmitReview}>✅ Submit & Resolve Case</button>
            </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD (YOUR TABLE) ---
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Escalated Cases</h1>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{cases.length}</span>
            <span className="stat-label">Total Cases</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{cases.filter(c => c.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? <p>Loading cases...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Client (Email)</th>
                <th>Document</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseItem => (
                <tr key={caseItem._id}>
                  <td>
                    <div className="client-info">
                      <div className="avatar" style={{background: '#3498db', color: 'white'}}>
                        {caseItem.requester_email.charAt(0).toUpperCase()}
                      </div>
                      <span>{caseItem.requester_email}</span>
                    </div>
                  </td>
                  <td>{caseItem.document_title}</td>
                  <td>
                    <span className={`badge badge-${caseItem.status === 'resolved' ? 'analyzed' : 'pending'}`}>
                      {caseItem.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(caseItem.created_at).toLocaleDateString()}</td>
                  <td>
                    {caseItem.status !== 'resolved' && (
                        <button className="btn btn-sm" onClick={() => handleReview(caseItem)}>
                            Review
                        </button>
                    )}
                    {caseItem.status === 'resolved' && (
                        <span style={{color: 'green'}}>✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LawyerDashboard;