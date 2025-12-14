import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ride.css';

const RideBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Récupérer les données du formulaire précédent si disponibles
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [destination, setDestination] = useState(location.state?.destination || '');
  const [scheduleType, setScheduleType] = useState(location.state?.scheduleType || 'immediate');
  const [passengerType, setPassengerType] = useState('me');
  
  // User state
  const [userName, setUserName] = useState(() => {
    // Récupérer le nom de l'utilisateur depuis localStorage ou sessionStorage
    return localStorage.getItem('userName') || 
           sessionStorage.getItem('userName') || 
           location.state?.userName || 
           'Utilisateur';
  });
  
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-wrapper')) {
        setShowScheduleDropdown(false);
        setShowPassengerDropdown(false);
      }
      if (
        profileMenuRef.current &&
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Initialiser la carte Leaflet
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      // Vérifier si Leaflet est chargé
      if (typeof window !== 'undefined' && window.L) {
        // Coordonnées par défaut (Rabat, Maroc)
        const defaultLat = 34.0209;
        const defaultLng = -6.8416;
        const defaultZoom = 13;

        try {
          // Créer la carte
          const map = window.L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          }).setView([defaultLat, defaultLng], defaultZoom);

          // Ajouter la couche de tuiles OpenStreetMap
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Stocker l'instance de la carte
          mapInstanceRef.current = map;

          // Forcer le redimensionnement après un court délai pour s'assurer que le conteneur est visible
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 100);
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de la carte:', error);
        }
      } else {
        // Si Leaflet n'est pas encore chargé, réessayer après un court délai
        setTimeout(initMap, 100);
      }
    };

    // Démarrer l'initialisation
    initMap();

    // Nettoyer lors du démontage
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Redimensionner la carte quand la fenêtre change de taille
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mettre à jour la carte quand pickup ou destination change
  useEffect(() => {
    if (mapInstanceRef.current && (pickup || destination)) {
      // Ici vous pouvez ajouter la logique pour géocoder les adresses
      // et afficher des marqueurs sur la carte
      // Pour l'instant, on garde la vue par défaut
      // Exemple: utiliser une API de géocodage pour obtenir les coordonnées
    }
  }, [pickup, destination]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Logique de recherche de prix
    console.log('Recherche de prix:', { pickup, destination, scheduleType, passengerType });
    // Ici vous pouvez ajouter la logique pour rechercher les prix et afficher les résultats
  };

  return (
    <div className="ride-booking-page">
      {/* Header */}
      <header className="booking-header">
        <div className="header-content">
          <div className="header-left">
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
            <nav className="header-nav">
              <button className="nav-tab active">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Course</span>
              </button>
            </nav>
          </div>
          
          <div className="header-right">
            <button className="header-icon-btn" aria-label="Activité">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                ref={profileButtonRef}
                className="header-icon-btn" 
                aria-label="Profil"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div 
                  ref={profileMenuRef}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    minWidth: '320px',
                    zIndex: 1000,
                    padding: '20px',
                  }}
                >
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>{userName}</h3>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#6b7280' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Aide</span>
                    </button>
                    
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Wallet</span>
                    </button>
                    
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Activité</span>
                    </button>
                  </div>

                  {/* Grab Morocco Cash */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>Grab Morocco Cash</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>0,00 MAD</span>
                  </div>

                  {/* Account Links */}
                  <div style={{ marginBottom: '20px' }}>
                    <button style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: '#000' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#000' }}>Gérer le compte</span>
                    </button>
                    
                    <button style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: '#000' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#000' }}>Bonus</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#C1272D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a01f24'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1272D'}
                  onClick={() => {
                    // Logique de déconnexion
                    setShowProfileMenu(false);
                  }}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
            <button className="header-icon-btn" aria-label="Menu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="booking-layout">
        {/* Left Sidebar */}
        <aside className="booking-sidebar">
          <h1 className="sidebar-title">Commander une course</h1>
          
          <form onSubmit={handleSearch} className="booking-form">
            {/* Pickup Location */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lieu de prise en charge
              </label>
              <input
                type="text"
                className="field-input"
                placeholder="Entrez votre adresse"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
            </div>

            {/* Destination */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Destination
              </label>
              <div className="field-input-wrapper">
                <input
                  type="text"
                  className="field-input"
                  placeholder="Où allez-vous ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
                <button type="button" className="add-destination-btn" aria-label="Ajouter une destination">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Schedule Type */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </label>
              <div className="dropdown-wrapper">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => {
                    setShowScheduleDropdown(!showScheduleDropdown);
                    setShowPassengerDropdown(false);
                  }}
                >
                  <span>{scheduleType === 'immediate' ? 'Prise en charge immédiate' : 'Planifier plus tard'}</span>
                  <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showScheduleDropdown && (
                  <div className="dropdown-menu">
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setScheduleType('immediate');
                        setShowScheduleDropdown(false);
                      }}
                    >
                      Prise en charge immédiate
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setScheduleType('later');
                        setShowScheduleDropdown(false);
                      }}
                    >
                      Planifier plus tard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Passenger Type */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </label>
              <div className="dropdown-wrapper">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => {
                    setShowPassengerDropdown(!showPassengerDropdown);
                    setShowScheduleDropdown(false);
                  }}
                >
                  <span>Pour moi</span>
                  <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPassengerDropdown && (
                  <div className="dropdown-menu">
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setPassengerType('me');
                        setShowPassengerDropdown(false);
                      }}
                    >
                      Pour moi
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setPassengerType('someone');
                        setShowPassengerDropdown(false);
                      }}
                    >
                      Pour quelqu'un d'autre
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="search-button">
              Rechercher
            </button>
          </form>
        </aside>

        {/* Right Map Area */}
        <div className="map-container">
          <div id="map" ref={mapRef} className="leaflet-map"></div>
        </div>
      </div>
    </div>
  );
};

export default RideBooking;
