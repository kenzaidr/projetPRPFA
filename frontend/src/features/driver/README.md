# Driver Dashboard Documentation

## 📍 Overview

The Driver Dashboard is a comprehensive interface for drivers to manage their rides, track earnings, and monitor their online status. It features real-time location tracking, interactive maps, and detailed analytics.

## 🗺️ Map Implementation

### Map Library: **Leaflet**

The dashboard uses **Leaflet 1.9.4** for interactive map functionality.

- **Source**: Loaded via CDN from `unpkg.com`
- **CSS**: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- **JS**: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
- **Documentation**: [Leaflet Official Docs](https://leafletjs.com/)

### Map Tile Provider: **CartoDB Voyager**

- **Tile Layer**: CartoDB Voyager (clean, app-like appearance)
- **URL Pattern**: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`
- **Attribution**: OpenStreetMap contributors
- **Max Zoom**: 20

### Map Features

1. **Real-time Driver Location**
   - Uses browser Geolocation API
   - Custom animated marker with pulsing effect
   - Auto-updates position when driver is online
   - Smooth panning and zoom animations

2. **Location Tracking**
   - Watches position when driver goes online
   - Updates marker position in real-time
   - Falls back to Casablanca coordinates if location unavailable
   - High accuracy GPS enabled

3. **Map States**
   - **Online**: Shows driver marker, zoomed to driver location (zoom level 15)
   - **Offline**: No marker, city view (zoom level 13) with overlay message

## 🛠️ Technologies Used

### Core Libraries

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| **React** | 19.2.0 | UI Framework | npm |
| **TypeScript** | 5.9.3 | Type Safety | npm |
| **Leaflet** | 1.9.4 | Interactive Maps | CDN (unpkg) |
| **Recharts** | 3.5.1 | Data Visualization | npm |
| **React Router DOM** | 7.10.1 | Navigation | npm |
| **Lucide React** | 0.561.0 | Icons | npm |
| **Axios** | 1.13.2 | HTTP Client | npm |
| **TanStack React Query** | 5.90.12 | Data Fetching | npm |

### Styling

- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **Custom CSS**: Additional styles in `src/assets/css/styles.css`
- **Inter Font**: Google Fonts

### Browser APIs

- **Geolocation API**: For getting and watching user location
- **Window API**: For accessing Leaflet global object

## 📂 Component Structure

```
DriverDashboard.tsx
├── State Management
│   ├── isOnline (boolean)
│   ├── activeTab ('overview' | 'earnings' | 'profile')
│   ├── showSidebar (boolean)
│   ├── incomingRequest (RideRequest | null)
│   ├── userLocation ([lat, lng] | null)
│   └── locationError (string | null)
│
├── Refs
│   ├── mapContainerRef (HTMLDivElement)
│   ├── mapInstanceRef (Leaflet Map instance)
│   ├── driverMarkerRef (Leaflet Marker)
│   └── watchIdRef (Geolocation watch ID)
│
└── Features
    ├── Map Integration
    ├── Location Tracking
    ├── Online/Offline Toggle
    ├── Ride Request Handling
    ├── Earnings Analytics
    └── Profile Management
```

## 🎯 Key Features

### 1. Overview Tab
- **Statistics Cards**: Today's earnings, total rides, hours online, rating
- **Interactive Map**: Real-time driver location with Leaflet
- **Incoming Requests**: Popup notifications for new ride requests
- **Recent Activity**: List of completed rides

### 2. Earnings Tab
- **Earnings Chart**: Area chart using Recharts
- **Time Period Selector**: Today, This Week, This Month
- **Weekly Breakdown**: Detailed earnings by day

### 3. Profile Tab
- **Driver Information**: Name, partner status, join date
- **Vehicle Details**: Model, license plate
- **Document Verification**: Status of required documents

## 🔧 Map Implementation Details

### Initialization

```typescript
// Map is initialized when:
// 1. User location is available (or default to Casablanca)
// 2. Leaflet library is loaded (window.L is defined)
// 3. Map container ref is available

const map = window.L.map(mapContainerRef.current, {
  zoomControl: false,
  attributionControl: false
}).setView(defaultLocation, 13);
```

### Marker Creation

```typescript
// Custom driver marker with pulsing animation
const driverIcon = window.L.divIcon({
  className: 'custom-driver-icon',
  html: `<div>...</div>`, // Custom HTML with Tailwind classes
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const marker = window.L.marker(userLocation, { icon: driverIcon })
  .addTo(map);
```

### Location Watching

```typescript
// Watch position when driver is online
watchIdRef.current = navigator.geolocation.watchPosition(
  (position) => {
    const [lat, lng] = [position.coords.latitude, position.coords.longitude];
    // Update marker position
    driverMarkerRef.current.setLatLng([lat, lng]);
    // Smoothly pan map
    mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 1 });
  },
  // Error handling...
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 1000
  }
);
```

## 📊 Data Visualization

### Recharts Integration

- **Chart Type**: Area Chart
- **Data**: Earnings over time
- **Features**:
  - Gradient fill
  - Custom tooltips
  - Responsive container
  - Custom styling

```typescript
<AreaChart data={EARNINGS_DATA}>
  <Area 
    type="monotone" 
    dataKey="amount" 
    stroke="#006233" 
    fill="url(#colorAmount)" 
  />
</AreaChart>
```

## 🎨 Styling

### Color Scheme

- **Morocco Red**: `#C1272D` - Primary actions, branding
- **Morocco Green**: `#006233` - Success states, earnings
- **Morocco Gold**: `#D4AF37` - Accents
- **Morocco Sand**: `#F2E8C9` - Backgrounds

### Custom Classes

- `.custom-driver-icon`: Custom marker styling
- `.custom-scrollbar`: Custom scrollbar styling
- Tailwind utility classes throughout

## 🔄 State Management Flow

1. **Component Mount**
   - Get user location via Geolocation API
   - Initialize Leaflet map
   - Set default location (Casablanca) if needed

2. **Online Toggle**
   - Start/stop location watching
   - Add/remove driver marker
   - Update map zoom level
   - Show/hide offline overlay

3. **Location Updates**
   - Update marker position
   - Smoothly pan map to new location
   - Update state for other components

4. **Incoming Requests**
   - Simulated after 3 seconds online
   - Display popup with ride details
   - Handle accept/decline actions

## 🚀 Usage

### Accessing the Dashboard

Navigate to `/driver` route in the application.

### Going Online

1. Click the power button in the header
2. Grant location permissions if prompted
3. Map will zoom to your location
4. Driver marker will appear
5. Start receiving ride requests

### Going Offline

1. Click the power button again
2. Location watching stops
3. Driver marker is removed
4. Map zooms out to city view

## 🔐 Permissions Required

- **Geolocation**: Required for real-time location tracking
- **Browser Support**: Modern browsers with Geolocation API support

## 📱 Responsive Design

- **Mobile**: Collapsible sidebar, full-width map
- **Tablet**: Sidebar overlay, optimized layout
- **Desktop**: Fixed sidebar, multi-column layout

## 🐛 Known Issues / Notes

1. **Leaflet Loading**: Map initialization includes a retry mechanism (1 second delay) to ensure Leaflet is loaded
2. **Location Fallback**: Defaults to Casablanca coordinates if geolocation fails
3. **Mock Data**: Currently uses mock data for requests and statistics
4. **CDN Dependency**: Leaflet is loaded via CDN, not npm package

## 🔮 Future Enhancements

- [ ] Real-time ride request integration with backend
- [ ] Route visualization between pickup and dropoff
- [ ] Multiple markers for nearby requests
- [ ] Traffic layer integration
- [ ] Offline map caching
- [ ] Direction services integration
- [ ] Real-time earnings updates
- [ ] Push notifications for ride requests

## 📚 Additional Resources

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Recharts Documentation](https://recharts.org/)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [CartoDB Basemaps](https://carto.com/basemaps/)

## 💡 Tips for Developers

1. **Map Initialization**: Always check if `window.L` is defined before using Leaflet
2. **Location Updates**: Use `watchPosition` for real-time tracking, `clearWatch` to stop
3. **Marker Updates**: Use `setLatLng()` instead of recreating markers
4. **Performance**: Limit map updates to avoid excessive re-renders
5. **Error Handling**: Always provide fallback locations for geolocation failures

---

**Last Updated**: 2024
**Component**: `DriverDashboard.tsx`
**Location**: `frontend/src/features/driver/DriverDashboard.tsx`

