import {MapPin, Star, Clock, Heart, ChevronRight } from "lucide-react";


function RestaurantList({restaurants, favorites, onSelectRestaurant, onToggleFavorite}) {
  const isFavorite = (id) =>
    favorites.find((f) => f.id === id)?.isFavorite || false;

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="restaurant-card"
          onClick={() => onSelectRestaurant(restaurant)}
        >
          {/* Image */}
          <div className="restaurant-image">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-img"
            />

            <div className="image-overlay" />

            {/* Favorite */}
            <button
              className={`favorite-btn ${
                isFavorite(restaurant.id) ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(restaurant.id);
              }}
            >
              <Heart
                size={18}
                className={isFavorite(restaurant.id) ? "filled" : ""}
              />
            </button>

            {/* Rating */}
            <div className="restaurant-rating">
              <Star size={16} className="star-icon" />
              <span className="rating-value">{restaurant.rating}</span>
              <span className="rating-count">
                ({restaurant.reviews})
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="restaurant-content">
            <h3 className="restaurant-name">{restaurant.name}</h3>
            <p className="restaurant-cuisine">{restaurant.cuisine}</p>

            <div className="restaurant-info">
              <div className="info-item">
                <MapPin size={14} />
                <span>{restaurant.city}</span>
              </div>

              <div className="info-item">
                <Clock size={14} />
                <span>{restaurant.deliveryTime}</span>
              </div>
            </div>

            <div className="restaurant-footer">
              <div className="delivery-fee">
                <span>Livraison :</span>
                <strong>{restaurant.deliveryFee} MAD</strong>
              </div>

              <button className="menu-btn">
                Voir le menu
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ===== CSS ===== */}
      <style>{`
        .restaurant-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .restaurant-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }

        .restaurant-card:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }

        .restaurant-image {
          position: relative;
          height: 190px;
          overflow: hidden;
        }

        .restaurant-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .restaurant-card:hover .restaurant-img {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6),
            transparent
          );
        }

        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #999;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .favorite-btn:hover {
          background: #ef4444;
          color: #fff;
        }

        .favorite-btn.active {
          background: #ef4444;
          color: #fff;
        }

        .favorite-btn .filled {
          fill: currentColor;
        }

        .restaurant-rating {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 0.85rem;
        }

        .star-icon {
          fill: #facc15;
          color: #facc15;
        }

        .restaurant-content {
          padding: 1.25rem;
        }

        .restaurant-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2d2d2d;
        }

        .restaurant-cuisine {
          font-size: 0.9rem;
          color: #777;
          margin-bottom: 0.75rem;
        }

        .restaurant-info {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .restaurant-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .delivery-fee span {
          font-size: 0.75rem;
          color: #888;
          margin-right: 4px;
        }

        .delivery-fee strong {
          color: #0f9d58;
        }

        .menu-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #c1272d;
          font-weight: 600;
          cursor: pointer;
          transition: gap 0.2s ease;
        }

        .restaurant-card:hover .menu-btn {
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

export default RestaurantList;
