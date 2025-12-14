import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
}

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

const LocationComponent = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Obtenir la position actuelle
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Géocodage inversé avec Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );
          const data = await response.json();
          
          const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setCurrentLocation({
            latitude,
            longitude,
            address,
            city: data.address?.city || data.address?.town || data.address?.village,
            country: data.address?.country
          });
          
          setLocation(address);
          setError('');
        } catch (err) {
          setError('Erreur lors de la récupération de l\'adresse');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError('Vous avez refusé l\'accès à votre position');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Position indisponible');
            break;
          case err.TIMEOUT:
            setError('Délai d\'attente dépassé');
            break;
          default:
            setError('Erreur inconnue');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Recherche de localisation
  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ma&limit=5&accept-language=fr`
      );
      const data: SearchResult[] = await response.json();
      
      setSearchResults(data);
    } catch (err) {
      console.error('Erreur de recherche:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Gestion du changement de texte avec debounce
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    
    // Debounce la recherche
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    
    (window as any).searchTimeout = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  // Sélectionner un résultat de recherche
  const selectLocation = (result: SearchResult) => {
    setLocation(result.display_name);
    setCurrentLocation({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name,
      city: result.address?.city || result.address?.town,
      country: result.address?.country
    });
    setSearchResults([]);
  };

  // Confirmer et retourner à la page d'accueil
  const confirmLocation = () => {
    if (currentLocation) {
      // Naviguer vers la page d'accueil avec l'adresse dans l'état
      navigate('/', { 
        state: { 
          selectedLocation: currentLocation.address,
          locationData: currentLocation
        } 
      });
    }
  };

  return (
    <div style={styles.container}>
        {/* Back button */}
          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
            aria-label="Retour"
          >
            ← 
          </button>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>📍 Votre localisation</h2>
          <p style={styles.subtitle}>
            Indiquez votre adresse pour découvrir les restaurants et services près de chez vous
          </p>
        </div>

        {/* Input de recherche */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Rechercher une adresse (ex: Avenue Hassan II, Fès)"
            value={location}
            onChange={handleLocationChange}
            style={styles.input}
          />
          
          {isSearching && (
            <div style={styles.loadingIndicator}>
              <span style={styles.spinner}>⏳</span>
            </div>
          )}
        </div>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div style={styles.resultsContainer}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                style={styles.resultItem}
                onClick={() => selectLocation(result)}
              >
                <span style={styles.resultIcon}>📍</span>
                <div style={styles.resultText}>
                  <div style={styles.resultMain}>{result.display_name.split(',')[0]}</div>
                  <div style={styles.resultSub}>{result.display_name}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton de géolocalisation */}
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          style={{
            ...styles.geoButton,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          <span style={styles.geoIcon}>🎯</span>
          {isLoading ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
        </button>

        {/* Affichage de l'erreur */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* Affichage de la localisation actuelle */}
        {currentLocation && (
          <div style={styles.locationBox}>
            <div style={styles.locationHeader}>
              <span style={styles.successIcon}>✅</span>
              <strong>Localisation détectée</strong>
            </div>
            <div style={styles.locationDetails}>
              <p style={styles.locationAddress}>
                📍 {currentLocation.address}
              </p>
              {currentLocation.city && (
                <p style={styles.locationCity}>
                  🏙️ Ville: {currentLocation.city}
                </p>
              )}
              <p style={styles.locationCoords}>
                🌍 Coordonnées: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </p>
            </div>
            
            {/* Bouton de confirmation */}
            <button 
              style={styles.confirmButton}
              onClick={confirmLocation}
            >
              Confirmer cette adresse
            </button>
          </div>
        )}

        {/* Info sur la géolocalisation */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            💡 <strong>Astuce:</strong> Activez la géolocalisation dans votre navigateur pour une expérience optimale
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #006233 0%, #00843d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  searchBox: {
    position: 'relative',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '16px 50px 16px 16px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa',
    boxSizing: 'border-box',
  },
  loadingIndicator: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  spinner: {
    fontSize: '20px',
    animation: 'spin 1s linear infinite',
  },
  resultsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "linear-gradient(145deg, #0a7a3c, #006233)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "22px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 6px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  resultItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '15px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    borderBottom: '1px solid #e0e0e0',
  },
  resultIcon: {
    fontSize: '20px',
    marginRight: '12px',
    marginTop: '2px',
  },
  resultText: {
    flex: 1,
  },
  resultMain: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  resultSub: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.4',
  },
  geoButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #006233 0%, #C1272D 100%)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,98,51,0.3)',
  },
  geoIcon: {
    fontSize: '20px',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  errorIcon: {
    fontSize: '20px',
  },
  locationBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },
  locationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#2e7d32',
  },
  successIcon: {
    fontSize: '20px',
  },
  locationDetails: {
    marginBottom: '15px',
  },
  locationAddress: {
    fontSize: '15px',
    color: '#1a1a1a',
    marginBottom: '8px',
    fontWeight: '600',
  },
  locationCity: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '6px',
  },
  locationCoords: {
    fontSize: '13px',
    color: '#666',
  },
  confirmButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#006233',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  infoBox: {
    backgroundColor: '#fff3e0',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ffb74d',
  },
  infoText: {
    fontSize: '13px',
    color: '#e65100',
    margin: 0,
    lineHeight: '1.5',
  },
};

export default LocationComponent;