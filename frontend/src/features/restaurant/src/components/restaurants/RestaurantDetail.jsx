import { useState, useEffect } from 'react';

export default function RestaurantDetail({ restaurant, onBack, onCheckout }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, [restaurant]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      // TODO: Remplacer par vraie API
      const mockMenu = [
        {
          id: 1,
          category: 'entrees',
          name: 'Pastilla au poulet',
          description: 'Feuilleté traditionnel au poulet, amandes et cannelle',
          price: 45,
          image: '🥟',
          isVegetarian: false,
          isPopular: true,
        },
        {
          id: 2,
          category: 'plats',
          name: 'Tajine agneau aux pruneaux',
          description: 'Agneau mijoté avec pruneaux, amandes et miel',
          price: 85,
          image: '🥘',
          isVegetarian: false,
          isPopular: true,
        },
        {
          id: 3,
          category: 'plats',
          name: 'Couscous royal',
          description: 'Couscous avec agneau, poulet et merguez',
          price: 95,
          image: '🍛',
          isVegetarian: false,
          isPopular: false,
        },
        {
          id: 4,
          category: 'entrees',
          name: 'Briouates au fromage',
          description: 'Petits triangles croustillants au fromage',
          price: 30,
          image: '🧀',
          isVegetarian: true,
          isPopular: false,
        },
        {
          id: 5,
          category: 'desserts',
          name: 'Cornes de gazelle',
          description: 'Pâtisseries aux amandes et fleur d\'oranger',
          price: 25,
          image: '🥐',
          isVegetarian: true,
          isPopular: true,
        },
        {
          id: 6,
          category: 'boissons',
          name: 'Thé à la menthe',
          description: 'Thé traditionnel marocain',
          price: 15,
          image: '🍵',
          isVegetarian: true,
          isPopular: false,
        },
      ];

      setTimeout(() => {
        setMenu(mockMenu);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Erreur chargement menu:', error);
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Tout', icon: '🍽️' },
    { id: 'entrees', name: 'Entrées', icon: '🥗' },
    { id: 'plats', name: 'Plats', icon: '🥘' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'boissons', name: 'Boissons', icon: '🥤' },
  ];

  const filteredMenu = selectedCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getCartItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = parseFloat(restaurant.deliveryFee);
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  const { subtotal, deliveryFee, total } = calculateTotal();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Retour
        </button>
        
        <div style={styles.restaurantHeader}>
          <div style={styles.restaurantIcon}>{restaurant.image}</div>
          <div style={styles.restaurantHeaderInfo}>
            <h1 style={styles.restaurantName}>{restaurant.name}</h1>
            <div style={styles.restaurantMeta}>
              <span>⭐ {restaurant.rating}</span>
              <span>•</span>
              <span>🕐 {restaurant.deliveryTime} min</span>
              <span>•</span>
              <span>🚚 {restaurant.deliveryFee} MAD</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Categories */}
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat.id ? styles.categoryButtonActive : {}),
              }}
            >
              <span style={styles.categoryIcon}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div style={styles.content}>
          <div style={styles.menuSection}>
            {loading ? (
              <div style={styles.loading}>⏳ Chargement du menu...</div>
            ) : (
              <div style={styles.menuGrid}>
                {filteredMenu.map(item => {
                  const quantity = getCartItemQuantity(item.id);
                  return (
                    <div key={item.id} style={styles.menuItem}>
                      {item.isPopular && (
                        <div style={styles.popularBadge}>⭐ Populaire</div>
                      )}
                      
                      <div style={styles.itemImage}>
                        <span style={styles.itemEmoji}>{item.image}</span>
                      </div>
                      
                      <div style={styles.itemInfo}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemName}>{item.name}</h3>
                          {item.isVegetarian && (
                            <span style={styles.vegBadge}>🌱</span>
                          )}
                        </div>
                        
                        <p style={styles.itemDescription}>{item.description}</p>
                        
                        <div style={styles.itemFooter}>
                          <span style={styles.itemPrice}>{item.price} MAD</span>
                          
                          {quantity === 0 ? (
                            <button
                              onClick={() => addToCart(item)}
                              style={styles.addButton}
                            >
                              + Ajouter
                            </button>
                          ) : (
                            <div style={styles.quantityControls}>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                style={styles.quantityButton}
                              >
                                −
                              </button>
                              <span style={styles.quantity}>{quantity}</span>
                              <button
                                onClick={() => addToCart(item)}
                                style={styles.quantityButton}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary (Fixed) */}
          {cart.length > 0 && (
            <div style={styles.cartSummary}>
              <div style={styles.cartHeader}>
                <h3 style={styles.cartTitle}>Votre panier</h3>
                <span style={styles.cartCount}>{cart.length} article{cart.length > 1 ? 's' : ''}</span>
              </div>

              <div style={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <span style={styles.cartItemName}>
                        {item.quantity}x {item.name}
                      </span>
                      <span style={styles.cartItemPrice}>
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.cartTotals}>
                <div style={styles.cartRow}>
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} MAD</span>
                </div>
                <div style={styles.cartRow}>
                  <span>Livraison</span>
                  <span>{deliveryFee.toFixed(2)} MAD</span>
                </div>
                <div style={styles.cartRowTotal}>
                  <span>Total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
              </div>

              <button
                onClick={() => onCheckout?.(cart, total)}
                style={styles.checkoutButton}
              >
                Commander • {total.toFixed(2)} MAD
              </button>
            </div>
          )}
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
  },

  header: {
    background: 'linear-gradient(135deg, #006233 0%, #00843d 100%)',
    color: '#FFFFFF',
    padding: '20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },

  backButton: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #FFFFFF',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },

  restaurantHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  restaurantIcon: {
    fontSize: '64px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '15px',
    borderRadius: '50%',
  },

  restaurantHeaderInfo: {
    flex: 1,
  },

  restaurantName: {
    fontSize: '28px',
    fontWeight: '900',
    marginBottom: '8px',
  },

  restaurantMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '14px',
    opacity: 0.95,
  },

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },

  categories: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    overflowX: 'auto',
    paddingBottom: '10px',
  },

  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  },

  categoryButtonActive: {
    borderColor: '#006233',
    backgroundColor: '#e8f5e9',
    color: '#006233',
  },

  categoryIcon: {
    fontSize: '20px',
  },

  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
  },

  menuSection: {
    minHeight: '400px',
  },

  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666',
  },

  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },

  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    position: 'relative',
  },

  popularBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#C1272D',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    zIndex: 10,
  },

  itemImage: {
    height: '120px',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemEmoji: {
    fontSize: '64px',
  },

  itemInfo: {
    padding: '20px',
  },

  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '8px',
  },

  itemName: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a1a',
  },

  vegBadge: {
    fontSize: '16px',
  },

  itemDescription: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '15px',
  },

  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemPrice: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#006233',
  },

  addButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    background: 'linear-gradient(135deg, #006233 0%, #C1272D 100%)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  quantityButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#006233',
    color: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    fontSize: '16px',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center',
  },

  cartSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '140px',
    maxHeight: 'calc(100vh - 160px)',
    display: 'flex',
    flexDirection: 'column',
  },

  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e0e0e0',
  },

  cartTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a1a',
  },

  cartCount: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },

  cartItems: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
  },

  cartItem: {
    marginBottom: '15px',
  },

  cartItemInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },

  cartItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },

  cartItemPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#006233',
  },

  cartTotals: {
    borderTop: '2px solid #e0e0e0',
    paddingTop: '15px',
    marginBottom: '20px',
  },

  cartRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#666',
  },

  cartRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e0',
  },

  checkoutButton: {
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
};