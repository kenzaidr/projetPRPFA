<<<<<<< HEAD
import React, { useState } from 'react';
import { MapPin, User, UserPlus } from 'lucide-react';

const Home: React.FC = () => {
  const [address, setAddress] = useState('');

  const handleUseLocation = () => {
    alert('Utilisation de la localisation actuelle...');
  };

  const handleSearch = () => {
    if (address) {
      alert(`Recherche pour: ${address}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-600 relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <MapPin className="text-red-600" size={28} />
          </div>
          <span className="text-white text-4xl font-bold tracking-wider">MMKH</span>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105 shadow-lg">
            <User size={20} />
            Login
          </button>
          <button className="flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
            <UserPlus size={20} />
            Signup
=======
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [location, setLocation] = useState("");

  // 📱 Responsive
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  // 📍 Récupérer la localisation depuis la navigation
  useEffect(() => {
    if (locationState.state?.selectedLocation) {
      setLocation(locationState.state.selectedLocation);
    }
  }, [locationState]);

  return (
    <div style={styles.page}>
      {/* ================= NAVIGATION ================= */}
      <nav style={styles.nav}>
        <h1 style={styles.navLogo}>MMKH</h1>
        <div style={styles.navActions}>
          <button style={styles.navLogin} onClick={() => navigate("/login")}>
            Se connecter
          </button>
          <button style={styles.navSignup} onClick={() => navigate("/signup")}>
            Créer un compte
>>>>>>> 0b72134de16279fdf682509adf63d2c3c6639949
          </button>
        </div>
      </nav>

<<<<<<< HEAD
      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 relative z-10 gap-10 md:gap-0">
        {/* Left side - Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-96 h-96">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-3xl shadow-2xl transform rotate-12 animate-bounce-slow">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-white" size={80} />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full shadow-lg animate-float flex items-center justify-center text-3xl">🍔</div>
            <div className="absolute top-20 right-10 w-16 h-16 bg-white rounded-full shadow-lg animate-float-delayed flex items-center justify-center text-2xl">🛒</div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full shadow-lg animate-float flex items-center justify-center text-2xl">💊</div>
            <div className="absolute bottom-10 right-20 w-20 h-20 bg-white rounded-full shadow-lg animate-float-delayed flex items-center justify-center text-3xl">🥗</div>
          </div>
        </div>

        {/* Right side - Text and Search */}
        <div className="md:w-1/2 text-white flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Livraison rapide<br />au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-green-100">
            Nourriture, courses, pharmacies, tout!
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-full p-2 flex items-center shadow-2xl">
            <MapPin className="text-gray-400 ml-4" size={24} />
            <input
              type="text"
              placeholder="Quelle est votre adresse?"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 outline-none text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleUseLocation}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all whitespace-nowrap"
            >
              Utiliser ma position
            </button>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white rounded-t-[100%]"></div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -50%) rotate(12deg) translateY(0); }
          50% { transform: translate(-50%, -50%) rotate(12deg) translateY(-20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite;
        }
      `}</style>
=======
      {/* ================= HERO SECTION ================= */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Livraison rapide<br />partout au Maroc 🇲🇦
          </h1>
          <p style={styles.heroSubtitle}>
            Restaurants, courses, colis... Tout ce dont vous avez besoin, livré en quelques minutes
          </p>

          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="📍 Entrez votre adresse de livraison"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
             
              style={styles.searchInput}
              
            />
            <button 
              style={styles.searchButton}   onClick={() => navigate("/ride")}  
            >
              Commander maintenant
            </button>
          </div>

          <button 
            style={styles.geoButton}
            onClick={() => navigate("/location")}
          >
            📍 Utiliser ma position actuelle
          </button>
        </div>
      </header>

      {/* ================= SERVICES GRID ================= */}
      <section style={styles.servicesSection}>
        <h2 style={styles.servicesTitle}>Nos services</h2>
        <div style={styles.servicesGrid}>
          {[
            {
              icon: "🍽️",
              title: "Restaurants",
              desc: "Les meilleurs restaurants de votre ville",
            },
            {
              icon: "🛒",
              title: "Courses",
              desc: "Supermarchés et épiceries livrés chez vous",
            },
            {
              icon: "📦",
              title: "Colis",
              desc: "Envoyez et recevez vos colis rapidement",
            },
            {
              icon: "💊",
              title: "Pharmacies",
              desc: "Médicaments livrés en toute sécurité",
            },
          ].map((service, i) => (
            <div key={i} style={styles.serviceCard}>
              <div style={styles.serviceIcon}>{service.icon}</div>
              <h3 style={styles.serviceTitle}>{service.title}</h3>
              <p style={styles.serviceDesc}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={styles.featuresSection}>
        <div style={styles.featureRow}>
          <div style={styles.featureContent}>
            <span style={styles.featureBadge}>⚡ ULTRA RAPIDE</span>
            <h2 style={styles.featureTitle}>Livraison en 30 minutes</h2>
            <p style={styles.featureText}>
              Notre réseau de livreurs professionnels garantit une livraison express dans toute la ville. Suivez votre commande en temps réel.
            </p>
          </div>
          <div style={styles.featureImage}>🚀</div>
        </div>

        <div style={{...styles.featureRow, flexDirection: isMobile ? "column" : "row-reverse"}}>
          <div style={styles.featureContent}>
            <span style={styles.featureBadge}>🎯 QUALITÉ</span>
            <h2 style={styles.featureTitle}>Les meilleurs partenaires</h2>
            <p style={styles.featureText}>
              Nous sélectionnons rigoureusement nos restaurants et magasins partenaires pour vous garantir qualité et fraîcheur.
            </p>
          </div>
          <div style={styles.featureImage}>⭐</div>
        </div>

        <div style={styles.featureRow}>
          <div style={styles.featureContent}>
            <span style={styles.featureBadge}>💳 SÉCURISÉ</span>
            <h2 style={styles.featureTitle}>Paiement 100% sécurisé</h2>
            <p style={styles.featureText}>
              Carte bancaire, espèces ou paiement à la livraison. Choisissez le mode de paiement qui vous convient.
            </p>
          </div>
          <div style={styles.featureImage}>🔒</div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Prêt à commander ?</h2>
        <p style={styles.ctaText}>
          Rejoignez des milliers de marocains qui utilisent MMKH chaque jour
        </p>
        <button style={styles.ctaButton} onClick={() => navigate("/signup")}>
          Créer mon compte gratuitement
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>MMKH</h3>
            <p style={styles.footerDesc}>
              La plateforme de livraison n°1 au Maroc
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerHeading}>Services</h4>
            <p style={styles.footerLink}>Restaurants</p>
            <p style={styles.footerLink}>Courses</p>
            <p style={styles.footerLink}>Colis</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerHeading}>Entreprise</h4>
            <p style={styles.footerLink}>À propos</p>
            <p style={styles.footerLink}>Devenir livreur</p>
            <p style={styles.footerLink}>Devenir partenaire</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>MMKH © 2025 — Fait avec ❤️ au Maroc</p>
        </div>
      </footer>
>>>>>>> 0b72134de16279fdf682509adf63d2c3c6639949
    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#FFFFFF",
  },

  /* ===== NAVIGATION ===== */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    fontSize: "28px",
    fontWeight: "900",
    letterSpacing: "2px",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  navActions: {
    display: "flex",
    gap: "12px",
  },
  navLogin: {
    padding: "10px 24px",
    borderRadius: "25px",
    border: "2px solid #006233",
    backgroundColor: "transparent",
    color: "#006233",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  navSignup: {
    padding: "10px 24px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg, #006233 0%, #C1272D 100%)",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  /* ===== HERO ===== */
  hero: {
    background: "linear-gradient(135deg, #006233 0%, #00843d 100%)",
    padding: "80px 20px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "900",
    marginBottom: "20px",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "18px",
    marginBottom: "40px",
    opacity: 0.95,
    lineHeight: "1.6",
  },
  searchBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "18px 20px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  searchButton: {
    padding: "18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#C1272D",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(193,39,45,0.3)",
  },
  geoButton: {
    padding: "12px 24px",
    borderRadius: "25px",
    border: "2px solid #FFFFFF",
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  /* ===== SERVICES ===== */
  servicesSection: {
    padding: "80px 20px",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  servicesTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "50px",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  serviceCard: {
    padding: "40px 30px",
    borderRadius: "20px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  serviceIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  serviceTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "12px",
  },
  serviceDesc: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.6",
  },

  /* ===== FEATURES ===== */
  featuresSection: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
    marginBottom: "60px",
  },
  featureContent: {
    flex: 1,
    textAlign: "center",
  },
  featureBadge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "#e8f5e9",
    color: "#006233",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  featureText: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.8",
    maxWidth: "500px",
    margin: "0 auto",
  },
  featureImage: {
    fontSize: "120px",
    flex: 1,
  },

  /* ===== CTA ===== */
  ctaSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #C1272D 0%, #8B1E24 100%)",
    textAlign: "center",
    color: "#FFFFFF",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "900",
    marginBottom: "20px",
  },
  ctaText: {
    fontSize: "18px",
    marginBottom: "40px",
    opacity: 0.95,
  },
  ctaButton: {
    padding: "18px 40px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#FFFFFF",
    color: "#C1272D",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },

  /* ===== FOOTER ===== */
  footer: {
    padding: "60px 20px 20px",
    backgroundColor: "#1a1a1a",
    color: "#FFFFFF",
  },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto 40px",
  },
  footerSection: {
    textAlign: "left",
  },
  footerTitle: {
    fontSize: "24px",
    fontWeight: "900",
    marginBottom: "10px",
  },
  footerDesc: {
    fontSize: "14px",
    opacity: 0.8,
  },
  footerHeading: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "15px",
  },
  footerLink: {
    fontSize: "14px",
    opacity: 0.7,
    marginBottom: "8px",
    cursor: "pointer",
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    opacity: 0.7,
  },
};

export default Home;
>>>>>>> 0b72134de16279fdf682509adf63d2c3c6639949
