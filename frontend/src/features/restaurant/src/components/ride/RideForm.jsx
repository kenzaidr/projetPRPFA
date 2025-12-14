import { useState, useEffect } from 'react';

export default function RideStatus({ rideId, onCancel }) {
  const [status, setStatus] = useState('searching'); // searching, accepted, arriving, arrived, completed
  const [driver, setDriver] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [currentLocation, setCurrentLocation] = useState('');

  // Simulation du statut en temps réel
  useEffect(() => {
    // TODO: Remplacer par WebSocket réel
    const statusFlow = [
      { status: 'searching', time: 3000, driver: null },
      { status: 'accepted', time: 5000, driver: { name: 'Ahmed', rating: 4.8, plate: 'A-12345' } },
      { status: 'arriving', time: 8000, driver: { name: 'Ahmed', rating: 4.8, plate: 'A-12345' } },
      { status: 'arrived', time: 3000, driver: { name: 'Ahmed', rating: 4.8, plate: 'A-12345' } },
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusFlow.length) {
        const current = statusFlow[currentIndex];
        setStatus(current.status);
        if (current.driver) setDriver(current.driver);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, statusFlow[currentIndex]?.time || 3000);

    return () => clearInterval(interval);
  }, []);

  // Compte à rebours pour l'arrivée
  useEffect(() => {
    if (status === 'arriving' && estimatedTime > 0) {
      const timer = setInterval(() => {
        setEstimatedTime(prev => Math.max(0, prev - 1));
      }, 60000); // Chaque minute
      return () => clearInterval(timer);
    }
  }, [status, estimatedTime]);

  const handleCancelRide = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette course ?')) {
      try {
        // TODO: API call
        const response = await fetch(`http://localhost:8080/api/ride/${rideId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          onCancel?.();
        }
      } catch (error) {
        console.error('Erreur annulation:', error);
      }
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'searching':
        return {
          icon: '🔍',
          title: 'Recherche d\'un chauffeur...',
          message: 'Nous recherchons le chauffeur le plus proche',
          color: '#006233',
          progress: 25,
        };
      case 'accepted':
        return {
          icon: '✅',
          title: 'Chauffeur trouvé !',
          message: 'Votre chauffeur arrive',
          color: '#006233',
          progress: 50,
        };
      case 'arriving':
        return {
          icon: '🚗',
          title: 'En route vers vous',
          message: `Arrivée dans ${estimatedTime} min`,
          color: '#006233',
          progress: 75,
        };
      case 'arrived':
        return {
          icon: '📍',
          title: 'Chauffeur arrivé',
          message: 'Votre chauffeur vous attend',
          color: '#C1272D',
          progress: 100,
        };
      default:
        return {
          icon: '⏳',
          title: 'Chargement...',
          message: '',
          color: '#666',
          progress: 0,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Status Card */}
        <div style={styles.card}>
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${config.progress}%`,
                backgroundColor: config.color,
              }}
            />
          </div>

          {/* Status Icon */}
          <div style={{
            ...styles.iconCircle,
            backgroundColor: `${config.color}15`,
          }}>
            <span style={styles.icon}>{config.icon}</span>
          </div>

          {/* Status Title */}
          <h2 style={styles.title}>{config.title}</h2>
          <p style={styles.message}>{config.message}</p>

          {/* Driver Info (si accepté) */}
          {driver && (
            <div style={styles.driverCard}>
              <div style={styles.driverAvatar}>
                {driver.name.charAt(0)}
              </div>
              <div style={styles.driverInfo}>
                <div style={styles.driverName}>{driver.name}</div>
                <div style={styles.driverRating}>
                  ⭐ {driver.rating} • {driver.plate}
                </div>
              </div>
              <div style={styles.driverActions}>
                <button style={styles.callButton}>
                  📞
                </button>
                <button style={styles.messageButton}>
                  💬
                </button>
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapContent}>
              📍 Carte en temps réel
              <br />
              <small style={{ opacity: 0.7 }}>
                (Intégration MapView à venir)
              </small>
            </div>
          </div>

          {/* Trip Details */}
          <div style={styles.tripDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🟢 Départ</span>
              <span style={styles.detailValue}>Gare Casa-Voyageurs</span>
            </div>
            <div style={styles.separator} />
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🔴 Arrivée</span>
              <span style={styles.detailValue}>Aéroport Mohammed V</span>
            </div>
            <div style={styles.separator} />
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>💰 Prix</span>
              <span style={styles.detailValue}>45.00 MAD</span>
            </div>
          </div>

          {/* Cancel Button */}
          {status !== 'completed' && status !== 'arrived' && (
            <button 
              style={styles.cancelButton}
              onClick={handleCancelRide}
            >
              ❌ Annuler la course
            </button>
          )}

          {/* Completed State */}
          {status === 'arrived' && (
            <div style={styles.arrivedActions}>
              <button style={styles.startButton}>
                ✅ Démarrer le trajet
              </button>
              <p style={styles.arrivedNote}>
                Confirmez avec votre chauffeur avant de partir
              </p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div style={styles.supportCard}>
          <div style={styles.supportIcon}>🆘</div>
          <div style={styles.supportText}>
            <div style={styles.supportTitle}>Besoin d'aide ?</div>
            <div style={styles.supportDesc}>Notre équipe est disponible 24/7</div>
          </div>
          <button style={styles.supportButton}>
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '20px',
  },

  container: {
    maxWidth: '550px',
    margin: '0 auto',
    paddingTop: '20px',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    padding: '30px',
    marginBottom: '20px',
  },

  progressContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '30px',
  },

  progressBar: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '10px',
  },

  iconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    animation: 'pulse 2s infinite',
  },

  icon: {
    fontSize: '48px',
  },

  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
  },

  message: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },

  driverCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    marginBottom: '25px',
    border: '2px solid #e0e0e0',
  },

  driverAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #006233 0%, #00843d 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '800',
  },

  driverInfo: {
    flex: 1,
  },

  driverName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '5px',
  },

  driverRating: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },

  driverActions: {
    display: 'flex',
    gap: '10px',
  },

  callButton: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#006233',
    color: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  messageButton: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#C1272D',
    color: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  mapPlaceholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#e8f5e9',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
    border: '2px dashed #006233',
  },

  mapContent: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#006233',
    fontWeight: '600',
  },

  tripDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
  },

  detailLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#666',
  },

  detailValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1a',
  },

  separator: {
    height: '1px',
    backgroundColor: '#e0e0e0',
  },

  cancelButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #C1272D',
    backgroundColor: 'transparent',
    color: '#C1272D',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  arrivedActions: {
    textAlign: 'center',
  },

  startButton: {
    width: '100%',
    padding: '18px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #006233 0%, #C1272D 100%)',
    color: '#FFFFFF',
    fontSize: '17px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,98,51,0.35)',
    marginBottom: '10px',
  },

  arrivedNote: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
  },

  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },

  supportIcon: {
    fontSize: '32px',
  },

  supportText: {
    flex: 1,
  },

  supportTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '3px',
  },

  supportDesc: {
    fontSize: '13px',
    color: '#666',
  },

  supportButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#006233',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};