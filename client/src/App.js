import React, { useState, useEffect } from "react";
import UserPage from "./pages/UserPage";
import DocumentEditor from "./components/DocumentEditor";
import LawyerDashboard from "./pages/LawyerDashboard";
import DocumentDetails from "./components/DocumentDetails";
import Login from "./pages/Login"; // ✅ IMPORT LOGIN
import "./index.css";
import "./styles.css";

function App() {
  // ✅ AUTH STATE (MUST BE INSIDE COMPONENT)
  const [user, setUser] = useState(null);

  const [activeView, setActiveView] = useState("user");
  const [currentPage, setCurrentPage] = useState("list");
  const [selectedDoc, setSelectedDoc] = useState(null);

  // ✅ LOAD USER FROM LOCALSTORAGE
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ AUTH GATE (MUST BE BEFORE JSX)
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // NAVIGATION HANDLERS
  const handleNavigate = (page, data = null) => {
    setSelectedDoc(data);
    setCurrentPage(page);
  };

  const handleBack = () => {
    setSelectedDoc(null);
    setCurrentPage("list");
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
              className={`nav-item ${activeView === "user" ? "active" : ""}`}
              onClick={() => {
                setActiveView("user");
                setCurrentPage("list");
              }}
            >
              📁 My Documents
            </button>

            <button
              className={`nav-item ${activeView === "lawyer" ? "active" : ""}`}
              onClick={() => {
                setActiveView("lawyer");
                setCurrentPage("list");
              }}
            >
              ⚖️ Lawyer Dashboard
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user.role === "lawyer" ? "L" : "U"}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeView === "user" && (
          <>
            {currentPage === "list" && (
              <UserPage onNavigate={handleNavigate} />
            )}

            {currentPage === "editor" && (
              <DocumentEditor onBack={handleBack} />
            )}

            {currentPage === "details" && (
              <DocumentDetails doc={selectedDoc} onBack={handleBack} />
            )}
          </>
        )}

        {activeView === "lawyer" && <LawyerDashboard />}
      </main>
    </div>
  );
}

export default App;
