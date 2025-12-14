import { useState, useEffect, useRef } from 'react';
import { 
  Car, MapPin, DollarSign, Clock, Star, Bell, Menu, Power, 
  Navigation, User, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RideRequest, DriverStats } from '../../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Define Leaflet on window
declare global {
  interface Window {
    L: any;
  }
}

// Mock Data
const MOCK_STATS: DriverStats = {
  todayEarnings: 450.50,
  totalRides: 12,
  onlineHours: 5.5,
  acceptanceRate: 98
};

const MOCK_REQUEST: RideRequest = {
  id: 'req_123',
  passengerName: 'Ahmed Benali',
  pickupLocation: 'Casa Port Train Station',
  dropoffLocation: 'Morocco Mall',
  price: 45.00,
  distance: '4.2 km',
  rating: 4.8,
  time: '15 min'
};

const EARNINGS_DATA = [
  { time: '08:00', amount: 45 },
  { time: '10:00', amount: 120 },
  { time: '12:00', amount: 180 },
  { time: '14:00', amount: 250 },
  { time: '16:00', amount: 320 },
  { time: '18:00', amount: 450.50 },
];

const RECENT_RIDES = [
  { id: 1, to: 'Marina Shopping', time: '10:30 AM', price: 35.00, status: 'Completed' },
  { id: 2, to: 'Hassan II Mosque', time: '11:15 AM', price: 28.50, status: 'Completed' },
  { id: 3, to: 'Technopark', time: '01:45 PM', price: 55.00, status: 'Completed' },
];

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'profile'>('overview');
  const [showSidebar, setShowSidebar] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<RideRequest | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null); // [lat, lng]
  const [locationError, setLocationError] = useState<string | null>(null);

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  // Get User's Current Location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      // Fallback to Casablanca
      setUserLocation([33.5731, -7.5898]);
      return;
    }

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Using default location.');
          // Fallback to Casablanca
          setUserLocation([33.5731, -7.5898]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    getLocation();
  }, []);

  // Watch position when online
  useEffect(() => {
    if (isOnline && userLocation) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation: [number, number] = [latitude, longitude];
            setUserLocation(newLocation);
            
            // Update marker position if map is initialized
            if (mapInstanceRef.current && driverMarkerRef.current && typeof window.L !== 'undefined') {
              driverMarkerRef.current.setLatLng(newLocation);
              // Smoothly pan to new location
              mapInstanceRef.current.panTo(newLocation, { animate: true, duration: 1 });
            }
          },
          (error) => {
            console.error('Error watching position:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000
          }
        );
      }
    } else {
      // Stop watching when offline
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isOnline, userLocation]);

  // Initialize Map
  useEffect(() => {
    // Wait for user location or use default
    const defaultLocation: [number, number] = userLocation || [33.5731, -7.5898];
    
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
      } else {
        // Update existing marker position
        driverMarkerRef.current.setLatLng(userLocation);
      }
      
      // Zoom in to driver location
      mapInstanceRef.current.flyTo(userLocation, 15, {
        animate: true,
        duration: 1.5
      });
    } else {
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

  // Simulate incoming request when online
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOnline) {
      timeout = setTimeout(() => {
        setIncomingRequest(MOCK_REQUEST);
      }, 3000);
    } else {
      setIncomingRequest(null);
    }
    return () => clearTimeout(timeout);
  }, [isOnline]);

  const toggleOnline = () => setIsOnline(!isOnline);

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id); setShowSidebar(false); }}
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
                  <div className="text-2xl font-bold text-gray-800">{MOCK_STATS.todayEarnings} <span className="text-sm font-medium text-gray-500">MAD</span></div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Rides</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Car size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{MOCK_STATS.totalRides}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Hours Online</span>
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{MOCK_STATS.onlineHours}h</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Rating</span>
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Star size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
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

                  {/* Incoming Request Popup */}
                  {isOnline && incomingRequest && (
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
                            <div className="text-xs text-gray-400">Pickup</div>
                            <div className="text-sm font-medium text-gray-800 line-clamp-1">{incomingRequest.pickupLocation}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-morocco-red"></div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Dropoff</div>
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
                        <button className="py-3 px-4 rounded-xl bg-morocco-green text-white font-semibold hover:bg-green-700 shadow-lg shadow-green-100 transition-colors">
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
                    {RECENT_RIDES.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-800 line-clamp-1">{ride.to}</div>
                            <div className="text-xs text-gray-500">{ride.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-800">{ride.price} DH</div>
                          <div className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 inline-block">
                            {ride.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Placeholder for empty state */}
                    {RECENT_RIDES.length === 0 && (
                      <div className="text-center py-10 text-gray-400">
                        <p>No recent rides</p>
                      </div>
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
                      <div className="text-4xl font-bold text-gray-900">{MOCK_STATS.todayEarnings.toFixed(2)} MAD</div>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-morocco-green/50">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={EARNINGS_DATA}>
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
                  </div>
               </div>
               
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-4">Weekly Breakdown</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                       <span className="text-gray-600">Monday</span>
                       <span className="font-bold">450.50 MAD</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                       <span className="text-gray-600">Tuesday</span>
                       <span className="font-bold">380.00 MAD</span>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
             <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-morocco-red to-morocco-green"></div>
                <div className="px-8 pb-8">
                   <div className="relative -mt-16 mb-6">
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Profile" className="w-full h-full object-cover" />
                      </div>
                   </div>
                   
                   <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Ahmed Benali</h2>
                        <p className="text-gray-500">Gold Partner • Since 2022</p>
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
                             <div className="font-semibold">Dacia Logan</div>
                           </div>
                           <div className="p-4 bg-gray-50 rounded-xl">
                             <div className="text-xs text-gray-500 mb-1">License Plate</div>
                             <div className="font-semibold">1234-A-6</div>
                           </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Documents</h3>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                 <span className="font-medium text-gray-700">Driver's License</span>
                              </div>
                              <span className="text-sm text-green-600 font-medium">Verified</span>
                           </div>
                           <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                 <span className="font-medium text-gray-700">Vehicle Insurance</span>
                              </div>
                              <span className="text-sm text-green-600 font-medium">Verified</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}