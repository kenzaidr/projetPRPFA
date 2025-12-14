import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SignupResponse {
  token?: string;
  message?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 Media screen logic
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: SignupResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur d'inscription");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Inscription réussie ! Redirection...");
      
      // Redirection après succès
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch {
      setMessage("Erreur serveur");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* ================= SPLIT LAYOUT ================= */}
      <div style={styles.container}>
        

        {/* RIGHT SIDE - Form */}
        <div style={styles.rightSide}>
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
            aria-label="Retour"
          >
            ← Retour
          </button>

          <div style={styles.formContainer}>
            {/* Mobile logo */}
            {isMobile && (
              <h1 style={styles.mobileLogo}>MMKH</h1>
            )}

            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Créer un compte</h2>
              <p style={styles.formSubtitle}>
                Commencez votre expérience de livraison
              </p>
            </div>

            <form onSubmit={handleSignup} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom complet</label>
                <input
                  type="text"
                  placeholder="Mohamed Alami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Adresse email</label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Inscription en cours..." : "Créer mon compte"}
              </button>
            </form>

            {message && (
              <div
                style={{
                  ...styles.message,
                  backgroundColor: message.includes("réussie")
                    ? "#e8f5e9"
                    : "#ffebee",
                  color: message.includes("réussie") ? "#2e7d32" : "#c62828",
                }}
              >
                {message}
              </div>
            )}

            <div style={styles.divider}>
              <span style={styles.dividerText}>ou</span>
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Vous avez déjà un compte ?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={styles.footerLink}
                >
                  Se connecter
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  container: {
    display: "flex",
    minHeight: "100vh",
  },

  /* ===== LEFT SIDE - BRANDING ===== */
  leftSide: {
    flex: 1,
    background: "linear-gradient(135deg, #006233 0%, #00843d 100%)",
    color: "#FFFFFF",
    padding: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  brandingContent: {
    maxWidth: "500px",
    zIndex: 1,
  },

  brandLogo: {
    fontSize: "48px",
    fontWeight: "900",
    letterSpacing: "3px",
    marginBottom: "30px",
  },

  brandTitle: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.2",
  },

  brandText: {
    fontSize: "18px",
    lineHeight: "1.6",
    opacity: 0.95,
    marginBottom: "50px",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },

  featureIcon: {
    fontSize: "28px",
  },

  featureText: {
    fontSize: "16px",
    fontWeight: "600",
  },

  /* ===== RIGHT SIDE - FORM ===== */
  rightSide: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    top: "30px",
    left: "30px",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "2px solid #006233",
    backgroundColor: "transparent",
    color: "#006233",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  formContainer: {
    width: "100%",
    maxWidth: "450px",
  },

  mobileLogo: {
    fontSize: "36px",
    fontWeight: "900",
    letterSpacing: "3px",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    marginBottom: "30px",
  },

  formHeader: {
    marginBottom: "40px",
    textAlign: "center",
  },

  formTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "10px",
  },

  formSubtitle: {
    fontSize: "16px",
    color: "#666",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    display: "flex",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
  },

  submitButton: {
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,98,51,0.3)",
    marginTop: "10px",
  },

  message: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "20px",
  },

  divider: {
    position: "relative",
    textAlign: "center",
    margin: "30px 0",
  },

  dividerText: {
    backgroundColor: "#FFFFFF",
    padding: "0 15px",
    color: "#999",
    fontSize: "14px",
    fontWeight: "500",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
  },

  footerText: {
    fontSize: "15px",
    color: "#666",
  },

  footerLink: {
    color: "#006233",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;