//📍 Suivi de livraison en temps réel
import { useState, useEffect } from 'react';

export default function DeliveryTracking({ orderId, onComplete, onCancel }) {
  const [status, setStatus] = useState('confirmed'); // confirmed, preparing, ready, picked_up, delivering, delivered
  const [driver, setDriver] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    simulateDeliveryProgress();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // TODO: API réelle
      const mockOrder = {
        id: orderId,
        restaurantName: 'Tajine Palace',
        restaurantIcon: '🥘',
        items: [
          { name: 'Tajine agneau', quantity: 2, price: 85 },
          { name: 'Couscous royal', quantity: 1, price: 95 },
        ],
        total: 265,
        deliveryAddress: '25 Rue Mohammed V, Casablanca',
        phone: '0612345678',
      };
      setOrderDetails(mockOrder);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const simulateDeliveryProgress = () => {
    // TODO: Remplacer par WebSocket réel
    const statusFlow = [
      { status: 'confirmed', time: 2000, driver: null, eta: 30 },
      { status: 'preparing', time: 8000, driver: null, eta: 25 },
      { status: 'ready', time: 5000, driver: { name: 'Youssef', rating: 4.9, phone: '0623456789' }, eta: 20 },
      { status: 'picked_up', time: 3000, driver: { name: 'Youssef', rating: 4.9, phone: '0623456789' }, eta: 15 },
      { status: 'delivering', time: 12000, driver: { name: 'Youssef', rating: 4.9, phone: '0623456789' }, eta: 10 },
      { status: 'delivered', time: 3000, driver: { name: 'Youssef', rating: 4.9, phone: '0623456789' }, eta: 0 },
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusFlow.length) {
        const current = statusFlow[currentIndex];
        setStatus(current.status);
        if (current.driver) setDriver(current.driver);
        setEstimatedTime(current.eta);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, statusFlow[currentIndex]?.time || 3000);

    return () => clearInterval(interval);
  };

  const getStatusConfig = () => {
    const configs = {
      confirmed: {
        icon: '✅',
        title: 'Commande confirmée',
        message: 'Le restaurant prépare votre commande',
        color: '#006233',
        step: 1,
      },
      preparing: {
        icon: '👨‍🍳',
        title: 'En préparation',
        message: 'Votre commande est en cours de préparation',
        color: '#006233',
        step: 2,
      },
      ready: {
        icon: '📦',
        title: 'Prête pour livraison',
        message: 'Un livreur va bientôt récupérer votre commande',
        color: '#006233',
        step: 3,
      },
      picked_up: {
        icon: '🏍️',
        title: 'Récupérée',
        message: 'Le livreur a récupéré votre commande',
        color: '#006233',
        step: 4,
      },
      delivering: {
        icon: '🚚',
        title: 'En cours de livraison',
        message: `Arrivée dans environ ${estimatedTime} min`,
        color: '#C1272D',
        step: 5,
      },
      delivered: {
        icon: '🎉',
        title: 'Livrée !',
        message: 'Bon appétit ! Merci d\'avoir commandé avec nous',
        color: '#006233',
        step: 6,
      },
    };
    return configs[status] || configs.confirmed;
  };

  const config = getStatusConfig();

  const handleCancelOrder = async () => {
    if (status === 'delivering' || status === 'delivered') {
      alert('Impossible d\'annuler une commande déjà en livraison');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          onCancel?.();
        }
      } catch (error) {
        console.error('Erreur annulation:', error);
      }
    }
  };

  const timeline = [
    { step: 1, label: 'Confirmée', icon: '✅' },
    { step: 2, label: 'Préparation', icon: '👨‍🍳' },
    { step: 3, label: 'Prête', icon: '📦' },
    { step: 4, label: 'Récupérée', icon: '🏍️' },
    { step: 5, label: 'En route', icon: '🚚' },
    { step: 6, label: 'Livrée', icon: '🎉' },
  ];

  if (!orderDetails) {
    return (
      <div style={styles.loading}>
        ⏳ Chargement...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Status Card */}
        <div style={styles.statusCard}>
          {/* Status Icon */}
          <div style={{
            ...styles.iconCircle,
            backgroundColor: `${config.color}15`,
          }}>
            <span style={styles.icon}>{config.icon}</span>
          </div>

          <h2 style={styles.title}>{config.title}</h2>
          <p style={styles.message}>{config.message}</p>

          {estimatedTime > 0 && status !== 'delivered' && (
            <div style={styles.etaBadge}>
              🕐 Arrivée estimée dans <strong>{estimatedTime} min</strong>
            </div>
          )}

          {/* Timeline */}
          <div style={styles.timeline}>
            {timeline.map((item, index) => (
              <div key={item.step} style={styles.timelineItem}>
                <div style={{
                  ...styles.timelineIcon,
                  backgroundColor: item.step <= config.step ? '#006233' : '#e0e0e0',
                  color: item.step <= config.step ? '#FFFFFF' : '#999',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  ...styles.timelineLabel,
                  color: item.step <= config.step ? '#1a1a1a' : '#999',
                  fontWeight: item.step <= config.step ? '700' : '500',
                }}>
                  {item.label}
                </div>
                {index < timeline.length - 1 && (
                  <div style={{
                    ...styles.timelineLine,
                    backgroundColor: item.step < config.step ? '#006233' : '#e0e0e0',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Driver Info */}
          {driver && (
            <div style={styles.driverCard}>
              <div style={styles.driverAvatar}>
                {driver.name.charAt(0)}
              </div>
              <div style={styles.driverInfo}>
                <div style={styles.driverName}>{driver.name}</div>
                <div style={styles.driverRating}>⭐ {driver.rating} • Livreur</div>
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
              📍 Suivi en temps réel
              <br />
              <small style={{ opacity: 0.7 }}>
                (Intégration carte à venir)
              </small>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <div style={styles.restaurantInfo}>
              <span style={styles.restaurantIcon}>{orderDetails.restaurantIcon}</span>
              <div>
                <div style={styles.restaurantName}>{orderDetails.restaurantName}</div>
                <div style={styles.orderId}>Commande #{orderId}</div>
              </div>
            </div>
          </div>

          <div style={styles.orderItems}>
            <h3 style={styles.sectionTitle}>Votre commande</h3>
            {orderDetails.items.map((item, index) => (
              <div key={index} style={styles.orderItem}>
                <span>{item.quantity}x {item.name}</span>
                <span>{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>

          <div style={styles.deliveryInfo}>
            <h3 style={styles.sectionTitle}>Livraison</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>📍 Adresse</span>
              <span style={styles.infoValue}>{orderDetails.deliveryAddress}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>📞 Téléphone</span>
              <span style={styles.infoValue}>{orderDetails.phone}</span>
            </div>
          </div>

          <div style={styles.orderTotal}>
            <span>Total</span>
            <span style={styles.totalAmount}>{orderDetails.total.toFixed(2)} MAD</span>
          </div>

          {/* Actions */}
          {status !== 'delivered' && status !== 'delivering' && (
            <button
              onClick={handleCancelOrder}
              style={styles.cancelButton}
            >
              ❌ Annuler la commande
            </button>
          )}

          {status === 'delivered' && (
            <button
              onClick={() => onComplete?.()}
              style={styles.doneButton}
            >
              ✅ Terminer
            </button>
          )}
        </div>

        {/* Support */}
        <div style={styles.supportCard}>
          <div style={styles.supportIcon}>🆘</div>
          <div style={styles.supportText}>
            <div style={styles.supportTitle}>Besoin d'aide ?</div>
            <div style={styles.supportDesc}>Notre support est disponible 24/7</div>
          </div>
          <button style={styles.supportButton}>Contacter</button>
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
    maxWidth: '600px',
    margin: '0 auto',
  },

  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '24px',
    color: '#666',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    marginBottom: '20px',
    textAlign: 'center',
  },

  iconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },

  icon: {
    fontSize: '48px',
  },

  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '10px',
  },

  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },

  etaBadge: {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: '25px',
    backgroundColor: '#f0fdf4',
    color: '#006233',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '30px',
  },

  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    position: 'relative',
  },

  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },

  timelineIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '8px',
    transition: 'all 0.5s ease',
    zIndex: 2,
  },

  timelineLabel: {
    fontSize: '11px',
    textAlign: 'center',
  },

  timelineLine: {
    position: 'absolute',
    top: '25px',
    left: '50%',
    width: '100%',
    height: '3px',
    transition: 'all 0.5s ease',
    zIndex: 1,
  },

  driverCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    marginBottom: '20px',
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
  },

  mapPlaceholder: {
    width: '100%',
    height: '180px',
    backgroundColor: '#e8f5e9',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #006233',
  },

  mapContent: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#006233',
    fontWeight: '600',
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },

  orderHeader: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },

  restaurantInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },

  restaurantIcon: {
    fontSize: '48px',
  },

  restaurantName: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '3px',
  },

  orderId: {
    fontSize: '13px',
    color: '#666',
  },

  orderItems: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '15px',
  },

  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#666',
  },

  deliveryInfo: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },

  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
  },

  infoValue: {
    fontSize: '14px',
    color: '#1a1a1a',
    textAlign: 'right',
  },

  orderTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '20px',
  },

  totalAmount: {
    color: '#006233',
  },

  cancelButton: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '2px solid #C1272D',
    backgroundColor: 'transparent',
    color: '#C1272D',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  doneButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #006233 0%, #C1272D 100%)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,98,51,0.3)',
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