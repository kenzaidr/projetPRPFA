import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
// Icons replaced with SVG to avoid dependency
const FaFacebookF = ({ style, color, size }: { style?: React.CSSProperties; color?: string; size?: number }) => (
  <svg style={style} width={size || 20} height={size || 20} fill={color || "#1877F2"} viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const FaGoogle = ({ style, color, size }: { style?: React.CSSProperties; color?: string; size?: number }) => (
  <svg style={style} width={size || 20} height={size || 20} fill={color || "#DB4437"} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface LoginResponse {
  token?: string;
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 📱 Responsive
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur de connexion");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Connexion réussie ! Redirection...");
      
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
            <h1 style={styles.Logo}>MMKH</h1>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Connexion</h2>
              <p style={styles.formSubtitle}>
                Accédez à votre compte MMKH
              </p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
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
                <div style={styles.labelRow}>
                  <label style={styles.label}>Mot de passe</label>
                  
                </div>
                <input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
                <span style={styles.forgotLink}>Mot de passe oublié ?</span>
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                  Se souvenir de moi
                </label>
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
                {isLoading ? "Connexion en cours..." : "Se connecter"}
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
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>ou</span>
              <span style={styles.dividerLine}></span>
            </div>

            <div style={styles.socialButtons}>
              <button style={styles.socialButton}>
                <FaFacebookF style={styles.socialIcon} color="#1877F2" size={20} />
                Facebook
              </button>
              <button style={styles.socialButton}>
                <FaGoogle style={styles.socialIcon} color="#DB4437" size={20} />
                Google
              </button>
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Vous n'avez pas de compte ?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={styles.footerLink}
                >
                  Créer un compte
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
    minHeight: "110vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  container: {
    display: "flex",
    minHeight: "110vh",
  },

  /* ===== LEFT SIDE - BRANDING ===== */
  leftSide: {
    flex: 1,
    background: "linear-gradient(135deg, #C1272D 0%, #8B1E24 100%)",
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
    border: "2px solid #C1272D",
    backgroundColor: "transparent",
    color: "#C1272D",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  formContainer: {
    width: "100%",
    maxWidth: "450px",
    position: "absolute",
    top: "0",
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
  Logo: {
    fontSize: "36px",
    fontWeight: "900",
    letterSpacing: "3px",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    marginBottom: "30px",
    position: "absolute",
    left: "38rem",
    top: "0rem",
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

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    display: "flex",
  },

  forgotLink: {
    fontSize: "13px",
    color: "#C1272D",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    display: "flex",
    alignSelf: "flex-end", 

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

  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },

  checkboxLabel: {
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
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
    display: "flex",
    alignItems: "center",
    gap: "15px",
    margin: "30px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e0e0e0",
  },

  dividerText: {
    color: "#999",
    fontSize: "14px",
    fontWeight: "500",
  },

  socialButtons: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },

  socialButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    backgroundColor: "#FFFFFF",
    color: "#1a1a1a",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  socialIcon: {
    fontSize: "18px",
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

export default Login;