import { useState } from "react";
import { Utensils, ShoppingCart as CartIcon, ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"; //lucide-react C'est une bibliothèque d'icônes

function Menu({ restaurant, onAddToCart, cart = [], onRemoveItem, onUpdateQuantity, onCheckout }) {
  const [cartOpen, setCartOpen] = useState(false);
  
  if (!restaurant || !restaurant.menu) return null;

  const cartItems = cart || [];
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="menu">
      {restaurant.menu.map((category, index) => (
        <div key={index} className="menu-category">
          <h3 className="menu-category-title">
            <Utensils size={22} className="menu-icon" /> {/*c est du UI ajouter une icon*/}
            {category.category}
          </h3>

          <div className="menu-items">
            {category.items.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-info">
                  <h4 className="menu-item-name">{item.name}</h4>
                  <p className="menu-item-description">{item.description}</p>
                  <span className="menu-item-price">
                    {item.price} MAD
                  </span>
                </div>

                <button
                  className="menu-add-btn"
                  onClick={() => onAddToCart(item, restaurant)}
                >
                  <CartIcon size={18} />
                  Ajouter
                </button>
              </div>
            ))}
          </div>
          
        </div>
      ))}

      
      <style>{`
        .menu {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .menu-category {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #f0f0f0;
        }

        .menu-category-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d2d2d;
          margin-bottom: 1rem;
        }

        .menu-icon {
          color: #c1272d;
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .menu-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #eeeeee;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          border-color: rgba(193, 39, 45, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .menu-item-info {
          flex: 1;
        }

        .menu-item-name {
          font-weight: bold;
          color: #2d2d2d;
          margin-bottom: 0.25rem;
        }

        .menu-item-description {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .menu-item-price {
          font-weight: bold;
          color: #0f9d58;
        }

        .menu-add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(to right, #c1272d, #0f9d58);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: box-shadow 0.2s ease;
        }

        .menu-add-btn:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .floating-cart-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          padding: 12px 16px;
          border-radius: 50px;
          border: none;
          background: #d32f2f;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .floating-cart-btn:hover {
          background: #b71c1c;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .cart-badge {
          background: #fff;
          color: #d32f2f;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .cart-drawer {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 100%;
          max-width: 400px;
          height: 80vh;
          max-height: 600px;
          background: #fff;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .cart-drawer.open {
          transform: translateY(0);
        }

        .cart-drawer-header {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }

        .cart-drawer-title {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2d2d2d;
        }

        .cart-drawer-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          color: #666;
        }

        .cart-drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          gap: 1rem;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 0.25rem;
        }

        .cart-item-price {
          color: #666;
          font-size: 0.9rem;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-quantity-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #f8f9fa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .cart-quantity-btn:hover {
          background: #e9ecef;
        }

        .cart-quantity {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .cart-remove-btn {
          background: #ffebee;
          color: #d32f2f;
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
        }

        .cart-drawer-footer {
          padding: 1rem;
          border-top: 1px solid #eee;
          background: #f8f9fa;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .cart-checkout-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(to right, #c1272d, #0f9d58);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
        }

        .cart-checkout-btn:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .cart-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
      `}</style>

      {/* Overlay */}
      {cartOpen && (
        <div className="cart-overlay open" onClick={() => setCartOpen(false)}></div>
      )}

      {/* Bouton panier fixe en bas à droite */}
      {totalItems > 0 && (
        <button
          className="floating-cart-btn"
          onClick={() => setCartOpen(prev => !prev)}
        >
          <ShoppingCart size={20} />
          <span className="cart-badge">{totalItems}</span>
        </button>
      )}

      {/* Drawer du panier */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Panier ({totalItems})</h3>
          <button className="cart-drawer-close" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.restaurantId}`} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{(item.price * (item.quantity || 1)).toFixed(2)} MAD</div>
                </div>
                <div className="cart-item-controls">
                  <button
                    className="cart-quantity-btn"
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="cart-quantity">{item.quantity || 1}</span>
                  <button
                    className="cart-quantity-btn"
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    className="cart-remove-btn"
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)} MAD</span>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={() => {
                if (onCheckout) {
                  onCheckout();
                }
                setCartOpen(false);
              }}
            >
              Commander
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
