import { useState, useEffect } from 'react';

export default function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, fast-food, traditional, pizza, etc.
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // TODO: Remplacer par vraie API
      const mockData = [
        {
          id: 1,
          name: 'Tajine Palace',
          category: 'traditional',
          rating: 4.8,
          deliveryTime: '25-35',
          deliveryFee: '10',
          minOrder: '50',
          image: '🥘',
          specialties: ['Tajine', 'Couscous', 'Pastilla'],
          isOpen: true,
        },
        {
          id: 2,
          name: 'Pizza Milano',
          category: 'pizza',
          rating: 4.6,
          deliveryTime: '20-30',
          deliveryFee: '8',
          minOrder: '40',
          image: '🍕',
          specialties: ['Pizza', 'Pâtes', 'Lasagne'],
          isOpen: true,
        },
        {
          id: 3,
          name: 'Burger House',
          category: 'fast-food',
          rating: 4.5,
          deliveryTime: '15-25',
          deliveryFee: '7',
          minOrder: '35',
          image: '🍔',
          specialties: ['Burgers', 'Frites', 'Wings'],
          isOpen: true,
        },
        {
          id: 4,
          name: 'Sushi Master',
          category: 'asian',
          rating: 4.9,
          deliveryTime: '30-40',
          deliveryFee: '12',
          minOrder: '60',
          image: '🍱',
          specialties: ['Sushi', 'Maki', 'Ramen'],
          isOpen: false,
        },
        {
          id: 5,
          name: 'Tacos Express',
          category: 'fast-food',
          rating: 4.4,
          deliveryTime: '20-25',
          deliveryFee: '5',
          minOrder: '30',
          image: '🌮',
          specialties: ['Tacos', 'Burritos', 'Nachos'],
          isOpen: true,
        },
        {
          id: 6,
          name: 'Le Café Parisien',
          category: 'cafe',
          rating: 4.7,
          deliveryTime: '25-30',
          deliveryFee: '9',
          minOrder: '45',
          image: '☕',
          specialties: ['Croissants', 'Sandwiches', 'Café'],
          isOpen: true,
        },
      ];
      
      setTimeout(() => {
        setRestaurants(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erreur chargement restaurants:', error);
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Tout', icon: '🍽️' },
    { id: 'traditional', name: 'Marocain', icon: '🥘' },
    { id: 'fast-food', name: 'Fast Food', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'asian', name: 'Asiatique', icon: '🍱' },
    { id: 'cafe', name: 'Café', icon: '☕' },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesFilter = filter === 'all' || restaurant.category === filter;
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Restaurants 🍽️</h1>
          <p style={styles.subtitle}>
            Commandez vos plats préférés livrés chez vous
          </p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Rechercher un restaurant ou un plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Categories Filter */}
        <div style={styles.categoriesContainer}>
          <div style={styles.categories}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  ...styles.categoryButton,
                  ...(filter === cat.id ? styles.categoryButtonActive : {}),
                }}
              >
                <span style={styles.categoryIcon}>{cat.icon}</span>
                <span style={styles.categoryName}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>⏳</div>
            <p>Chargement des restaurants...</p>
          </div>
        ) : (
          <div style={styles.restaurantGrid}>
            {filteredRestaurants.length === 0 ? (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>😔</div>
                <p style={styles.noResultsText}>
                  Aucun restaurant trouvé
                </p>
              </div>
            ) : (
              filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  onClick={() => onSelectRestaurant?.(restaurant)}
                >
                  {/* Status Badge */}
                  {!restaurant.isOpen && (
                    <div style={styles.closedBadge}>Fermé</div>
                  )}

                  {/* Restaurant Image */}
                  <div style={styles.restaurantImage}>
                    <span style={styles.restaurantEmoji}>{restaurant.image}</span>
                  </div>

                  {/* Restaurant Info */}
                  <div style={styles.restaurantInfo}>
                    <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                    
                    <div style={styles.restaurantMeta}>
                      <span style={styles.rating}>
                        ⭐ {restaurant.rating}
                      </span>
                      <span style={styles.dot}>•</span>
                      <span style={styles.deliveryTime}>
                        🕐 {restaurant.deliveryTime} min
                      </span>
                    </div>

                    <div style={styles.specialties}>
                      {restaurant.specialties.slice(0, 3).map((specialty, i) => (
                        <span key={i} style={styles.specialtyTag}>
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div style={styles.restaurantFooter}>
                      <span style={styles.deliveryFee}>
                        🚚 {restaurant.deliveryFee} MAD
                      </span>
                      <span style={styles.minOrder}>
                        Min. {restaurant.minOrder} MAD
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Promo Banner */}
        <div style={styles.promoBanner}>
          <div style={styles.promoIcon}>🎉</div>
          <div style={styles.promoText}>
            <div style={styles.promoTitle}>Première commande ?</div>
            <div style={styles.promoDesc}>
              Profitez de -20% avec le code BIENVENUE
            </div>
          </div>
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
    paddingBottom: '40px',
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },

  header: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #006233 0%, #00843d 100%)',
    borderRadius: '20px',
    color: '#FFFFFF',
    marginBottom: '30px',
  },

  title: {
    fontSize: '36px',
    fontWeight: '900',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
  },

  subtitle: {
    fontSize: '16px',
    opacity: 0.95,
  },

  searchContainer: {
    marginBottom: '25px',
  },

  searchInput: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },

  categoriesContainer: {
    marginBottom: '30px',
    overflow: 'hidden',
  },

  categories: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '10px',
  },

  categoryButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '15px 20px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '100px',
    whiteSpace: 'nowrap',
  },

  categoryButtonActive: {
    borderColor: '#006233',
    backgroundColor: '#e8f5e9',
  },

  categoryIcon: {
    fontSize: '28px',
  },

  categoryName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a1a',
  },

  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },

  loadingSpinner: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'spin 2s linear infinite',
  },

  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },

  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
  },

  closedBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#C1272D',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    zIndex: 10,
  },

  restaurantImage: {
    height: '160px',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  restaurantEmoji: {
    fontSize: '80px',
  },

  restaurantInfo: {
    padding: '20px',
  },

  restaurantName: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '10px',
  },

  restaurantMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },

  rating: {
    fontWeight: '600',
    color: '#006233',
  },

  dot: {
    opacity: 0.5,
  },

  deliveryTime: {
    fontWeight: '500',
  },

  specialties: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '15px',
  },

  specialtyTag: {
    padding: '4px 10px',
    borderRadius: '15px',
    backgroundColor: '#f8f9fa',
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
  },

  restaurantFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #e0e0e0',
    fontSize: '13px',
    fontWeight: '600',
  },

  deliveryFee: {
    color: '#006233',
  },

  minOrder: {
    color: '#666',
  },

  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    gridColumn: '1 / -1',
  },

  noResultsIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },

  noResultsText: {
    fontSize: '18px',
    color: '#666',
  },

  promoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    background: 'linear-gradient(135deg, #C1272D 0%, #8B1E24 100%)',
    borderRadius: '16px',
    color: '#FFFFFF',
  },

  promoIcon: {
    fontSize: '48px',
  },

  promoText: {
    flex: 1,
  },

  promoTitle: {
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '5px',
  },

  promoDesc: {
    fontSize: '14px',
    opacity: 0.95,
  },
};