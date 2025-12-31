// Ride.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RideForm from '../components/ride/RideForm';

const Ride: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Bouton retour comme dans signup */}
      <button
        onClick={() => navigate("/")}
        style={styles.backButton}
      >
        ← Retour

      </button>
      
      <RideForm
        rideId={123} // ou une valeur dynamique venant de ton state
        onCancel={() => navigate("/")} // fonction pour annuler
      />
    </div>
  );
};

// Typing correct pour TypeScript
const styles: { page: React.CSSProperties; backButton: React.CSSProperties } = {
  page: {
    position: 'relative',
    minHeight: '100vh',
  },
  backButton: {
    position: 'absolute',       // ✅ string valide
    top: '30px',
    left: '30px',
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #006233',
    backgroundColor: 'transparent',
    color: '#006233',
    fontSize: '15px',
    fontWeight: 600,            // number pour fontWeight
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
};

export default Ride;
