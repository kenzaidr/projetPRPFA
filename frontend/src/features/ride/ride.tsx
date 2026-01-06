import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ride.css';

// Type definitions
interface LocationCoords {
  lat: number;
  lng: number;
}

interface Stop {
  id: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

const RideBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  
  // Récupérer les données du formulaire précédent si disponibles
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [destination, setDestination] = useState(location.state?.destination || '');
  const [passengerType] = useState('me');
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [stops, setStops] = useState<Stop[]>([]); // Array of { id, address, lat, lng }
  const [selectingLocation, setSelectingLocation] = useState<string | null>(null); // 'pickup', 'destination', or stop id
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [userName] = useState('Utilisateur'); // Default user name
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const pickupDropdownRef = useRef<HTMLDivElement>(null);
  const routeCalculationTimeoutRef = useRef<number | null>(null);
  const isCalculatingRef = useRef(false);
  
  // Refs for map markers
  const pickupMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const stopsMarkersRef = useRef<any[]>([]);
  const pickupCoordsRef = useRef<LocationCoords | null>(null);
  const destinationCoordsRef = useRef<LocationCoords | null>(null);
  const routePolylineRef = useRef<any>(null);

  // Obtenir la position actuelle de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Géocoder les coordonnées pour obtenir l'adresse
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data && data.address) {
              const addressParts = [];
              if (data.address.road) addressParts.push(data.address.road);
              if (data.address.house_number) addressParts.push(data.address.house_number);
              if (addressParts.length === 0 && data.address.suburb) addressParts.push(data.address.suburb);
              if (addressParts.length === 0 && data.address.city) addressParts.push(data.address.city);
              
              const fullAddress = addressParts.length > 0 
                ? addressParts.join(' ')
                : data.display_name?.split(',')[0] || 'Adresse actuelle';
              setCurrentAddress(fullAddress);
            }
          } catch (error) {
            console.error('Erreur lors du géocodage:', error);
            setCurrentAddress('Votre emplacement actuel');
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setCurrentAddress('Votre emplacement actuel');
        }
      );
    }
  }, []);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Vérifier pour le menu de profil
      if (
        profileMenuRef.current &&
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      
      // Vérifier pour le dropdown de pickup
      if (
        pickupDropdownRef.current &&
        pickupInputRef.current &&
        !pickupDropdownRef.current.contains(event.target as Node) &&
        !pickupInputRef.current.contains(event.target as Node)
      ) {
        setShowPickupDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Initialiser la carte Leaflet
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      // Vérifier si Leaflet est chargé
      if (typeof window !== 'undefined' && window.L) {
        // Coordonnées par défaut (Rabat, Maroc)
        const defaultLat = 34.0209;
        const defaultLng = -6.8416;
        const defaultZoom = 13;

        try {
          // Créer la carte
          const map = window.L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          }).setView([defaultLat, defaultLng], defaultZoom);

          // Ajouter la couche de tuiles OpenStreetMap
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Stocker l'instance de la carte
          mapInstanceRef.current = map;

          // Forcer le redimensionnement après un court délai pour s'assurer que le conteneur est visible
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 100);
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de la carte:', error);
        }
      } else {
        // Si Leaflet n'est pas encore chargé, réessayer après un court délai
        setTimeout(initMap, 100);
      }
    };

    // Démarrer l'initialisation
    initMap();

    // Nettoyer lors du démontage
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        // Nettoyer la route si elle existe
        if (routePolylineRef.current) {
          try {
            mapInstanceRef.current.removeLayer(routePolylineRef.current);
          } catch (error) {
            // Ignorer les erreurs si la couche n'existe plus
          }
          routePolylineRef.current = null;
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Nettoyer les timeouts
      if (routeCalculationTimeoutRef.current) {
        clearTimeout(routeCalculationTimeoutRef.current);
      }
    };
  }, []);

  // Redimensionner la carte quand la fenêtre change de taille
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ajouter un marqueur sur la carte quand la localisation actuelle est détectée
  useEffect(() => {
    if (mapInstanceRef.current && currentLocation && window.L) {
      const { lat, lng } = currentLocation;

      // Supprimer le marqueur précédent s'il existe
      if (currentLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
        currentLocationMarkerRef.current = null;
      }

      // Créer un marqueur personnalisé avec une icône de localisation
      const customIcon = window.L.divIcon({
        className: 'current-location-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: #000000;
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      // Créer et ajouter le marqueur
      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current);

      // Centrer la carte sur la position actuelle
      mapInstanceRef.current.setView([lat, lng], 15);

      // Stocker la référence du marqueur
      currentLocationMarkerRef.current = marker;

      // Ajouter un popup avec l'adresse si disponible
      if (currentAddress) {
        marker.bindPopup(`<strong>${currentAddress}</strong><br>Votre emplacement actuel`).openPopup();
      }
    }

    // Nettoyer le marqueur lors du démontage
    return () => {
      if (currentLocationMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
        currentLocationMarkerRef.current = null;
      }
    };
  }, [currentLocation, currentAddress]);

  // Fonction pour géocoder les coordonnées en adresse
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.house_number) addressParts.push(data.address.house_number);
        if (addressParts.length === 0 && data.address.suburb) addressParts.push(data.address.suburb);
        if (addressParts.length === 0 && data.address.city) addressParts.push(data.address.city);
        
        const fullAddress = addressParts.length > 0 
          ? addressParts.join(' ')
          : data.display_name?.split(',')[0] || 'Emplacement sélectionné';
        return fullAddress;
      }
      return 'Emplacement sélectionné';
    } catch (error) {
      console.error('Erreur lors du géocodage:', error);
      return 'Emplacement sélectionné';
    }
  };

  // Fonction pour géocoder une adresse en coordonnées
  const geocode = async (address: string): Promise<LocationCoords | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du géocodage:', error);
      return null;
    }
  };

  // Fonction pour nettoyer la route existante
  const clearRoute = useCallback(() => {
    if (routePolylineRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
      } catch (error) {
        // Ignorer les erreurs si la couche n'existe plus
      }
      routePolylineRef.current = null;
    }
    setRouteError(null);
  }, []);

  // Fonction pour calculer et dessiner la route avec gestion améliorée
  const drawRoute = useCallback(async (force = false) => {
    // Éviter les appels multiples simultanés
    if (isCalculatingRef.current && !force) {
      return;
    }

    if (!mapInstanceRef.current || !window.L) return;

    // Nettoyer l'ancienne route
    clearRoute();

    // Construire la liste des points (pickup + arrêts + destination)
    const waypoints = [];
    
    try {
      // Ajouter le point de départ
      if (pickupCoordsRef.current) {
        waypoints.push(pickupCoordsRef.current);
      } else if (pickup && pickup.trim()) {
        // Si on a l'adresse mais pas les coordonnées, géocoder
        setIsCalculatingRoute(true);
        const coords = await geocode(pickup);
        if (coords) {
          pickupCoordsRef.current = coords;
          waypoints.push(coords);
        } else {
          setRouteError('Impossible de trouver le lieu de prise en charge');
          setIsCalculatingRoute(false);
          return;
        }
      }

      // Ajouter les arrêts valides
      const validStops = stops.filter(stop => stop.lat && stop.lng && 
        typeof stop.lat === 'number' && typeof stop.lng === 'number' &&
        !isNaN(stop.lat) && !isNaN(stop.lng));
      
      validStops.forEach(stop => {
        waypoints.push({ lat: stop.lat, lng: stop.lng });
      });

      // Ajouter la destination (optionnelle)
      if (destinationCoordsRef.current) {
        waypoints.push(destinationCoordsRef.current);
      } else if (destination && destination.trim()) {
        // Si on a l'adresse mais pas les coordonnées, géocoder
        const coords = await geocode(destination);
        if (coords) {
          destinationCoordsRef.current = coords;
          waypoints.push(coords);
        } else {
          // Ne pas bloquer si la destination n'est pas trouvée, juste ne pas l'ajouter
          console.warn('Impossible de trouver la destination, continuation sans destination');
        }
      }

      // Si on a moins de 2 points, on ne peut pas dessiner de route
      // Mais on peut avoir juste le pickup si l'utilisateur n'a pas encore saisi de destination
      if (waypoints.length < 1) {
        setIsCalculatingRoute(false);
        return;
      }
      
      // Si on n'a qu'un seul point (juste le pickup), on ne dessine pas de route mais on affiche le marqueur
      if (waypoints.length < 2) {
        setIsCalculatingRoute(false);
        // Nettoyer la route existante car on n'a pas assez de points
        clearRoute();
        return;
      }

      // Vérifier que tous les waypoints ont des coordonnées valides
      const invalidWaypoint = waypoints.find(wp => 
        !wp || typeof wp.lat !== 'number' || typeof wp.lng !== 'number' ||
        isNaN(wp.lat) || isNaN(wp.lng) ||
        wp.lat < -90 || wp.lat > 90 || wp.lng < -180 || wp.lng > 180
      );

      if (invalidWaypoint) {
        setRouteError('Coordonnées invalides pour un des points');
        setIsCalculatingRoute(false);
        return;
      }

      isCalculatingRef.current = true;
      setIsCalculatingRoute(true);
      setRouteError(null);

      // Construire l'URL pour OSRM
      const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=false`;

      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 secondes

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        if (!route.geometry || !route.geometry.coordinates || route.geometry.coordinates.length === 0) {
          throw new Error('Route invalide retournée par le service');
        }

        const routeCoordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]); // OSRM retourne [lng, lat], Leaflet attend [lat, lng]

        // Vérifier que la carte existe toujours avant d'ajouter la route
        if (!mapInstanceRef.current) {
          return;
        }

        // Créer la polyline pour la route avec un style amélioré
        routePolylineRef.current = window.L.polyline(routeCoordinates, {
          color: '#000000',
          weight: 6,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
          smoothFactor: 1.0
        }).addTo(mapInstanceRef.current);

        // Ajouter un popup avec les informations de la route
        const distance = route.distance ? (route.distance / 1000).toFixed(1) : 'N/A';
        const duration = route.duration ? Math.round(route.duration / 60) : 'N/A';
        routePolylineRef.current.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <strong>Distance:</strong> ${distance} km<br>
            <strong>Durée estimée:</strong> ${duration} min
          </div>
        `);

        // Ajuster la vue pour afficher toute la route avec animation
        if (waypoints.length > 0) {
          const bounds = waypoints.map(wp => [wp.lat, wp.lng]);
          mapInstanceRef.current.fitBounds(bounds, { 
            padding: [80, 80],
            maxZoom: 15
          });
        }

        setRouteError(null);
      } else if (data.code === 'NoRoute') {
        setRouteError('Aucun itinéraire trouvé entre les points sélectionnés');
      } else {
        setRouteError('Impossible de calculer l\'itinéraire');
      }
    } catch (error) {
      console.error('Erreur lors du calcul de la route:', error);
      if (error instanceof Error && (error.name === 'AbortError' || error.message?.includes('aborted'))) {
        setRouteError('Le calcul de l\'itinéraire a pris trop de temps');
      } else if (error instanceof Error && error.message) {
        setRouteError(error.message);
      } else {
        setRouteError('Erreur lors du calcul de l\'itinéraire');
      }
    } finally {
      isCalculatingRef.current = false;
      setIsCalculatingRoute(false);
    }
  }, [pickup, destination, stops, clearRoute]);

  // Gérer le clic sur la carte pour sélectionner un emplacement
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const handleMapClick = async (e: any) => {
      if (!selectingLocation) return;
      
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);

      if (selectingLocation === 'pickup') {
        setPickup(address);
        pickupCoordsRef.current = { lat, lng };
        setSelectingLocation(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.getContainer().style.cursor = '';
        }
        // Recalculer la route après la mise à jour avec debounce
        if (routeCalculationTimeoutRef.current) {
          clearTimeout(routeCalculationTimeoutRef.current);
        }
        routeCalculationTimeoutRef.current = setTimeout(() => {
          drawRoute(true);
        }, 300);
      } else if (selectingLocation === 'destination') {
        setDestination(address);
        destinationCoordsRef.current = { lat, lng };
        setSelectingLocation(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.getContainer().style.cursor = '';
        }
        // Recalculer la route après la mise à jour avec debounce
        if (routeCalculationTimeoutRef.current) {
          clearTimeout(routeCalculationTimeoutRef.current);
        }
        routeCalculationTimeoutRef.current = setTimeout(() => {
          drawRoute(true);
        }, 300);
      } else {
        // C'est un arrêt
        const stopId = selectingLocation;
        setStops(prevStops => 
          prevStops.map(stop => 
            stop.id === stopId 
              ? { ...stop, address, lat, lng }
              : stop
          )
        );
        setSelectingLocation(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.getContainer().style.cursor = '';
        }
        // Recalculer la route après la mise à jour avec debounce
        if (routeCalculationTimeoutRef.current) {
          clearTimeout(routeCalculationTimeoutRef.current);
        }
        routeCalculationTimeoutRef.current = setTimeout(() => {
          drawRoute(true);
        }, 300);
      }
    };

    if (selectingLocation) {
      mapInstanceRef.current.on('click', handleMapClick);
      // Changer le curseur pour indiquer qu'on peut cliquer
      mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick);
        if (!selectingLocation) {
          mapInstanceRef.current.getContainer().style.cursor = '';
        }
      }
    };
  }, [selectingLocation, drawRoute]);

  // Mettre à jour les marqueurs sur la carte
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Marqueur pour pickup
    if (pickupCoordsRef.current) {
      if (pickupMarkerRef.current) {
        mapInstanceRef.current.removeLayer(pickupMarkerRef.current);
      }
      const pickupIcon = window.L.divIcon({
        className: 'pickup-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: #006233;
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      pickupMarkerRef.current = window.L.marker(
        [pickupCoordsRef.current.lat, pickupCoordsRef.current.lng],
        { icon: pickupIcon }
      ).addTo(mapInstanceRef.current);
      pickupMarkerRef.current.bindPopup(`<strong>Prise en charge</strong><br>${pickup}`);
    }

    // Marqueur pour destination
    if (destinationCoordsRef.current) {
      if (destinationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
      }
      const destIcon = window.L.divIcon({
        className: 'destination-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: #C1272D;
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      destinationMarkerRef.current = window.L.marker(
        [destinationCoordsRef.current.lat, destinationCoordsRef.current.lng],
        { icon: destIcon }
      ).addTo(mapInstanceRef.current);
      destinationMarkerRef.current.bindPopup(`<strong>Destination</strong><br>${destination}`);
    }

    // Marqueurs pour les arrêts
    stopsMarkersRef.current.forEach(marker => {
      if (marker && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    stopsMarkersRef.current = [];

    stops.forEach((stop, index) => {
      if (stop.lat && stop.lng) {
        const stopIcon = window.L.divIcon({
          className: 'stop-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: #6b7280;
              border: 3px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = window.L.marker(
          [stop.lat, stop.lng],
          { icon: stopIcon }
        ).addTo(mapInstanceRef.current);
        marker.bindPopup(`<strong>Arrêt ${index + 1}</strong><br>${stop.address}`);
        stopsMarkersRef.current.push(marker);
      }
    });

    // Dessiner la route si on a au moins le pickup (destination est optionnelle)
    // On peut dessiner une route avec juste pickup + arrêts, ou pickup + destination, ou pickup + arrêts + destination
    if (pickupCoordsRef.current || pickup) {
      // Annuler le timeout précédent s'il existe
      if (routeCalculationTimeoutRef.current) {
        clearTimeout(routeCalculationTimeoutRef.current);
      }
      // Attendre un peu avant de recalculer pour éviter trop d'appels
      routeCalculationTimeoutRef.current = setTimeout(() => {
        drawRoute();
      }, 500);
    } else {
      // Si on n'a plus de point de départ, nettoyer la route
      clearRoute();
    }

    // Nettoyer le timeout lors du démontage
    return () => {
      if (routeCalculationTimeoutRef.current) {
        clearTimeout(routeCalculationTimeoutRef.current);
      }
    };
  }, [pickup, destination, stops, drawRoute, clearRoute]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche de prix
    const route = {
      pickup,
      destination,
      stops: stops.filter(stop => stop.address && stop.lat && stop.lng),
      passengerType
    };
    console.log('Recherche de prix:', route);
    // Ici vous pouvez ajouter la logique pour rechercher les prix et afficher les résultats
  };

  return (
    <div className="ride-booking-page">
      {/* Header */}
      <header className="booking-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(to bottom right, #C1272D, #006233)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>G</span>
              </div>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                background: 'linear-gradient(to right, #C1272D, #006233)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Grab Morocco</span>
            </div>
            <nav className="header-nav">
              <button className="nav-tab active">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Course</span>
              </button>
            </nav>
          </div>
          
          <div className="header-right">
            <button className="header-icon-btn" aria-label="Activité">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                ref={profileButtonRef}
                className="header-icon-btn" 
                aria-label="Profil"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div 
                  ref={profileMenuRef}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    minWidth: '320px',
                    zIndex: 1000,
                    padding: '20px',
                  }}
                >
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>{userName}</h3>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: '#6b7280' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Aide</span>
                    </button>
                    
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Wallet</span>
                    </button>
                    
                    <button style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#000' }}>Activité</span>
                    </button>
                  </div>

                  {/* Grab Morocco Cash */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>Grab Morocco Cash</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>0,00 MAD</span>
                  </div>

                  {/* Account Links */}
                  <div style={{ marginBottom: '20px' }}>
                    <button style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: '#000' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#000' }}>Gérer le compte</span>
                    </button>
                    
                    <button style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: '#000' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span style={{ fontSize: '14px', color: '#000' }}>Bonus</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#C1272D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a01f24'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1272D'}
                  onClick={() => {
                    // Logique de déconnexion
                    setShowProfileMenu(false);
                  }}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
            <button className="header-icon-btn" aria-label="Menu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="booking-layout">
        {/* Left Sidebar */}
        <aside className="booking-sidebar">
          <h1 className="sidebar-title">Commander une course</h1>
          
          <form onSubmit={handleSearch} className="booking-form">
            {/* Pickup Location */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lieu de prise en charge
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  ref={pickupInputRef}
                  type="text"
                  className="field-input"
                  placeholder="Lieu de prise en charge"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => {
                    setShowPickupDropdown(true);
                  }}
                  onClick={() => {
                    setShowPickupDropdown(true);
                  }}
                  required
                />
                {showPickupDropdown && (
                  <div 
                    ref={pickupDropdownRef}
                    className="pickup-dropdown"
                  >
                    {currentAddress && (
                      <button
                        type="button"
                        className="pickup-option pickup-option-current"
                        onClick={() => {
                          setPickup(currentAddress);
                          if (currentLocation) {
                            pickupCoordsRef.current = { lat: currentLocation.lat, lng: currentLocation.lng };
                          }
                          setShowPickupDropdown(false);
                        }}
                      >
                        <div className="pickup-option-icon pickup-option-icon-current">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="pickup-option-content">
                          <div className="pickup-option-title">{currentAddress}</div>
                          <div className="pickup-option-subtitle">Votre emplacement actuel</div>
                        </div>
                      </button>
                    )}
                    <button
                      type="button"
                      className="pickup-option pickup-option-manual"
                      onClick={() => {
                        setShowPickupDropdown(false);
                        setSelectingLocation('pickup');
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
                        }
                      }}
                    >
                      <div className="pickup-option-icon pickup-option-icon-manual">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="pickup-option-content">
                        <div className="pickup-option-title">Indiquer l'emplacement sur la carte</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="form-field">
              <label className="field-label">
                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Destination
              </label>
              <div className="field-input-wrapper">
                <input
                  type="text"
                  className="field-input"
                  placeholder="Où allez-vous ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onClick={() => {
                    setSelectingLocation('destination');
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="add-destination-btn" 
                  aria-label="Ajouter un arrêt"
                  onClick={() => {
                    if (stops.length < 4) {
                      const newStopId = `stop-${Date.now()}`;
                      setStops(prev => [...prev, { id: newStopId, address: '', lat: null, lng: null }]);
                      setSelectingLocation(newStopId);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
                      }
                    } else {
                      alert('Maximum 4 arrêts autorisés');
                    }
                  }}
                  disabled={stops.length >= 4}
                  style={{ 
                    opacity: stops.length >= 4 ? 0.5 : 1,
                    cursor: stops.length >= 4 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Arrêts */}
            {stops.map((stop, index) => (
              <div key={stop.id} className="form-field">
                <label className="field-label">
                  <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Arrêt {index + 1}
                </label>
                <div className="field-input-wrapper">
                  <input
                    type="text"
                    className="field-input"
                    placeholder={`Arrêt ${index + 1}`}
                    value={stop.address}
                    onChange={(e) => {
                      setStops(prev => 
                        prev.map(s => 
                          s.id === stop.id ? { ...s, address: e.target.value } : s
                        )
                      );
                    }}
                    onClick={() => {
                      setSelectingLocation(stop.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="add-destination-btn" 
                    aria-label="Supprimer l'arrêt"
                    onClick={() => {
                      setStops(prev => prev.filter(s => s.id !== stop.id));
                      // Supprimer le marqueur de la carte
                      const markerIndex = stopsMarkersRef.current.findIndex((_, i) => {
                        const stopIndex = stops.findIndex(s => s.id === stop.id);
                        return i === stopIndex;
                      });
                      if (markerIndex !== -1 && stopsMarkersRef.current[markerIndex] && mapInstanceRef.current) {
                        mapInstanceRef.current.removeLayer(stopsMarkersRef.current[markerIndex]);
                        stopsMarkersRef.current.splice(markerIndex, 1);
                      }
                    }}
                    style={{ 
                      backgroundColor: '#C1272D',
                      color: 'white'
                    }}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            

            {/* Search Button */}
            <button type="submit" className="search-button">
              Rechercher
            </button>
          </form>
        </aside>

        {/* Right Map Area */}
        <div className="map-container">
          <div id="map" ref={mapRef} className="leaflet-map"></div>
          {selectingLocation && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              {selectingLocation === 'pickup' && 'Cliquez sur la carte pour sélectionner le lieu de prise en charge'}
              {selectingLocation === 'destination' && 'Cliquez sur la carte pour sélectionner la destination'}
              {selectingLocation !== 'pickup' && selectingLocation !== 'destination' && 'Cliquez sur la carte pour sélectionner l\'arrêt'}
            </div>
          )}
          
          {/* Indicateur de chargement de la route */}
          {isCalculatingRoute && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              zIndex: 1000,
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #006233',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              Calcul de l'itinéraire...
            </div>
          )}

          {/* Message d'erreur de la route */}
          {routeError && !isCalculatingRoute && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#C1272D',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '300px',
              cursor: 'pointer'
            }}
            onClick={() => setRouteError(null)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{routeError}</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0, marginLeft: 'auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideBooking;
