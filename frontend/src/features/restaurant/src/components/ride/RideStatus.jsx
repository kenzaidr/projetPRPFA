import { useState, useEffect } from 'react';

export default function RideStatus({ rideId = 'RIDE123' }) {
  const [status, setStatus] = useState('searching'); // searching, accepted, arriving, arrived, completed
  const [driver, setDriver] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Simulation du changement de statut (à remplacer par WebSocket)
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('accepted');
      setDriver({
        name: 'Ahmed Bennani',
        rating: 4.8,
        car: 'Dacia Logan - 12345 أ 6',
        phone: '+212 6XX XXX XXX',
        photo: '👨‍✈️'
      });
    }, 3000);

    const timer2 = setTimeout(() => setStatus('arriving'), 6000);
    const timer3 = setTimeout(() => setStatus('arrived'), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Décompte du temps
  useEffect(() => {
    if (status === 'arriving' && estimatedTime > 0) {
      const interval = setInterval(() => {
        setEstimatedTime(prev => Math.max(0, prev - 1));
      }, 60000); // Chaque minute
      return () => clearInterval(interval);
    }
  }, [status, estimatedTime]);

  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ride/${rideId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  const getStatusInfo = () => {
    switch(status) {
      case 'searching':
        return {
          icon: '🔍',
          title: 'Recherche d\'un chauffeur...',
          subtitle: 'Nous cherchons le meilleur chauffeur pour vous',
          color: '#006233'
        };
      case 'accepted':
        return {
          icon: '✅',
          title: 'Chauffeur trouvé !',
          subtitle: 'Votre chauffeur se prépare',
          color: '#006233'
        };
      case 'arriving':
        return {
          icon: '🚗',
          title: 'En route vers vous',
          subtitle: `Arrivée dans ${estimatedTime} min`,
          color: '#C1272D'
        };
      case 'arrived':
        return {
          icon: '📍',
          title: 'Le chauffeur est arrivé',
          subtitle: 'Il vous attend',
          color: '#C1272D'
        };
      default:
        return {};
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header avec statut */}
        <div style={{...styles.statusHeader, backgroundColor: statusInfo.color}}>
          <div style={styles.statusIcon}>{statusInfo.icon}</div>
          <h2 style={styles.statusTitle}>{statusInfo.title}</h2>
          <p style={styles.statusSubtitle}>{statusInfo.subtitle}</p>
          
          {status === 'arriving' && (
            <div style={styles.etaCircle}>
              <div style={styles.etaNumber}>{estimatedTime}</div>
              <div style={styles.etaLabel}>min</div>
            </div>
          )}
        </div>

        {/* Carte (placeholder) */}
        <div style={styles.mapPlaceholder}>
          <div style={styles.mapContent}>
            🗺️
            <p style={styles.mapText}>Carte interactive ici</p>
            <p style={styles.mapSubtext}>WebSocket + Google Maps</p>
          </div>
        </div>

        {/* Info chauffeur */}
        {driver && (
          <div style={styles.driverCard}>
            <div style={styles.driverHeader}>
              <div style={styles.driverPhoto}>{driver.photo}</div>
              <div style={styles.driverInfo}>
                <h3 style={styles.driverName}>{driver.name}</h3>
                <div style={styles.driverRating}>
                  ⭐ {driver.rating} • {driver.car}
                </div>
              </div>
              <button style={styles.callButton}>
                📞
              </button>
            </div>

            <div style={styles.driverActions}>
              <button style={styles.messageButton}>
                💬 Message
              </button>
              <button style={styles.shareButton}>
                📤 Partager
              </button>
            </div>
          </div>
        )}

        {/* Détails du trajet */}
        <div style={styles.tripDetails}>
          <div style={styles.tripHeader}>
            <h3 style={styles.tripTitle}>Détails du trajet</h3>
            <span style={styles.tripId}>#{rideId}</span>
          </div>

          <div style={styles.routeContainer}>
            <div style={styles.routePoint}>
              <div style={styles.pointDot}></div>
              <div style={styles.routeInfo}>
                <span style={styles.routeLabel}>Départ</span>
                <span style={styles.routeAddress}>Gare Casa-Voyageurs</span>
              </div>
            </div>

            <div style={styles.routeLine}></div>

            <div style={styles.routePoint}>
              <div style={styles.pointDot}></div>
              <div style={styles.routeInfo}>
                <span style={styles.routeLabel}>Arrivée</span>
                <span style={styles.routeAddress}>Aéroport Mohammed V</span>
              </div>
            </div>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>Prix total</span>
            <span style={styles.priceValue}>89.50 MAD</span>
          </div>
        </div>

        {/* Bouton annulation */}
        {status !== 'completed' && status !== 'arrived' && (
          <button 
            style={styles.cancelButton}
            onClick={() => setShowCancelModal(true)}
          >
            Annuler la course
          </button>
        )}

        {/* Modal d'annulation */}
        {showCancelModal && (
          <div style={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Annuler la course ?</h3>
              <p style={styles.modalText}>
                {driver ? 'Le chauffeur a déjà accepté. Des frais d\'annulation peuvent s\'appliquer.' : 'Voulez-vous vraiment annuler cette course ?'}
              </p>
              <div style={styles.modalActions}>
                <button 
                  style={styles.modalCancel}
                  onClick={() => setShowCancelModal(false)}
                >
                  Retour
                </button>
                <button 
                  style={styles.modalConfirm}
                  onClick={handleCancel}
                >
                  Oui, annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
  },

  statusHeader: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#FFFFFF',
    position: 'relative',
  },

  statusIcon: {
    fontSize: '60px',
    marginBottom: '15px',
    animation: 'pulse 2s infinite',
  },

  statusTitle: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px',
  },

  statusSubtitle: {
    fontSize: '15px',
    opacity: 0.95,
  },

  etaCircle: {
    width: '90px',
    height: '90px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px auto 0',
    backdropFilter: 'blur(10px)',
    border: '3px solid rgba(255,255,255,0.3)',
  },

  etaNumber: {
    fontSize: '36px',
    fontWeight: '900',
    lineHeight: '1',
  },

  etaLabel: {
    fontSize: '12px',
    fontWeight: '600',
    opacity: 0.9,
  },

  mapPlaceholder: {
    height: '300px',
    backgroundColor: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #e0e0e0',
  },

  mapContent: {
    textAlign: 'center',
    color: '#006233',
  },

  mapText: {
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },

  mapSubtext: {
    fontSize: '13px',
    opacity: 0.7,
    marginTop: '5px',
  },

  driverCard: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },

  driverHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },

  driverPhoto: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
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
  },

  callButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #006233',
    backgroundColor: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  driverActions: {
    display: 'flex',
    gap: '10px',
  },

  messageButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  shareButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  tripDetails: {
    padding: '20px',
    borderBottom: '8px solid #f5f5f5',
  },

  tripHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  tripTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
  },

  tripId: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
  },

  routeContainer: {
    marginBottom: '20px',
  },

  routePoint: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },

  pointDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#006233',
    marginTop: '5px',
  },

  routeLine: {
    width: '2px',
    height: '30px',
    backgroundColor: '#e0e0e0',
    marginLeft: '5px',
    margin: '5px 0 5px 5px',
  },

  routeInfo: {
    flex: 1,
  },

  routeLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
    display: 'block',
    marginBottom: '3px',
  },

  routeAddress: {
    fontSize: '15px',
    color: '#1a1a1a',
    fontWeight: '600',
    display: 'block',
  },

  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },

  priceLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#666',
  },

  priceValue: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#006233',
  },

  cancelButton: {
    margin: '20px',
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #C1272D',
    backgroundColor: '#FFFFFF',
    color: '#C1272D',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: 'calc(100% - 40px)',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '400px',
    margin: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },

  modalTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '12px',
  },

  modalText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '25px',
  },

  modalActions: {
    display: 'flex',
    gap: '12px',
  },

  modalCancel: {
    flex: 1,
    padding: '14px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1a',
    cursor: 'pointer',
  },

  modalConfirm: {
    flex: 1,
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#C1272D',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};