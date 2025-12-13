import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface LoginResponse {
  token?: string;
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // 🎯 Media screen logic
  useEffect(() => {
    const media = window.matchMedia("(max-width: 480px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur de connexion");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Connexion réussie 🇲🇦");
    } catch {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          width: isMobile ? "90%" : "320px",
          padding: isMobile ? "20px" : "30px",
        }}
      >
        <h2 style={styles.title}>Connexion</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} /*e.target.value = texte tapé*/
            required
            style={{
              ...styles.input,
              padding: isMobile ? "8px" : "10px",
            }}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...styles.input,
              padding: isMobile ? "8px" : "10px",
            }}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              padding: isMobile ? "9px" : "10px",
            }}
          >
            Se connecter
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              fontSize: isMobile ? "14px" : "15px",
              color: message.includes("réussie") ? "#006233" : "#C1272D",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    color: "#006233",
    marginBottom: "20px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outlineColor: "#006233",
  },
  button: {
    width: "100%",
    backgroundColor: "#C1272D",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
};

export default Login;
