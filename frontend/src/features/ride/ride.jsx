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
  
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-wrapper')) {
        setShowScheduleDropdown(false);
        setShowPassengerDropdown(false);
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
            <div className="logo" onClick={() => navigate('/')}>
              <span className="logo-text">Uber</span>
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
            <button className="header-icon-btn" aria-label="Profil">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
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
