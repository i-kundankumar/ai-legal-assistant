import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api'; 
import '../styles.css';

function UserPage({ onNavigate }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const data = await apiFetch('/api/documents');
        setDocuments(data);
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await apiFetch(`/api/documents/${id}`, { method: 'DELETE' });
      setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Documents</h1>
        {/* 1. KEEP THIS as 'editor' (Creation Mode) */}
        <button className="btn btn-primary" onClick={() => onNavigate('editor')}>
          <span className="icon">+</span> Upload New Document
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your documents...</div>
      ) : (
        <div className="cards-grid">
          {documents.length === 0 ? (
            <p>No documents found. Upload one to get started!</p>
          ) : (
            documents.map(doc => (
              // 2. 👇 CHANGE THIS to 'details' (Viewing Mode)
              <div key={doc._id} className="card card-hover" onClick={() => onNavigate('details', doc)}>
                <div className="card-header">
                  <h3>{doc.title}</h3>
                  <span className={`badge badge-${doc.status === 'escalated' ? 'warning' : (doc.status === 'resolved' ? 'success' : 'primary')}`}>
                   {doc.status ? doc.status.toUpperCase() : (doc.analysis ? 'ANALYZED' : 'PENDING')}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="card-meta">
                    <span className="icon">📄</span>
                    <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </div>
                  <p className="card-description">
                    {doc.analysis?.summary?.[0] || "Click to view analysis details..."}
                  </p>
                </div>
                
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn-link">View Details →</button>
                  
                  <button 
                    className="btn btn-sm" 
                    style={{ background: '#ff4d4d', color: 'white', border: 'none', marginLeft: '10px' }}
                    onClick={(e) => handleDelete(e, doc._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserPage;