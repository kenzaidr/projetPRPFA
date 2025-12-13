import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface SignupResponse {
  token?: string;
  message?: string;
}

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // 🎯 Media screen logic (identique à Login)
  useEffect(() => {
    const media = window.matchMedia("(max-width: 480px)");
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

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: SignupResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur d'inscription");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Inscription réussie 🇲🇦");
    } catch {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          width: isMobile ? "90%" : "340px",
          padding: isMobile ? "20px" : "30px",
        }}
      >
        <h2 style={styles.title}>Inscription</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              ...styles.input,
              padding: isMobile ? "8px" : "10px",
            }}
          />

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            S'inscrire
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

export default Signup;
