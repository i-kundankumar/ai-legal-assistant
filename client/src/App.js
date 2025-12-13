import React, { useState } from "react";
import UserPage from "./pages/UserPage";
import DocumentEditor from "./components/DocumentEditor";
import LawyerDashboard from "./pages/LawyerDashboard";
import DocumentDetails from "./components/DocumentDetails"; // 1. IMPORT THIS
import "./index.css";
import "./styles.css";

function App() {
  const [activeView, setActiveView] = useState('user');
  const [currentPage, setCurrentPage] = useState('list');

  // 2. NEW STATE: To hold the specific document when clicking "View Details"
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 3. UPDATE: Accept 'data' argument
  const handleNavigate = (page, data = null) => {
    setSelectedDoc(data); // Save the document to state
    setCurrentPage(page);
  };

  const handleBack = () => {
    setSelectedDoc(null); // Clear selection on back
    setCurrentPage('list');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚖️</span>
            <span className="logo-text">LegalAI</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Main</div>
            <button
              className={`nav-item ${activeView === 'user' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('user');
                setCurrentPage('list');
              }}
            >
              <span className="nav-icon">📁</span>
              <span>My Documents</span>
            </button>
            <button
              className={`nav-item ${activeView === 'lawyer' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('lawyer');
                setCurrentPage('list');
              }}
            >
              <span className="nav-icon">⚖️</span>
              <span>Lawyer Dashboard</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{activeView === 'user' ? 'U' : 'L'}</div>
            <div className="user-info">
              <div className="user-name">Demo Account</div>
              <div className="user-role">{activeView === 'user' ? 'Client' : 'Lawyer'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${activeView === 'user' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('user');
              setCurrentPage('list');
            }}
          >
            👤 User View
          </button>
          <button
            className={`toggle-btn ${activeView === 'lawyer' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('lawyer');
              setCurrentPage('list');
            }}
          >
            👨‍⚖️ Lawyer View
          </button>
        </div>

        {/* ROUTING LOGIC */}
        {activeView === 'user' && (
          <>
            {/* 1. LIST VIEW */}
            {currentPage === 'list' && (
              <UserPage onNavigate={handleNavigate} />
            )}

            {/* 2. CREATION VIEW (Editor) */}
            {currentPage === 'editor' && (
              <DocumentEditor onBack={handleBack} initialData={null} />
            )}

            {/* 3. DETAILS VIEW (Dashboard) - THIS WAS MISSING */}
            {currentPage === 'details' && (
              <DocumentDetails doc={selectedDoc} onBack={handleBack} />
            )}
          </>
        )}

        {/* LAWYER VIEW */}
        {activeView === 'lawyer' && (
          <LawyerDashboard />
        )}

      </main>
    </div>
  );
}

export default App;