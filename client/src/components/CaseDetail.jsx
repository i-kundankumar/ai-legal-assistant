import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function CaseDetail({ caseData, onUpdate }) {
  const [fullDoc, setFullDoc] = useState(null);
  const [editClause, setEditClause] = useState("");

  useEffect(() => {
    // Fetch full document content when a case is selected
    apiFetch(`/api/documents/${caseData.document_id}`).then(d => {
      setFullDoc(d);
      // Default the edit box to the AI's suggestion
      setEditClause(d.analysis.suggested_clause);
    });
  }, [caseData]);

  const handleAccept = async () => {
    await apiFetch(`/api/escalations/${caseData._id}/accept`, {
      method: "POST",
      body: JSON.stringify({ lawyerId: "lawyer1", lawyerName: "Kundan (Lawyer)" })
    });
    alert("Case accepted!");
    onUpdate();
  };

  const handleSignOff = async () => {
    await apiFetch(`/api/escalations/${caseData._id}/submit-review`, {
      method: "POST",
      body: JSON.stringify({
        lawyerId: "lawyer1", 
        lawyerName: "Kundan (Lawyer)",
        edited_clause: editClause,
        comments: "Reviewed and approved."
      })
    });
    alert("Review submitted to client!");
    onUpdate();
  };

  if (!fullDoc) return <div>Loading doc...</div>;

  return (
    <div className="card">
      <h3>Case: {caseData.document_title}</h3>
      <p><strong>Status:</strong> {caseData.status}</p>

      <div style={{ background: '#f8f9fa', padding: '10px', maxHeight: '200px', overflowY: 'auto' }}>
        <strong>Original Text:</strong>
        <pre>{fullDoc.text}</pre>
      </div>

      <h4>AI Suggestion vs Lawyer Edit</h4>
      <div className="input-group">
        <textarea 
          value={editClause} 
          onChange={(e) => setEditClause(e.target.value)} 
        />
      </div>

      <div>
        {caseData.status === 'pending' && (
          <button className="primary" onClick={handleAccept}>Accept Case</button>
        )}
        {caseData.status === 'review_in_progress' && (
          <button className="primary" style={{ backgroundColor: '#10b981' }} onClick={handleSignOff}>
            Sign Off & Send to Client
          </button>
        )}
      </div>
    </div>
  );
}
