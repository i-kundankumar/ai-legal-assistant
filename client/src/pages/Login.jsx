import { useState } from "react";
import { apiFetch } from "../api";
import "../styles.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegister
        ? { name, email, password, role }
        : { email, password };

      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLogin(res.user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span>⚖️</span>
          <h2>LegalAI</h2>
        </div>

        <p className="login-subtitle">
          {isRegister ? "Create your account" : "Sign in to your workspace"}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>Name</label>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ROLE SELECTION */}
          <label>Login as</label>
          <div className="role-toggle">
            <button
              type="button"
              className={role === "user" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("user")}
            >
              👤 User
            </button>
            <button
              type="button"
              className={role === "lawyer" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("lawyer")}
            >
              ⚖️ Lawyer
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        {/* TOGGLE */}
        <div className="login-footer">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <b onClick={() => setIsRegister(false)}>Login</b>
            </span>
          ) : (
            <span>
              New here?{" "}
              <b onClick={() => setIsRegister(true)}>Create an account</b>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
