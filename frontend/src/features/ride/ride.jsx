import { useState } from 'react';
import './ride.css';

const Ride = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('standard');

  const handleBookRide = (e) => {
    e.preventDefault();
    // Logique de réservation à implémenter
    console.log('Réservation:', { pickup, destination, rideType });
  };

  return (
    <div className="ride-landing">
      {/* Header */}
      <header className="ride-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">G</div>
            <span className="logo-text">Grab Morocco</span>
          </div>
          
          <nav className="header-nav">
            <a href="#services" className="nav-link">Services</a>
            <a href="#safety" className="nav-link">Sécurité</a>
            <a href="#about" className="nav-link">À propos</a>
            <a href="#help" className="nav-link">Aide</a>
          </nav>

          <div className="header-actions">
            <button className="btn-login">Connexion</button>
            <button className="btn-signup">S'inscrire</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Réservez votre course en quelques secondes
            </h1>
            <p className="hero-subtitle">
              Déplacez-vous facilement dans tout le Maroc avec des conducteurs vérifiés et des tarifs transparents
            </p>
          </div>

          {/* Booking Form */}
          <div className="booking-card">
            <div className="booking-tabs">
              <button className="tab active">Course</button>
              <button className="tab">Livraison</button>
            </div>

            <form onSubmit={handleBookRide} className="booking-form">
              <div className="form-group">
                <label className="form-label">
                  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Où allez-vous ?
                </label>
                <input
                  type="text"
                  placeholder="Entrez votre destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Point de départ
                </label>
                <input
                  type="text"
                  placeholder="Votre position actuelle"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type de course</label>
                <div className="ride-types">
                  <button
                    type="button"
                    className={`ride-type ${rideType === 'standard' ? 'active' : ''}`}
                    onClick={() => setRideType('standard')}
                  >
                    <div className="ride-type-icon">🚗</div>
                    <div className="ride-type-info">
                      <div className="ride-type-name">Standard</div>
                      <div className="ride-type-price">À partir de 25 MAD</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`ride-type ${rideType === 'comfort' ? 'active' : ''}`}
                    onClick={() => setRideType('comfort')}
                  >
                    <div className="ride-type-icon">🚙</div>
                    <div className="ride-type-info">
                      <div className="ride-type-name">Confort</div>
                      <div className="ride-type-price">À partir de 35 MAD</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`ride-type ${rideType === 'xl' ? 'active' : ''}`}
                    onClick={() => setRideType('xl')}
                  >
                    <div className="ride-type-icon">🚐</div>
                    <div className="ride-type-info">
                      <div className="ride-type-name">XL</div>
                      <div className="ride-type-price">À partir de 45 MAD</div>
                    </div>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-book">
                Réserver maintenant
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="features-section">
        <div className="container">
          <h2 className="section-title">Pourquoi choisir Grab Morocco ?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Sécurité garantie</h3>
              <p className="feature-description">
                Tous nos conducteurs sont vérifiés et formés. Suivez votre course en temps réel.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Tarifs transparents</h3>
              <p className="feature-description">
                Connaissez le prix avant de réserver. Pas de surprises, pas de frais cachés.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Arrivée rapide</h3>
              <p className="feature-description">
                Temps d'attente moyen de 5 minutes dans les grandes villes du Maroc.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Paiement flexible</h3>
              <p className="feature-description">
                Payez en espèces, par carte ou via votre portefeuille électronique.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Disponible partout</h3>
              <p className="feature-description">
                Service disponible dans toutes les grandes villes du Maroc, 24/7.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Conducteurs étoiles</h3>
              <p className="feature-description">
                Plus de 50 000 conducteurs avec une note moyenne de 4.8/5.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Conducteurs actifs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Courses par mois</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Note moyenne</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="how-it-works">
        <div className="container">
          <h2 className="section-title">Comment ça marche ?</h2>
          
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Entrez votre destination</h3>
              <p className="step-description">
                Indiquez où vous voulez aller et choisissez votre type de course
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Un conducteur vous trouve</h3>
              <p className="step-description">
                Notre système vous met en relation avec le conducteur le plus proche
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Suivez votre course</h3>
              <p className="step-description">
                Suivez en temps réel l'arrivée de votre conducteur et votre trajet
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <h3 className="step-title">Payez facilement</h3>
              <p className="step-description">
                Payez en espèces ou par carte. Simple et sécurisé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à partir ?</h2>
            <p className="cta-subtitle">
              Téléchargez l'application Grab Morocco et réservez votre première course
            </p>
            <div className="cta-buttons">
              <button className="btn-app-store">
                <svg className="app-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Télécharger sur<br />App Store
              </button>
              <button className="btn-google-play">
                <svg className="app-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Télécharger sur<br />Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ride-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">Grab Morocco</span>
              </div>
              <p className="footer-tagline">
                La plateforme de transport et livraison #1 au Maroc
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Entreprise</h4>
              <ul className="footer-links">
                <li><a href="#">À propos</a></li>
                <li><a href="#">Carrières</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Presse</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li><a href="#">Courses</a></li>
                <li><a href="#">Livraison</a></li>
                <li><a href="#">Livraison de colis</a></li>
                <li><a href="#">Devenir conducteur</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#">Centre d'aide</a></li>
                <li><a href="#">Sécurité</a></li>
                <li><a href="#">Nous contacter</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2025 Grab Morocco. Tous droits réservés.
            </div>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ride;
