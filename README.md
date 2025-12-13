# 🧠 AI Legal Assistant

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-Visit_App-blue?style=for-the-badge)](https://ai-legal-assistant-xi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/i-kundankumar/ai-legal-assistant)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**AI Legal Assistant** is a web-based application that empowers everyday users to understand and review legal documents using AI. It analyzes contracts, agreements, and policies, highlights potential risks, explains complex clauses in plain language, and suggests improvements — all through an interactive, user-friendly interface.

> ⚠️ **Disclaimer:** This tool is for informational purposes only and does not replace professional legal advice.

---

## 🎯 Why This Project?

Legal documents are often filled with complex jargon that makes it difficult for non-lawyers to understand what they're signing. This application democratizes access to legal understanding by:

- Making legal language accessible to everyone
- Identifying hidden risks before signing
- Providing actionable suggestions for safer agreements
- Bridging the gap between AI assistance and human legal expertise

---

## 🚀 Key Features

### 📄 AI-Powered Document Analysis
- **Upload or paste** legal documents directly into the interface
- **Automatic detection** of risky, ambiguous, or one-sided clauses
- **Identifies critical elements:** obligations, termination terms, liability issues, payment clauses, and more
- **Risk scoring** to help prioritize what needs attention

### 🧾 Plain-Language Summaries
- Converts complex legal jargon into **easy-to-understand explanations**
- Breaks down each clause with context
- Helps non-lawyers make **informed decisions** before signing documents

### ✍️ Smart Clause Suggestions
- AI suggests **improved or safer alternative clauses**
- Provides balanced language alternatives
- Helps users understand how agreements can be made more equitable
- Shows side-by-side comparisons of original vs suggested text

### 🤝 Agentic AI Workflow
- AI **autonomously analyzes** documents with multi-step reasoning
- Interacts with users via **clarifying questions** when needed
- Can **escalate documents** for human (lawyer) review when complexity requires it
- Self-aware of its limitations and when expert review is necessary

### 👨‍⚖️ Lawyer Review Dashboard
- Lawyers can **log in to review escalated cases**
- Provide **final approval or edits** on AI-generated analysis
- Adds **human-in-the-loop trust** to AI analysis
- Creates a collaborative AI-human legal review process

---

## 🧩 Tech Stack

### Frontend
- **React.js** - Component-based UI architecture
- **Custom CSS** - Responsive and modern design
- **Vercel** - Fast, global CDN deployment

### Backend
- **Node.js** - Runtime environment
- **Express.js** - RESTful API framework
- **MongoDB Atlas** - Cloud database for document storage
- **JWT Authentication** - Secure user sessions

### AI & Intelligence
- **Google Gemini API** - Advanced document analysis and natural language processing
- **Agentic AI Architecture** - Autonomous multi-step reasoning and decision-making
- **Custom Prompt Engineering** - Optimized for legal document comprehension

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  React Frontend │ ← User Interface
└────────┬────────┘
         │ HTTPS/REST API
         ↓
┌─────────────────┐
│ Express Backend │ ← API Layer
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────────────┐
│MongoDB │ │ Gemini AI    │
│ Atlas  │ │ Processing   │
└────────┘ └──────────────┘
```

**Flow:**
1. **Frontend** handles user interaction and document submission
2. **Backend** orchestrates AI workflows, authentication, and data management
3. **AI models** analyze documents and generate insights
4. **MongoDB** stores documents, analysis results, user data, and review history

---

## 🧪 How It Works

1. **📤 Upload Document**  
   User uploads or pastes a legal document (PDF, DOC, or plain text)

2. **🔍 AI Analysis**  
   Gemini AI analyzes the content and flags key issues, risks, and obligations

3. **💡 Plain English Explanation**  
   Complex clauses are explained in simple, understandable language

4. **✨ Suggested Revisions**  
   AI generates improved, more balanced alternative clauses

5. **👨‍⚖️ Optional Lawyer Review**  
   User can request escalation for human legal expert review

6. **📊 Results Dashboard**  
   View comprehensive analysis with risk scores and recommendations

---

## 📌 Use Cases

| User Type | Use Case |
|-----------|----------|
| 💼 **Freelancers** | Review client contracts and service agreements |
| 🚀 **Startups** | Analyze vendor agreements and partnership contracts |
| 🏠 **Renters** | Understand lease terms and rental agreements |
| 📝 **Job Seekers** | Review employment contracts and NDAs |
| 🛍️ **Consumers** | Understand terms of service and subscription agreements |
| 🎓 **Students** | Learn about legal document structure and clauses |

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Gemini API key
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/i-kundankumar/ai-legal-assistant.git
cd ai-legal-assistant
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# CORS
CLIENT_URL=http://localhost:3000
```

### 3️⃣ Setup Frontend
```bash
cd ../client
npm install
```

Create `.env` file in client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4️⃣ Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
Client runs on `http://localhost:3000`

---

## 📁 Project Structure

```
ai-legal-assistant/
├── client/                      # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── DocumentUpload/
│   │   │   ├── AnalysisView/
│   │   │   └── LawyerDashboard/
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service calls
│   │   ├── utils/               # Helper functions
│   │   ├── styles/              # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                      # Express backend
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   └── reviewController.js
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js
│   │   ├── Document.js
│   │   └── Review.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── documents.js
│   │   └── reviews.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/                # Business logic
│   │   └── geminiService.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── vercel.json                  # Vercel deployment config
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # User login
GET    /api/auth/me             # Get current user
```

### Documents
```
POST   /api/documents/upload    # Upload document for analysis
GET    /api/documents           # Get user's documents
GET    /api/documents/:id       # Get specific document analysis
DELETE /api/documents/:id       # Delete document
```

### Reviews
```
POST   /api/reviews/escalate    # Escalate document for lawyer review
GET    /api/reviews              # Get all reviews (lawyer only)
PUT    /api/reviews/:id         # Update review status
```

---

## 🛡️ Security & Privacy

- ✅ **Secure API communication** with HTTPS
- ✅ **JWT-based authentication** for user sessions
- ✅ **Environment variables** for sensitive API keys
- ✅ **MongoDB Atlas** with role-based access control
- ✅ **No public document sharing** - all data is private
- ✅ **CORS protection** configured for trusted origins
- ✅ **Input validation** and sanitization on all endpoints

---

## 🎓 Agentic AI Workflow

This project implements an **agentic AI architecture** where the AI:

1. **Autonomously reasons** through multi-step document analysis
2. **Asks clarifying questions** when context is unclear
3. **Self-evaluates** its confidence in analysis
4. **Escalates to humans** when situations are complex or risky
5. **Learns from feedback** through the lawyer review process

This creates a trustworthy AI system that knows its limitations.

---

## 🏆 Project Highlights

- ✨ Real-world **legal-tech application**
- 🤖 Demonstrates **Agentic AI** capabilities
- 🏗️ Clean **frontend-backend separation**
- 📈 **Scalable architecture** for growth
- 🎯 Focus on **accessibility and trust**
- 💡 **Human-in-the-loop** design for safety

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas
- Add support for more document formats
- Implement multi-language support
- Create more sophisticated risk scoring
- Add document comparison features
- Improve UI/UX design

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Important Disclaimer

This application **does NOT provide legal advice**.

It is designed to:
- Assist users in understanding legal documents
- Identify potential concerns and risks
- Provide educational insights

**Always consult a qualified legal professional** for:
- Final decisions on legal matters
- Signing important contracts
- Situations involving significant risk or value

---

## 👨‍💻 Authors

**Kundan Kumar**

- GitHub: [@i-kundankumar](https://github.com/i-kundankumar)

**Debaditya Dasgupta**

- Github: [@Deba05](https://github.com/Deba05)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language understanding
- **MongoDB Atlas** for reliable cloud database
- **Vercel** for seamless deployment
- The open-source community for amazing tools and libraries
- Legal professionals who provided insights during development

---

## 📬 Contact & Support

- 🐛 **Found a bug?** [Open an issue](https://github.com/i-kundankumar/ai-legal-assistant/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/i-kundankumar/ai-legal-assistant/discussions)
- 📧 **Need help?** Reach out via email or GitHub

---

## ⭐ Show Your Support

If you found this project helpful or interesting, please:
- ⭐ **Star this repository**
- 🔄 **Share it with others**
- 🐦 **Tweet about it**

Your support motivates continued development!

---

<div align="center">

**Made with ❤️ to democratize legal understanding**

[🔗 Visit Live Demo](https://ai-legal-assistant-xi.vercel.app) | [📖 Documentation](https://github.com/i-kundankumar/ai-legal-assistant/wiki) | [🐛 Report Bug](https://github.com/i-kundankumar/ai-legal-assistant/issues)

</div>
