import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";

function Cart({ items, total, onCheckout, onRemoveItem, onUpdateQuantity, onClose }) {
  if (!items.length) return null;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Fond semi-transparent */}
      <div className="cart-overlay" onClick={onClose}></div>

      <div className="cart">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-info">
            <ShoppingCart />
            <span>{totalItems} article(s)</span>
            <strong>{total.toFixed(2)} MAD</strong>
          </div>
          <button className="cart-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={`${item.id}-${item.restaurantId}`} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <div className="price">{(item.price * item.quantity).toFixed(2)} MAD</div>
              </div>

              <div className="qty-controls">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={14} />
                </button>
                <button onClick={() => onRemoveItem(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <strong>Total : {total.toFixed(2)} MAD</strong>
          <button className="cart-btn" onClick={onCheckout}>
            Finaliser
          </button>
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 49;
        }

        .cart {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 480px;
          margin: 0 auto;
          background: #fff;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          padding: 1rem;
          z-index: 50;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
        }

        .cart-header,
        .cart-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-info {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .cart-close {
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .cart-items {
          max-height: 220px;
          overflow-y: auto;
          margin: 1rem 0;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: #f7f7f7;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .qty-controls {
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }

        .qty-controls button {
          border: none;
          background: #e5e5e5;
          padding: 0.3rem;
          border-radius: 50%;
          cursor: pointer;
        }

        .cart-btn {
          background: linear-gradient(to right, #c1272d, #0f9d58);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .price {
          font-size: 0.8rem;
          color: #555;
        }
      `}</style>
    </>
  );
}

export default Cart;
