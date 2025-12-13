import React, { useState } from 'react';
import { apiFetch } from '../api';

function DocumentDetails({ doc, onBack }) {
  const [currentDoc, setCurrentDoc] = useState(doc);

  // Helper to refresh data (e.g. after escalation)
  const refreshDoc = async () => {
    try {
      const updated = await apiFetch(`/api/documents/${doc._id}`);
      setCurrentDoc(updated);
    } catch (err) {
      console.error("Failed to refresh doc", err);
    }
  };

  const handleEscalate = async () => {
    try {
      const res = await apiFetch("/api/escalations", {
        method: "POST",
        body: JSON.stringify({
          documentId: currentDoc._id,
          requesterEmail: "demo@user.com"
        })
      });
      alert(`Sent to lawyer! Case ID: ${res.escalationId}`);
      refreshDoc(); // Refresh to show new status
    } catch (err) {
      alert("Escalation failed: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'escalated': return '#ff9800'; // Orange
      case 'resolved': return '#4caf50'; // Green
      default: return '#2196f3'; // Blue
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>← Back to List</button>
        <div>
            <h1 style={{marginBottom: '5px'}}>{currentDoc.title}</h1>
            <span style={{ 
                background: getStatusColor(currentDoc.status), 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {currentDoc.status || 'Analyzed'}
            </span>
            <span style={{marginLeft: '15px', color: '#666', fontSize: '0.9rem'}}>
                Uploaded: {new Date(currentDoc.uploaded_at).toLocaleDateString()}
            </span>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* LEFT COL: DOCUMENT & REVISIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Original Text */}
            <div className="card">
                <h3>📄 Original Document</h3>
                <div style={{ 
                    background: '#f9f9f9', 
                    padding: '15px', 
                    borderRadius: '5px', 
                    maxHeight: '400px', 
                    overflowY: 'auto', 
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #eee'
                }}>
                    {currentDoc.text}
                </div>
            </div>

            {/* Lawyer Revisions (Only shows if Resolved) */}
            {currentDoc.revisions && currentDoc.revisions.length > 0 && (
                <div className="card" style={{ borderLeft: '5px solid #4caf50' }}>
                    <h3 style={{color: '#2e7d32'}}>⚖️ Lawyer's Fix</h3>
                    {currentDoc.revisions.map((rev, i) => (
                        <div key={i} style={{marginBottom: '15px'}}>
                            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Revised Clause:</div>
                            <div style={{background: '#e8f5e9', padding: '10px', borderRadius: '5px', fontStyle: 'italic'}}>
                                "{rev.revised_text}"
                            </div>
                            <div style={{marginTop: '10px', fontSize: '0.9rem', color: '#555'}}>
                                <strong>Lawyer Comment:</strong> {rev.comments}
                            </div>
                            <div style={{marginTop: '5px', fontSize: '0.8rem', color: '#999'}}>
                                - {rev.lawyerName}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* RIGHT COL: AI INSIGHTS */}
        <div className="editor-panel"> {/* Reusing editor styling for consistency */}
            <h3>🤖 AI Intelligence Report</h3>
            
            {/* Summary */}
            <div className="result-card">
                <h4>Summary</h4>
                <ul>
                    {currentDoc.analysis?.summary?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>

            {/* Flags */}
            <div className="result-card">
                <h4>Risk Assessment</h4>
                {currentDoc.analysis?.flags?.length === 0 
                    ? <span style={{color: 'green'}}>No risks detected.</span> 
                    : currentDoc.analysis?.flags?.map((f, i) => (
                        <div key={i} className="flag-tag" style={{display: 'block', marginBottom: '5px'}}>
                            ⚠️ {f}
                        </div>
                ))}
            </div>

            {/* Suggestion */}
            <div className="result-card highlight-box">
                <h4>AI Suggested Clause</h4>
                <p>{currentDoc.analysis?.suggested_clause}</p>
            </div>

            {/* Escalate Action */}
            {currentDoc.status !== 'escalated' && currentDoc.status !== 'resolved' && (
                <button 
                    className="btn btn-secondary btn-large" 
                    onClick={handleEscalate}
                    style={{ marginTop: '20px', width: '100%', background: '#ff9800', color: 'white' }}
                >
                    Escalate to Lawyer
                </button>
            )}

            {currentDoc.status === 'escalated' && (
                <div style={{marginTop: '20px', textAlign: 'center', color: '#ff9800', fontWeight: 'bold'}}>
                    ⏳ Pending Lawyer Review...
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default DocumentDetails;