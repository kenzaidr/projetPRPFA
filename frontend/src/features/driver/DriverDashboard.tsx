import { useState, useEffect, useRef } from 'react';
import { 
  Car, MapPin, DollarSign, Clock, Star, Bell, Menu, Power, 
  Navigation, User, Settings, LogOut, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RideRequest } from '../../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { driverService, type DriverStatsResponse } from '../../services/driverService';

// Define Leaflet on window
declare global {
  interface Window {
    L: any;
  }
}

// Order interface matching backend DriverOrder model
interface Order {
  id: number;
  userId: number;
  driverId: number | null;
  pickupAddress: string; // Where driver picks up the user
  deliveryAddress: string; // Where driver takes the user
  phone: string;
  instructions: string | null;
  modePaiement: string | null;
  codePromo: string | null;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'profile'>('overview');
  const [showSidebar, setShowSidebar] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<RideRequest | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null); // [lat, lng]
  const [locationError, setLocationError] = useState<string | null>(null);
  const [stats, setStats] = useState<DriverStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]); // All orders for earnings chart
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState<Order | null>(null); // Currently accepted order
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const routeToPickupRef = useRef<any>(null);
  const routeToDestinationRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  // Fetch Driver Stats
  useEffect(() => {
    const fetchStats = async () => {
      const driverId = parseInt(localStorage.getItem('driverId') || '0');
      if (!driverId) {
        setStatsError('Driver ID not found. Please login again.');
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        setStatsError(null);
        const data = await driverService.getStats(driverId);
        setStats(data);
        // Sync online status from backend
        if (data.isOnline !== undefined) {
          setIsOnline(data.isOnline);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStatsError('Failed to load driver statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch Driver Orders
  useEffect(() => {
    const fetchOrders = async () => {
      const driverId = parseInt(localStorage.getItem('driverId') || '0');
      if (!driverId) {
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        const orders = await driverService.getOrders(driverId);
        
        // Store all orders for earnings chart
        setAllOrders(orders);
        
        // Sort by orderDate (most recent first) and take only the last 5 for Recent Activity
        const sortedOrders = orders
          .sort((a: Order, b: Order) => {
            const dateA = new Date(a.orderDate).getTime();
            const dateB = new Date(b.orderDate).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setRecentOrders([]);
        setAllOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch Driver Profile when profile tab is active
  useEffect(() => {
    const fetchProfile = async () => {
      if (activeTab !== 'profile') return;
      
      const driverId = parseInt(localStorage.getItem('driverId') || '0');
      if (!driverId) {
        return;
      }

      try {
        setProfileLoading(true);
        const profile = await driverService.getProfile(driverId);
        setDriverProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [activeTab]);

  // Helper function to format date
  const formatOrderDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } catch {
      return '';
    }
  };

  // Helper function to extract location name from address
  const extractLocationName = (address: string): string => {
    // Try to extract a meaningful location name
    // If address contains common patterns, extract them
    const parts = address.split(',');
    if (parts.length > 0) {
      return parts[0].trim();
    }
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
  };

  // Helper function to format date for "Since" display
  const formatSinceDate = (dateString: string | null): string => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return 'Recently';
    }
  };

  // Helper function to get partner tier based on rating/total rides
  const getPartnerTier = (rating: number | null, totalRides: number | null): string => {
    if (!rating && !totalRides) return 'New Partner';
    if (rating && rating >= 4.8 && totalRides && totalRides >= 100) return 'Gold Partner';
    if (rating && rating >= 4.5 && totalRides && totalRides >= 50) return 'Silver Partner';
    if (rating && rating >= 4.0) return 'Bronze Partner';
    return 'Partner';
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Calculate estimated time based on distance (assuming average speed of 30 km/h in city)
  const calculateEstimatedTime = (distanceKm: number): number => {
    const averageSpeed = 30; // km/h
    return Math.round((distanceKm / averageSpeed) * 60); // minutes
  };

  // Hardcoded coordinates for common Fes locations (more specific matches first)
  const FES_LOCATIONS: { [key: string]: [number, number] } = {
    'bab boujloud': [34.0631, -4.9738], // Bab Boujloud (Blue Gate) - Medina entrance
    'bab bou jloud': [34.0631, -4.9738],
    'fes medina': [34.0641, -4.9738],
    'medina fes': [34.0641, -4.9738],
    'gare fes-ville': [34.0372, -4.9998], // Train station
    'gare fes ville': [34.0372, -4.9998],
    'fes train station': [34.0372, -4.9998],
    'gare fes': [34.0372, -4.9998],
    'train station fes': [34.0372, -4.9998],
    'avenue mohammed v': [34.0372, -4.9998],
    'fes ville nouvelle': [34.0372, -4.9998],
    'ville nouvelle fes': [34.0372, -4.9998],
    'borj fes': [34.0520, -4.9820],
    'borj nord': [34.0520, -4.9820],
    'université sidi mohammed ben abdellah': [34.0200, -5.0000],
    'université fes': [34.0200, -5.0000],
    'aéroport fes': [33.9273, -4.9780],
    'fes airport': [33.9273, -4.9780],
    'fes': [34.0372, -4.9998],
    'fez': [34.0372, -4.9998]
  };

  // Fes city bounds (approximate)
  const FES_BOUNDS = {
    minLat: 33.9,
    maxLat: 34.2,
    minLng: -5.1,
    maxLng: -4.9
  };

  // Check if coordinates are within Fes bounds
  const isWithinFesBounds = (coords: [number, number]): boolean => {
    const [lat, lng] = coords;
    return lat >= FES_BOUNDS.minLat && lat <= FES_BOUNDS.maxLat &&
           lng >= FES_BOUNDS.minLng && lng <= FES_BOUNDS.maxLng;
  };

  // Clamp coordinates to Fes bounds if they're outside
  const clampToFesBounds = (coords: [number, number]): [number, number] => {
    let [lat, lng] = coords;
    
    // Clamp latitude
    if (lat < FES_BOUNDS.minLat) lat = FES_BOUNDS.minLat;
    if (lat > FES_BOUNDS.maxLat) lat = FES_BOUNDS.maxLat;
    
    // Clamp longitude
    if (lng < FES_BOUNDS.minLng) lng = FES_BOUNDS.minLng;
    if (lng > FES_BOUNDS.maxLng) lng = FES_BOUNDS.maxLng;
    
    return [lat, lng];
  };

  // Get route from routing service (OSRM - Open Source Routing Machine)
  const getRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][] | null> => {
    try {
      console.log('Fetching route from routing service:', { start, end });
      // OSRM format: /route/v1/{profile}/{coordinates}?overview=full&geometries=geojson
      // coordinates format: {lon1},{lat1};{lon2},{lat2}
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const geometry = route.geometry;
        
        // Convert GeoJSON coordinates [lon, lat] to Leaflet format [lat, lon]
        const coordinates: [number, number][] = geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        console.log('Route fetched successfully, points:', coordinates.length);
        return coordinates;
      } else {
        console.warn('No route found from routing service:', data);
        // Fallback to straight line
        return [start, end];
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line if routing fails
      return [start, end];
    }
  };

  // Geocode address to coordinates using Nominatim (OpenStreetMap)
  // For destinations, ensures coordinates are within Fes bounds
  const geocodeAddress = async (address: string, isDestination: boolean = false): Promise<[number, number] | null> => {
    try {
      console.log('Geocoding address:', address, isDestination ? '(destination - will enforce Fes bounds)' : '');
      
      // First, try to find in hardcoded locations (case-insensitive)
      // Sort by key length (longest first) to match more specific locations first
      const addressLower = address.toLowerCase().trim();
      const sortedKeys = Object.keys(FES_LOCATIONS).sort((a, b) => b.length - a.length);
      
      for (const key of sortedKeys) {
        if (addressLower.includes(key)) {
          const coords = FES_LOCATIONS[key];
          console.log('Found in hardcoded locations:', key, '->', coords);
          // Ensure it's within bounds (should be, but double-check)
          return isWithinFesBounds(coords) ? coords : clampToFesBounds(coords);
        }
      }
      
      // Always append "Fes, Morocco" to ensure we get Fes locations
      let searchQuery = address;
      if (!addressLower.includes('fes') && !addressLower.includes('fez') && !addressLower.includes('morocco')) {
        searchQuery = address + ', Fes, Morocco';
      }
      
      // Try geocoding service with Fes constraint
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=ma&bounded=1&viewbox=-5.1,33.9,-4.9,34.2`,
        {
          headers: {
            'User-Agent': 'MMHK-Delivery-App'
          }
        }
      );
      const data = await response.json();
      console.log('Geocoding response:', data);
      
      if (data && data.length > 0) {
        // Find the first result within Fes bounds
        for (const result of data) {
          const coords: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
          if (isWithinFesBounds(coords)) {
            console.log('Geocoded coordinates (within Fes):', coords);
            return coords;
          }
        }
        
        // If no result is within bounds, use the first one but clamp it
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        if (isDestination) {
          // For destinations, clamp to Fes bounds
          const clampedCoords = clampToFesBounds(coords);
          console.log('Geocoded coordinates (clamped to Fes bounds):', clampedCoords, 'from:', coords);
          return clampedCoords;
        } else {
          // For pickup, return as-is (might be slightly outside)
          console.log('Geocoded coordinates:', coords);
          return coords;
        }
      }
      
      console.warn('No geocoding results for address:', address);
      // Final fallback: return Fes center coordinates
      console.log('Using fallback coordinates for Fes');
      return [34.0372, -4.9998];
    } catch (error) {
      console.error('Error geocoding address:', error, address);
      // Fallback: return Fes center coordinates
      return [34.0372, -4.9998];
    }
  };

  // Get User's Current Location from Browser
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      // Fallback to Fes
      setUserLocation([34.0372, -4.9998]);
      return;
    }

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Browser location obtained:', latitude, longitude);
          setUserLocation([latitude, longitude]);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMsg = 'Unable to get your location. ';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg += 'Please allow location access in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg += 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg += 'Location request timed out.';
          }
          setLocationError(errorMsg);
          // Fallback to Fes
          setUserLocation([34.0372, -4.9998]);
        },
        {
          enableHighAccuracy: true, // Use GPS if available
          timeout: 15000, // Increased timeout
          maximumAge: 0 // Always get fresh location
        }
      );
    };

    getLocation();
  }, []);

  // Watch position when online - continuously update from browser GPS
  useEffect(() => {
    if (isOnline && userLocation) {
      if (navigator.geolocation) {
        console.log('Starting location watch for live updates...');
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation: [number, number] = [latitude, longitude];
            console.log('Live location update:', newLocation);
            setUserLocation(newLocation);
            
            // Update marker position if map is initialized
            if (mapInstanceRef.current && driverMarkerRef.current && typeof window.L !== 'undefined') {
              driverMarkerRef.current.setLatLng(newLocation);
              // Don't pan the map on every update - only update marker position
              // This prevents the zigzag/jumping effect
            }
          },
          (error) => {
            console.error('Error watching position:', error);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationError('Location permission denied. Please enable location access.');
            }
          },
          {
            enableHighAccuracy: true, // Use GPS for better accuracy
            timeout: 10000,
            maximumAge: 2000 // Accept location up to 2 seconds old
          }
        );
      }
    } else {
      // Stop watching when offline
      if (watchIdRef.current !== null) {
        console.log('Stopping location watch (going offline)');
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOnline, userLocation]);

  // Initialize Map
  useEffect(() => {
    // Wait for user location or use default
    const defaultLocation: [number, number] = userLocation || [34.0372, -4.9998];
    
    // Small delay to ensure Leaflet loads
    const initMap = () => {
      if (typeof window.L !== 'undefined' && mapContainerRef.current && !mapInstanceRef.current) {
        const map = window.L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView(defaultLocation, 13);

        // Use CartoDB Voyager tiles for a cleaner, app-like look
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;
        
        // Center on user location if available
        if (userLocation) {
          map.flyTo(userLocation, 15, {
            animate: true,
            duration: 1.5
          });
        }
      }
    };

    // Try to init immediately, if fail retry after 500ms (script load time)
    initMap();
    const timer = setTimeout(initMap, 1000);
    return () => clearTimeout(timer);
  }, [activeTab, userLocation]); // Re-init if tab changes or location is available

  // Track if we've already centered the map when going online
  const hasCenteredOnOnlineRef = useRef(false);

  // Handle Online Status & Map Marker
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window.L === 'undefined' || !userLocation) return;

    if (isOnline) {
      // Add or update Driver Marker
      if (!driverMarkerRef.current) {
        const driverIcon = window.L.divIcon({
          className: 'custom-driver-icon',
          html: `<div class="relative w-8 h-8 flex items-center justify-center">
                  <div class="absolute w-full h-full bg-morocco-red/30 rounded-full animate-ping"></div>
                  <div class="relative w-4 h-4 bg-morocco-red border-2 border-white rounded-full shadow-lg"></div>
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        driverMarkerRef.current = window.L.marker(userLocation, { icon: driverIcon }).addTo(mapInstanceRef.current);
        
        // Center map only when marker is first created (when going online)
        mapInstanceRef.current.flyTo(userLocation, 15, {
          animate: true,
          duration: 1.5
        });
        hasCenteredOnOnlineRef.current = true;
      } else {
        // Just update marker position without moving the map
        // This prevents the zigzag effect
        driverMarkerRef.current.setLatLng(userLocation);
      }
    } else {
      // Reset the flag when going offline
      hasCenteredOnOnlineRef.current = false;
      
      // Remove Driver Marker
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
      
      // Zoom out to city view
      mapInstanceRef.current.flyTo(userLocation, 13, {
        animate: true,
        duration: 1.5
      });
    }
  }, [isOnline, userLocation]);

  // Fetch available orders when online
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let previousOrderId: number | null = null;
    
    const fetchAvailableOrders = async () => {
      if (!isOnline) {
        setIncomingRequest(null);
        return;
      }

      try {
        console.log('Fetching available orders...');
        const orders = await driverService.getAvailableOrders();
        console.log('Available orders received:', orders);
        
        // If there are available orders, show the first one
        if (orders && orders.length > 0) {
          const order = orders[0];
          
          // Play sound notification if this is a new order
          if (previousOrderId !== order.id) {
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZkDkI');
              audio.volume = 0.3;
              audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
            } catch (e) {
              // Fallback: use Web Audio API
              try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
              } catch (e2) {
                console.log('Audio notification not available');
              }
            }
            previousOrderId = order.id;
          }
          
          console.log('Displaying order:', order);
          
          // Calculate distance and time if we have user location
          let distance = 'N/A';
          let time = '15 min';
          if (userLocation) {
            try {
              // Geocode pickup location to get distance
              const pickupCoords = await geocodeAddress(order.pickupAddress || '', false);
              if (pickupCoords) {
                const dist = calculateDistance(userLocation[0], userLocation[1], pickupCoords[0], pickupCoords[1]);
                distance = `${dist.toFixed(1)} km`;
                const estTime = calculateEstimatedTime(dist);
                time = `${estTime} min`;
              }
            } catch (e) {
              console.log('Could not calculate distance');
            }
          }
          
          // Convert Order to RideRequest format for display
          const rideRequest: RideRequest = {
            id: order.id.toString(),
            passengerName: order.phone || 'Customer', // Using phone as identifier
            pickupLocation: order.pickupAddress || 'Pickup Location', // Where driver picks up the user
            dropoffLocation: order.deliveryAddress || 'Delivery Address',
            price: order.totalAmount || 0,
            distance: distance,
            rating: 4.5, // Default rating
            time: time
          };
          
          setIncomingRequest(rideRequest);
        } else {
          console.log('No available orders found');
          setIncomingRequest(null);
          previousOrderId = null;
        }
      } catch (error) {
        console.error('Error fetching available orders:', error);
        // Show error in console for debugging
        setIncomingRequest(null);
      }
    };

    if (isOnline) {
      // Fetch immediately
      fetchAvailableOrders();
      
      // Then poll every 5 seconds for new orders
      interval = setInterval(fetchAvailableOrders, 5000);
    } else {
      setIncomingRequest(null);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOnline]);

  const toggleOnline = async () => {
    const driverId = parseInt(localStorage.getItem('driverId') || '0');
    if (!driverId) {
      alert('Driver ID not found. Please login again.');
      return;
    }

    const newStatus = !isOnline;
    try {
      await driverService.updateStatus(driverId, newStatus);
      setIsOnline(newStatus);
      // Refresh stats after status change
      const data = await driverService.getStats(driverId);
      setStats(data);
      showToast(newStatus ? 'You are now online!' : 'You are now offline.', 'success');
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.message || 'Failed to update online status';
      showToast(errorMessage, 'error');
    }
  };

  const handleAcceptRide = async () => {
    if (!incomingRequest) return;

    const driverId = parseInt(localStorage.getItem('driverId') || '0');
    if (!driverId) {
      alert('Driver ID not found. Please login again.');
      return;
    }

    // Extract order ID from incoming request
    // The id should be a string representation of the order ID
    const orderId = parseInt(incomingRequest.id);

    if (isNaN(orderId)) {
      alert('Invalid order ID.');
      setIncomingRequest(null);
      return;
    }

    console.log('Attempting to accept order:', { driverId, orderId, request: incomingRequest });

    try {
      const acceptedOrderData = await driverService.acceptOrder(driverId, orderId);
      
      // Store the accepted order to show on map
      setAcceptedOrder(acceptedOrderData);
      
      // Geocode and show pickup and destination on map
      console.log('Accepted order data:', acceptedOrderData);
      console.log('Order keys:', Object.keys(acceptedOrderData));
      console.log('Full order object:', JSON.stringify(acceptedOrderData, null, 2));
      console.log('pickupAddress:', acceptedOrderData.pickupAddress);
      console.log('deliveryAddress:', acceptedOrderData.deliveryAddress);
      console.log('pickup_address (snake_case):', acceptedOrderData.pickup_address);
      console.log('delivery_address (snake_case):', acceptedOrderData.delivery_address);
      console.log('Map instance available:', !!mapInstanceRef.current);
      console.log('Leaflet available:', typeof window.L !== 'undefined');
      
      // Check if we have the required data (try both camelCase and snake_case)
      let pickupAddr = acceptedOrderData.pickupAddress || acceptedOrderData.pickup_address;
      const deliveryAddr = acceptedOrderData.deliveryAddress || acceptedOrderData.delivery_address;
      
      // Fallback: If pickup address is missing, use a default or try to infer from delivery
      if (!pickupAddr && deliveryAddr) {
        // Use a default pickup location in Fes
        pickupAddr = 'Fes Train Station, Fes';
        console.warn('Pickup address missing, using default:', pickupAddr);
      }
      
      const hasPickup = !!pickupAddr;
      const hasDelivery = !!deliveryAddr;
      const hasMap = !!mapInstanceRef.current;
      const hasLeaflet = typeof window.L !== 'undefined';
      
      console.log('Route drawing conditions:', { hasPickup, hasDelivery, hasMap, hasLeaflet });
      console.log('Pickup address:', pickupAddr);
      console.log('Delivery address:', deliveryAddr);
      
      if (hasPickup && hasDelivery && hasMap && hasLeaflet) {
        console.log('Geocoding addresses...', {
          pickup: pickupAddr,
          destination: deliveryAddr
        });
        
        let pickupCoords = await geocodeAddress(pickupAddr, false);
        let destinationCoords = await geocodeAddress(deliveryAddr, true); // true = enforce Fes bounds
        
        console.log('Geocoded coordinates:', { pickupCoords, destinationCoords, userLocation });
        
        // Ensure pickup and destination are different locations
        if (pickupCoords && destinationCoords) {
          const [pickupLat, pickupLng] = pickupCoords;
          const [destLat, destLng] = destinationCoords;
          
          // If coordinates are too close (less than 100 meters apart), adjust destination
          const latDiff = Math.abs(pickupLat - destLat);
          const lngDiff = Math.abs(pickupLng - destLng);
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // Convert to meters (roughly)
          
          if (distance < 100) {
            console.warn('Pickup and destination are too close, adjusting destination...');
            // Move destination slightly away (about 500 meters)
            const offset = 0.0045; // Approximately 500 meters in degrees
            destinationCoords = [
              Math.max(FES_BOUNDS.minLat, Math.min(FES_BOUNDS.maxLat, destLat + offset)),
              Math.max(FES_BOUNDS.minLng, Math.min(FES_BOUNDS.maxLng, destLng + offset))
            ] as [number, number];
            console.log('Adjusted destination coordinates:', destinationCoords, 'from original:', [destLat, destLng]);
          }
        }
        
        // Remove old markers and routes if they exist
        if (pickupMarkerRef.current) {
          mapInstanceRef.current.removeLayer(pickupMarkerRef.current);
        }
        if (destinationMarkerRef.current) {
          mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
        }
        if (routeToPickupRef.current) {
          mapInstanceRef.current.removeLayer(routeToPickupRef.current);
        }
        if (routeToDestinationRef.current) {
          mapInstanceRef.current.removeLayer(routeToDestinationRef.current);
        }
        
        // Add passenger pickup marker (green) - where driver picks up the passenger
        if (pickupCoords) {
          const pickupIcon = window.L.divIcon({
            className: 'custom-pickup-icon',
            html: `<div class="relative w-10 h-10 flex items-center justify-center">
                    <div class="absolute w-full h-full bg-green-500/30 rounded-full animate-ping"></div>
                    <div class="relative w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-lg"></div>
                    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap">Passenger Pickup</div>
                  </div>`,
            iconSize: [40, 50],
            iconAnchor: [20, 25]
          });
          pickupMarkerRef.current = window.L.marker(pickupCoords, { icon: pickupIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<b>Passenger Pickup Location</b><br>${pickupAddr}`);
        }
        
        // Add destination marker (red)
        if (destinationCoords) {
          const destinationIcon = window.L.divIcon({
            className: 'custom-destination-icon',
            html: `<div class="relative w-10 h-10 flex items-center justify-center">
                    <div class="absolute w-full h-full bg-red-500/30 rounded-full animate-ping"></div>
                    <div class="relative w-6 h-6 bg-red-500 border-2 border-white rounded-full shadow-lg"></div>
                    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap">Destination</div>
                  </div>`,
            iconSize: [40, 50],
            iconAnchor: [20, 25]
          });
          destinationMarkerRef.current = window.L.marker(destinationCoords, { icon: destinationIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<b>Destination</b><br>${deliveryAddr}`);
        }
        
        // Draw route from driver to passenger pickup (green dashed line) - following real roads
        if (pickupCoords && userLocation) {
          console.log('Fetching route from driver to passenger pickup:', { userLocation, pickupCoords });
          try {
            const routeCoordinates = await getRoute(userLocation, pickupCoords);
            
            if (routeCoordinates && routeCoordinates.length > 0) {
              routeToPickupRef.current = window.L.polyline(
                routeCoordinates,
                {
                  color: '#22c55e', // green-500
                  weight: 6,
                  opacity: 0.9,
                  dashArray: '15, 10',
                  lineCap: 'round',
                  lineJoin: 'round'
                }
              ).addTo(mapInstanceRef.current);
              
              // Bring route to front and add popup
              routeToPickupRef.current.bringToFront();
              routeToPickupRef.current.bindPopup(`<b>Route to Passenger Pickup</b><br>${pickupAddr}`);
              console.log('Route to passenger pickup drawn successfully with', routeCoordinates.length, 'points');
            } else {
              console.warn('No route coordinates returned for pickup route');
            }
          } catch (error) {
            console.error('Error drawing route to passenger pickup:', error);
          }
        } else {
          console.warn('Cannot draw route to passenger pickup - missing coordinates:', { pickupCoords, userLocation });
        }
        
        // Draw route from pickup to passenger destination (red solid line) - following real roads
        if (pickupCoords && destinationCoords) {
          console.log('Fetching route from pickup to passenger destination:', { pickupCoords, destinationCoords });
          try {
            const routeCoordinates = await getRoute(pickupCoords, destinationCoords);
            
            if (routeCoordinates && routeCoordinates.length > 0) {
              routeToDestinationRef.current = window.L.polyline(
                routeCoordinates,
                {
                  color: '#ef4444', // red-500
                  weight: 6,
                  opacity: 1.0,
                  lineCap: 'round',
                  lineJoin: 'round'
                }
              ).addTo(mapInstanceRef.current);
              
              // Bring route to front and add popup
              routeToDestinationRef.current.bringToFront();
              routeToDestinationRef.current.bindPopup(`<b>Route to Passenger Destination</b><br>${deliveryAddr}`);
              console.log('Route to passenger destination drawn successfully with', routeCoordinates.length, 'points');
            } else {
              console.warn('No route coordinates returned for destination route');
            }
          } catch (error) {
            console.error('Error drawing route to passenger destination:', error);
          }
        } else {
          console.warn('Cannot draw route to passenger destination - missing coordinates:', { pickupCoords, destinationCoords });
        }
        
        // Fit map to show all markers and routes (driver, pickup, destination)
        if (pickupCoords && destinationCoords && userLocation) {
          const layers = [
            driverMarkerRef.current,
            pickupMarkerRef.current,
            destinationMarkerRef.current
          ];
          
          // Add routes if they exist
          if (routeToPickupRef.current) {
            layers.push(routeToPickupRef.current);
          }
          if (routeToDestinationRef.current) {
            layers.push(routeToDestinationRef.current);
          }
          
          const group = new window.L.FeatureGroup(layers);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15), { maxZoom: 15 });
        } else if (pickupCoords) {
          mapInstanceRef.current.flyTo(pickupCoords, 14, { animate: true, duration: 1.5 });
        }
      } else {
        console.error('Cannot draw routes - missing data:', {
          hasPickup,
          hasDelivery,
          hasMap,
          hasLeaflet,
          pickupAddr,
          deliveryAddr,
          orderData: acceptedOrderData
        });
      }
      
      // On success: remove incoming request, refresh orders and stats
      setIncomingRequest(null);
      
      // Refresh orders
      const orders = await driverService.getOrders(driverId);
      const sortedOrders = orders
        .sort((a: Order, b: Order) => {
          const dateA = new Date(a.orderDate).getTime();
          const dateB = new Date(b.orderDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentOrders(sortedOrders);
      setAllOrders(orders);
      
      // Refresh stats
      const data = await driverService.getStats(driverId);
      setStats(data);
      
      // Show success toast
      showToast('Ride accepted successfully! Navigate to passenger pickup location.', 'success');
      
      // Store accepted order to show complete button
      setAcceptedOrder(acceptedOrderData);
    } catch (error: any) {
      console.error('Error accepting order:', error);
      const errorMessage = error.message || 'Failed to accept order';
      showToast(errorMessage, 'error');
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: 'overview' | 'earnings' | 'profile', icon: any, label: string }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveTab(id);
      setShowSidebar(false);
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
          activeTab === id 
            ? 'bg-morocco-red text-white shadow-lg shadow-morocco-red/30' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-morocco-red to-morocco-green rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">Driver Portal</span>
          </div>

          <div className="flex-1 p-4 space-y-2">
            <NavItem id="overview" icon={Navigation} label="Overview" />
            <NavItem id="earnings" icon={DollarSign} label="Earnings" />
            <NavItem id="profile" icon={User} label="Profile" />
          </div>

          <div className="p-4 border-t border-gray-100">
            <Link to="/" className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSidebar(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="font-medium text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {locationError && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs">
                <MapPin size={14} />
                <span>Using default location</span>
              </div>
            )}
            <button 
              onClick={toggleOnline}
              className={`p-2 rounded-full transition-colors ${isOnline ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              title={isOnline ? "Go Offline" : "Go Online"}
            >
              <Power size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-morocco-red rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Driver" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Today's Earnings</span>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : statsError ? (
                      <span className="text-red-500 text-sm">Error</span>
                    ) : (
                      <>
                        {stats?.todayEarnings?.toFixed(2) || '0.00'} <span className="text-sm font-medium text-gray-500">MAD</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Rides</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Car size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : statsError ? (
                      <span className="text-red-500 text-sm">Error</span>
                    ) : (
                      stats?.totalRides || 0
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Hours Online</span>
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : statsError ? (
                      <span className="text-red-500 text-sm">Error</span>
                    ) : (
                      `${stats?.onlineHours?.toFixed(1) || '0.0'}h`
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Rating</span>
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Star size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : statsError ? (
                      <span className="text-red-500 text-sm">Error</span>
                    ) : (
                      stats?.rating?.toFixed(1) || '0.0'
                    )}
                  </div>
                </div>
              </div>

              {/* Map & Active Request Area */}
              <div className="grid lg:grid-cols-3 gap-6 h-[500px]">
                {/* Map Container */}
                <div className="lg:col-span-2 bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner border border-gray-200 z-0">
                  {/* Real Leaflet Map */}
                  <div ref={mapContainerRef} id="map" className="w-full h-full bg-gray-100" />

                  {/* Offline Overlay */}
                  {!isOnline && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1000] transition-all duration-500">
                      <div className="text-center text-white p-6 bg-black/20 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                          <Power size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">You are Offline</h3>
                        <p className="text-gray-200 mb-6">Go online to start receiving ride requests</p>
                        <button 
                          onClick={toggleOnline}
                          className="px-8 py-3 bg-morocco-green text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20"
                        >
                          Go Online
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Active Order Complete Button - Bottom Right */}
                  {acceptedOrder && acceptedOrder.status === 'ACCEPTED' && (
                    <div className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 z-[1000] min-w-[280px]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Active Ride</div>
                          <h3 className="text-base font-bold">Order #{acceptedOrder.id}</h3>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {acceptedOrder.deliveryAddress}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-lg font-bold text-morocco-green">{acceptedOrder.totalAmount?.toFixed(2)} MAD</div>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const driverId = parseInt(localStorage.getItem('driverId') || '0');
                          if (!driverId) {
                            showToast('Driver ID not found', 'error');
                            return;
                          }
                          try {
                            await driverService.completeOrder(driverId, acceptedOrder.id);
                            showToast('Ride completed successfully!', 'success');
                            setAcceptedOrder(null);
                            // Clear map markers
                            if (pickupMarkerRef.current) mapInstanceRef.current?.removeLayer(pickupMarkerRef.current);
                            if (destinationMarkerRef.current) mapInstanceRef.current?.removeLayer(destinationMarkerRef.current);
                            if (routeToPickupRef.current) mapInstanceRef.current?.removeLayer(routeToPickupRef.current);
                            if (routeToDestinationRef.current) mapInstanceRef.current?.removeLayer(routeToDestinationRef.current);
                            // Refresh orders and stats
                            const orders = await driverService.getOrders(driverId);
                            const sortedOrders = orders.sort((a: Order, b: Order) => {
                              const dateA = new Date(a.orderDate).getTime();
                              const dateB = new Date(b.orderDate).getTime();
                              return dateB - dateA;
                            }).slice(0, 5);
                            setRecentOrders(sortedOrders);
                            setAllOrders(orders);
                            const data = await driverService.getStats(driverId);
                            setStats(data);
                          } catch (error: any) {
                            showToast(error.message || 'Failed to complete ride', 'error');
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-morocco-green text-white font-semibold hover:bg-green-700 shadow-lg shadow-green-100 transition-colors text-sm"
                      >
                        Complete Ride
                      </button>
                    </div>
                  )}

                  {/* Incoming Request Popup */}
                  {isOnline && incomingRequest && !acceptedOrder && (
                    <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300 z-[1000]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs font-bold text-morocco-red uppercase tracking-wider mb-1">Incoming Request</div>
                          <h3 className="text-lg font-bold">{incomingRequest.passengerName}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{incomingRequest.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-morocco-green">{incomingRequest.price} MAD</div>
                          <div className="text-xs text-gray-500">{incomingRequest.distance} • {incomingRequest.time}</div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200 -z-10"></div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Passenger Pickup</div>
                            <div className="text-sm font-medium text-gray-800 line-clamp-1">{incomingRequest.pickupLocation}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-morocco-red"></div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Destination</div>
                            <div className="text-sm font-medium text-gray-800 line-clamp-1">{incomingRequest.dropoffLocation}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setIncomingRequest(null)}
                          className="py-3 px-4 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={handleAcceptRide}
                          className="py-3 px-4 rounded-xl bg-morocco-green text-white font-semibold hover:bg-green-700 shadow-lg shadow-green-100 transition-colors"
                        >
                          Accept Ride
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Activity */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {ordersLoading ? (
                      <div className="text-center py-10 text-gray-400">
                        <p>Loading orders...</p>
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent orders</p>
                        <p className="text-xs text-gray-400 mt-1">Your completed orders will appear here</p>
                      </div>
                    ) : (
                      recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 shrink-0">
                              <MapPin size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-gray-800 line-clamp-1" title={order.deliveryAddress}>
                                {extractLocationName(order.deliveryAddress)}
                              </div>
                              <div className="text-xs text-gray-500">{formatOrderDate(order.orderDate)}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <div className="text-sm font-bold text-gray-800">{order.totalAmount?.toFixed(2) || '0.00'} MAD</div>
                            <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${
                              order.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-700' 
                                : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status || 'PENDING'}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full py-2 text-sm font-semibold text-morocco-red hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                      View All History <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="max-w-6xl mx-auto space-y-6">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-lg text-gray-500 mb-1">Total Earnings (Today)</h2>
                      <div className="text-4xl font-bold text-gray-900">
                        {statsLoading ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : statsError ? (
                          <span className="text-red-500">Error loading earnings</span>
                        ) : (
                          `${stats?.todayEarnings?.toFixed(2) || '0.00'} MAD`
                        )}
                      </div>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-morocco-green/50">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    {(() => {
                      // Generate earnings data from today's orders
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      const todayOrders = allOrders.filter((order) => {
                        try {
                          const orderDate = new Date(order.orderDate);
                          orderDate.setHours(0, 0, 0, 0);
                          return orderDate.getTime() === today.getTime();
                        } catch {
                          return false;
                        }
                      });

                      if (todayOrders.length === 0) {
                        return (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <DollarSign size={48} className="mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No earnings data to display</p>
                              <p className="text-xs text-gray-400 mt-1">Complete orders to see your earnings chart</p>
                            </div>
                          </div>
                        );
                      }

                      // Group orders by hour and sum amounts (10% commission)
                      const hourlyData: { [key: string]: number } = {};
                      
                      todayOrders.forEach((order) => {
                        try {
                          const date = new Date(order.orderDate);
                          const hour = date.getHours();
                          const timeKey = `${hour.toString().padStart(2, '0')}:00`;
                          const commission = (order.totalAmount || 0) * 0.1; // 10% commission
                          
                          if (hourlyData[timeKey]) {
                            hourlyData[timeKey] += commission;
                          } else {
                            hourlyData[timeKey] = commission;
                          }
                        } catch (e) {
                          // Skip invalid dates
                        }
                      });

                      // Convert to array and sort by time
                      const earningsData = Object.entries(hourlyData)
                        .map(([time, amount]) => ({ time, amount: Number(amount.toFixed(2)) }))
                        .sort((a, b) => a.time.localeCompare(b.time));

                      if (earningsData.length === 0) {
                        return (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <DollarSign size={48} className="mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No earnings data to display</p>
                              <p className="text-xs text-gray-400 mt-1">Complete orders to see your earnings chart</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={earningsData}>
                            <defs>
                              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#006233" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#006233" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              formatter={(value: any) => [`${value} MAD`, 'Earnings']}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#006233" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>
               </div>
               
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-4">Weekly Breakdown</h3>
                 {statsLoading ? (
                   <div className="text-center py-8 text-gray-400">
                     <p>Loading earnings data...</p>
                   </div>
                 ) : stats?.todayEarnings === 0 || !stats?.todayEarnings ? (
                   <div className="text-center py-8 text-gray-400">
                     <DollarSign size={32} className="mx-auto mb-2 text-gray-300" />
                     <p className="text-sm">No earnings data yet</p>
                     <p className="text-xs text-gray-400 mt-1">Your earnings will appear here once you complete orders</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                       <span className="text-gray-600">Today</span>
                       <span className="font-bold">{stats?.todayEarnings?.toFixed(2) || '0.00'} MAD</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                       <span className="text-gray-600">Total Earnings</span>
                       <span className="font-bold">{driverProfile?.totalEarnings?.toFixed(2) || stats?.todayEarnings?.toFixed(2) || '0.00'} MAD</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
             <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-morocco-red to-morocco-green"></div>
                <div className="px-8 pb-8">
                   {profileLoading ? (
                     <div className="text-center py-10 text-gray-400">
                       <p>Loading profile...</p>
                     </div>
                   ) : driverProfile ? (
                     <>
                       <div className="relative -mt-16 mb-6">
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Profile" className="w-full h-full object-cover" />
                          </div>
                       </div>
                       
                       <div className="flex justify-between items-start mb-8">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{driverProfile.name || 'Driver'}</h2>
                            <p className="text-gray-500">
                              {getPartnerTier(driverProfile.rating, driverProfile.totalRides)} • Since {formatSinceDate(driverProfile.createdAt)}
                            </p>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings size={20} />
                          </button>
                       </div>

                       <div className="space-y-6">
                          <div className="border-b border-gray-100 pb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Vehicle Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-gray-50 rounded-xl">
                                 <div className="text-xs text-gray-500 mb-1">Model</div>
                                 <div className="font-semibold">{driverProfile.vehicleModel || 'Not specified'}</div>
                               </div>
                               <div className="p-4 bg-gray-50 rounded-xl">
                                 <div className="text-xs text-gray-500 mb-1">License Plate</div>
                                 <div className="font-semibold">{driverProfile.licensePlate || 'Not specified'}</div>
                               </div>
                               {driverProfile.vehicleColor && (
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                   <div className="text-xs text-gray-500 mb-1">Color</div>
                                   <div className="font-semibold">{driverProfile.vehicleColor}</div>
                                 </div>
                               )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Documents</h3>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-2 h-2 rounded-full ${driverProfile.licenseVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                     <span className="font-medium text-gray-700">Driver's License</span>
                                  </div>
                                  <span className={`text-sm font-medium ${driverProfile.licenseVerified ? 'text-green-600' : 'text-gray-500'}`}>
                                    {driverProfile.licenseVerified ? 'Verified' : 'Not Verified'}
                                  </span>
                               </div>
                               <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-2 h-2 rounded-full ${driverProfile.insuranceVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                     <span className="font-medium text-gray-700">Vehicle Insurance</span>
                                  </div>
                                  <span className={`text-sm font-medium ${driverProfile.insuranceVerified ? 'text-green-600' : 'text-gray-500'}`}>
                                    {driverProfile.insuranceVerified ? 'Verified' : 'Not Verified'}
                                  </span>
                               </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
                            <div className="space-y-3">
                               <div className="p-4 bg-gray-50 rounded-xl">
                                 <div className="text-xs text-gray-500 mb-1">Email</div>
                                 <div className="font-semibold text-gray-800">{driverProfile.email || 'Not provided'}</div>
                               </div>
                               <div className="p-4 bg-gray-50 rounded-xl">
                                 <div className="text-xs text-gray-500 mb-1">Phone</div>
                                 <div className="font-semibold text-gray-800">{driverProfile.phone || 'Not provided'}</div>
                               </div>
                            </div>
                          </div>
                       </div>
                     </>
                   ) : (
                     <div className="text-center py-10 text-gray-400">
                       <p>Failed to load profile</p>
                     </div>
                   )}
                </div>
             </div>
          )}

        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          {toast.type === 'info' && <Bell size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}