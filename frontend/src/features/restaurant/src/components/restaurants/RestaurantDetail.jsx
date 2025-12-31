import { X, Star as StarIcon, Clock as ClockIcon, MapPin as PinIcon, Heart as HeartIcon } from 'lucide-react';
import Menu from '../food/Menu';

function RestaurantDetail({ restaurant, isFavorite, onBack, onToggleFavorite, onAddToCart, cart, onRemoveItem, onUpdateQuantity, onCheckout }) {
  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-morocco-red transition-colors"
          >
            <X size={20} />
            <span className="font-medium">Retour</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">{restaurant.name}</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-morocco-red to-morocco-green">
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <StarIcon size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-gray-300">({restaurant.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PinIcon size={16} />
                  <span className="truncate max-w-xs">{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">{restaurant.cuisine}</span>
                <div className="mt-1">
                  <span className="text-sm text-gray-600">Frais de livraison: </span>
                  <span className="font-semibold text-morocco-green">{restaurant.deliveryFee} MAD</span>
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(restaurant.id)}
                className={`p-3 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <HeartIcon size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>

        
        <Menu 
          restaurant={restaurant} 
          onAddToCart={onAddToCart}
          cart={cart}
          onRemoveItem={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
          onCheckout={onCheckout}
        />
      </div>
      
    </div>
  );
}

export default RestaurantDetail;