import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClientLogin.css'; // Assuming you'll create this CSS file

const ClientLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle login/signup logic
    // For now, just navigate back or to home
    console.log(isSignup ? 'Signup' : 'Login', { email, password, name, phone });
    navigate('/'); // Or to ride page
  };

  return (
    <div className="client-login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(to bottom right, #C1272D, #006233)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>G</span>
            </div>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              background: 'linear-gradient(to right, #C1272D, #006233)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Grab Morocco</span>
          </div>
        </div>

        <div className="login-form-container">
          <h2>{isSignup ? 'Créer un compte' : 'Se connecter'}</h2>
          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {isSignup ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </form>
          <div className="toggle-auth">
            <p>
              {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
              <button 
                type="button" 
                onClick={() => setIsSignup(!isSignup)}
                className="toggle-btn"
              >
                {isSignup ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;