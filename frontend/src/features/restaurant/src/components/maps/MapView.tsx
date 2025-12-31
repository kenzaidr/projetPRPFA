import { useEffect, useRef } from 'react';
import { Star, Clock, Navigation } from 'lucide-react';

declare global {
  interface Window {
    L: any;
    selectRestaurant?: (restaurantId: number) => void;
  }
}

interface Restaurant {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapViewProps {
  restaurants: Restaurant[];
  userLocation: UserLocation | null;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

function MapView({ restaurants, userLocation, onSelectRestaurant }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (typeof window.L === 'undefined') {
        setTimeout(initMap, 500);
        return;
      }

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Centre par défaut: Casablanca
      const defaultCenter: [number, number] = userLocation 
        ? [userLocation.lat, userLocation.lng]
        : [33.5731, -7.5898];

      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(defaultCenter, 13);

      // Ajouter les tuiles de la carte
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Ajouter le contrôle de zoom
      window.L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Ajouter le marqueur de l'utilisateur
      if (userLocation) {
        const userIcon = window.L.divIcon({
          className: 'custom-user-icon',
          html: `<div style="
            width: 32px;
            height: 32px;
            background: #006233;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        userMarkerRef.current = window.L.marker(
          [userLocation.lat, userLocation.lng],
          { icon: userIcon }
        ).addTo(map);

        // Ajouter un popup pour le marqueur utilisateur
        userMarkerRef.current.bindPopup('📍 Votre position').openPopup();
      }

      // Ajouter les marqueurs des restaurants
      restaurants.forEach((restaurant) => {
        if (!restaurant.latitude || !restaurant.longitude) return;

        const restaurantIcon = window.L.divIcon({
          className: 'custom-restaurant-icon',
          html: `<div style="
            width: 40px;
            height: 40px;
            background: #C1272D;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="color: white; font-size: 18px;">🍽️</span>
          </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = window.L.marker(
          [restaurant.latitude, restaurant.longitude],
          { icon: restaurantIcon }
        ).addTo(map);

        // Créer le contenu du popup
        const popupContent = `
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1a1a1a;">
              ${restaurant.name}
            </h3>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px; color: #666; font-size: 13px;">
              <span style="color: #fbbf24;">★</span>
              <span>${restaurant.rating}</span>
              <span>(${restaurant.reviews})</span>
            </div>
            <div style="color: #666; font-size: 13px; margin-bottom: 4px;">
              ⏱️ ${restaurant.deliveryTime}
            </div>
            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">
              💰 ${restaurant.deliveryFee} MAD
            </div>
            <button 
              onclick="window.selectRestaurant(${restaurant.id})"
              style="
                width: 100%;
                padding: 8px;
                background: linear-gradient(135deg, #006233 0%, #C1272D 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-size: 13px;
              "
            >
              Voir le menu
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });

      // Exposer la fonction de sélection globalement
      window.selectRestaurant = (restaurantId: number) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant && onSelectRestaurant) {
          onSelectRestaurant(restaurant);
        }
      };
    };

    initMap();

    // Nettoyage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current = null;
      }
      if (window.selectRestaurant) {
        delete window.selectRestaurant;
      }
    };
  }, [restaurants, userLocation, onSelectRestaurant]);

  // Calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Trier les restaurants par distance si la localisation de l'utilisateur est disponible
  const sortedRestaurants = userLocation
    ? [...restaurants].sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
        const distA = calculateDistance(
          userLocation.lat, userLocation.lng,
          a.latitude, a.longitude
        );
        const distB = calculateDistance(
          userLocation.lat, userLocation.lng,
          b.latitude, b.longitude
        );
        return distA - distB;
      })
    : restaurants;

  return (
    <div className="relative w-full h-screen">
      {/* Carte */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Liste des restaurants à droite */}
      <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl z-[1000]">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            Restaurants à proximité
          </h3>
          {userLocation && (
            <p className="text-sm text-gray-500">
              Triés par distance
            </p>
          )}
        </div>
        
        <div className="p-2">
          {sortedRestaurants.map((restaurant) => {
            const distance = userLocation && restaurant.latitude && restaurant.longitude
              ? calculateDistance(
                  userLocation.lat, userLocation.lng,
                  restaurant.latitude, restaurant.longitude
                ).toFixed(1)
              : null;

            return (
              <div
                key={restaurant.id}
                onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                className="p-3 mb-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 mb-1 truncate">
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating}</span>
                      <span>({restaurant.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      {distance && (
                        <div className="flex items-center gap-1">
                          <Navigation size={12} />
                          <span>{distance} km</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-morocco-green">
                      {restaurant.deliveryFee} MAD
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MapView;

