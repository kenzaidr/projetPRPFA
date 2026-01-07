import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ShoppingCart } from 'lucide-react';
// @ts-ignore
import RestaurantList from '../components/food/RestaurantList';
// @ts-ignore
import RestaurantDetail from '../components/restaurants/RestaurantDetail';
// @ts-ignore
import Cart from '../components/restaurant/Cart';
// @ts-ignore
import Checkout from '../components/restaurant/Checkout';
import MapView from '../components/maps/MapView';
// @ts-ignore
import { RESTAURANTS } from '../data/restaurantsData';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity?: number;
}

interface CartItem extends MenuItem {
  restaurantId: number;
  restaurantName: string;
  quantity: number;
}

interface Favorite {
  id: number;
  isFavorite: boolean;
}

type ViewMode = 'list' | 'map' | 'detail' | 'checkout';

export default function Food() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tous');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = cart || [];
 
  // const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const [favorites, setFavorites] = useState<Favorite[]>(
    (RESTAURANTS || []).map((r: any) => ({ id: r.id, isFavorite: r.isFavorite }))
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const cities = RESTAURANTS && RESTAURANTS.length > 0 
    ? ['Tous', ...new Set(RESTAURANTS.map((r: any) => r.city))]
    : ['Tous'];

  // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Charger la localisation depuis localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation({ lat: location.latitude, lng: location.longitude });
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
  }, []);

  const filteredRestaurants = (RESTAURANTS || []).filter((restaurant: any) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'Tous' || restaurant.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const toggleFavorite = (restaurantId: number) => {
    setFavorites(prev => 
      prev.map(fav => 
        fav.id === restaurantId 
          ? { ...fav, isFavorite: !fav.isFavorite }
          : fav
      )
    );
  };

  const handleSelectRestaurant = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setViewMode('detail');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setViewMode('checkout');
  };

  const handleConfirmOrder = (_orderData: any) => {
    // Réinitialiser le panier après confirmation
    setCart([]);
    setViewMode('list');
    setSelectedRestaurant(null);
    // Vous pouvez ajouter une notification de succès ici
    alert('Commande confirmée avec succès !');
  };

  const handleBackToList = () => {
    setSelectedRestaurant(null);
    setViewMode('list');
  };

  const addToCart = (item: MenuItem, restaurant: { id: number; name: string }): void => {
    const existingItem = cart.find(
      cartItem => cartItem.id === item.id && cartItem.restaurantId === restaurant.id
    );

    if (existingItem) {
      setCart(prev =>
        prev.map(cartItem =>
          cartItem.id === item.id && cartItem.restaurantId === restaurant.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      const cartItem: CartItem = {
        ...item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        quantity: 1
      };
      setCart(prev => [...prev, cartItem]);
    }
  };

  const removeFromCart = (itemId: number, restaurantId: number) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.restaurantId === restaurantId)));
  };

  const updateCartQuantity = (itemId: number, restaurantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, restaurantId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId && item.restaurantId === restaurantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartItemsForRestaurant = (restaurantId: number): CartItem[] => {
    return cart.filter(item => item.restaurantId === restaurantId);
  };

  const isFavorite = (restaurantId: number): boolean => {
    return favorites.find(f => f.id === restaurantId)?.isFavorite || false;
  };

  if (viewMode === 'checkout') {
    const restaurant = selectedRestaurant || (RESTAURANTS || []).find((r: any) => 
      cart.some(item => item.restaurantId === r.id)
    );
    
    if (!restaurant) {
      setViewMode('list');
      return null;
    }

    const restaurantCart = getCartItemsForRestaurant(restaurant.id);
    const subtotal = restaurantCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + restaurant.deliveryFee;
    

    return (
      <Checkout
        cart={restaurantCart}
        total={total}
        restaurant={restaurant}
        onConfirm={handleConfirmOrder}
        onBack={() => setViewMode('detail')}
      />
    );
  }

  if (viewMode === 'map') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-600 hover:text-morocco-red transition-colors font-medium"
            >
              ← Retour à la liste
            </button>
            <h1 className="text-xl font-bold text-gray-800">Carte des restaurants</h1>
            <div className="w-24"></div>
          </div>
        </header>
        <MapView 
          restaurants={filteredRestaurants}
          userLocation={userLocation}
          onSelectRestaurant={handleSelectRestaurant}
        />
      </div>
    );
  }

  if (viewMode === 'detail' && selectedRestaurant) {
    const restaurantCart = getCartItemsForRestaurant(selectedRestaurant.id);
    const subtotal = restaurantCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + selectedRestaurant.deliveryFee;

    return (
      <>
        <RestaurantDetail
          restaurant={selectedRestaurant}
          isFavorite={isFavorite(selectedRestaurant.id)}
          onBack={handleBackToList}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          cart={restaurantCart}
          onRemoveItem={(itemId: number) => removeFromCart(itemId, selectedRestaurant.id)}
          onUpdateQuantity={(itemId: number, quantity: number) => updateCartQuantity(itemId, selectedRestaurant.id, quantity)}
          onCheckout={handleCheckout}
        />
        
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">
              Restaurants au Maroc
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('map')}
                className="px-4 py-2 bg-morocco-green text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <MapPin size={18} />
                <span>Carte</span>
              </button>
             

            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un restaurant ou une cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/50 appearance-none bg-white"
              >
                {(cities as string[]).map((city: string) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurants List */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!RESTAURANTS || RESTAURANTS.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg font-bold">Erreur: Les données des restaurants ne sont pas chargées</p>
            <p className="text-gray-500 mt-2">Veuillez rafraîchir la page</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun restaurant trouvé</p>
          </div>
        ) : (
          <RestaurantList
            restaurants={filteredRestaurants}
            favorites={favorites}
            onSelectRestaurant={handleSelectRestaurant}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
      {cartOpen && cart.length > 0 && (
  <Cart
    items={cart}
    total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
    onCheckout={handleCheckout}
    onClose={() => setCartOpen(false)}
  />
)}
    </div>
  );
}

