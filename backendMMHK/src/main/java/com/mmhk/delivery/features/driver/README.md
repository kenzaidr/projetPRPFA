# Driver Backend API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Testing with Frontend](#testing-with-frontend)
- [Example Requests & Responses](#example-requests--responses)
- [Important Notes](#important-notes)

---

## 🎯 Overview

This driver backend module provides a complete REST API for managing drivers in the delivery system. It includes authentication, profile management, real-time location tracking, online/offline status, and dashboard statistics.

### What Was Created

1. **Driver Entity Model** - Complete driver data model with all necessary fields
2. **Driver Repository** - Data access layer for driver operations
3. **Driver Service** - Business logic for driver operations
4. **Driver Controller** - REST API endpoints
5. **DTOs (Data Transfer Objects)** - Request/Response models
6. **Order Model Update** - Added driverId to link orders with drivers

---

## 🏗️ Architecture

```
driver/
├── model/
│   └── Driver.java              # Driver entity (database table)
├── repository/
│   └── DriverRepository.java   # Data access interface
├── service/
│   └── DriverService.java       # Business logic
├── controller/
│   └── DriverController.java    # REST API endpoints
└── dto/
    ├── DriverLoginRequest.java
    ├── DriverLoginResponse.java
    ├── DriverRegisterRequest.java
    ├── DriverRegisterResponse.java
    ├── DriverStatsResponse.java
    ├── DriverProfileResponse.java
    ├── UpdateLocationRequest.java
    └── UpdateOnlineStatusRequest.java
```

---

## 🗄️ Database Schema

### Drivers Table

The `drivers` table is automatically created by Hibernate when you start the application (since `spring.jpa.hibernate.ddl-auto=update` is configured).

**Table: `drivers`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key (auto-generated) |
| `name` | VARCHAR | Driver's full name |
| `email` | VARCHAR | Unique email address |
| `password` | VARCHAR | Password (plain text - should be hashed in production) |
| `phone` | VARCHAR | Phone number |
| `vehicle_model` | VARCHAR | Vehicle model (e.g., "Dacia Logan") |
| `license_plate` | VARCHAR | License plate number |
| `vehicle_color` | VARCHAR | Vehicle color |
| `is_online` | BOOLEAN | Online/offline status |
| `status` | VARCHAR | ACTIVE, INACTIVE, SUSPENDED |
| `latitude` | DOUBLE | Current latitude |
| `longitude` | DOUBLE | Current longitude |
| `rating` | DOUBLE | Driver rating (0.0 - 5.0) |
| `total_rides` | INTEGER | Total number of completed rides |
| `total_earnings` | DOUBLE | Total earnings |
| `license_verified` | BOOLEAN | Driver's license verification status |
| `insurance_verified` | BOOLEAN | Vehicle insurance verification status |
| `created_at` | TIMESTAMP | Account creation date |
| `last_online_at` | TIMESTAMP | Last time driver went online |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/drivers
```

### 1. Driver Registration

**Endpoint:** `POST /api/drivers/register`

**Description:** Register a new driver account

**Request Body:**
```json
{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "password123",
  "phone": "+212612345678",
  "vehicleModel": "Dacia Logan",
  "licensePlate": "1234-A-6",
  "vehicleColor": "White"
}
```

**Success Response (201 Created):**
```json
{
  "email": "ahmed@example.com",
  "message": "Registration successful",
  "driverId": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "email": "ahmed@example.com",
  "message": "Email already in use",
  "driverId": null
}
```

---

### 2. Driver Login

**Endpoint:** `POST /api/drivers/login`

**Description:** Authenticate driver and get access token

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "YWhtZWRAZXhhbXBsZS5jb206MTcwMDAwMDAwMDAw",
  "email": "ahmed@example.com",
  "message": "Login successful",
  "driverId": 1,
  "name": "Ahmed Benali"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "token": null,
  "email": "ahmed@example.com",
  "message": "Driver not found",
  "driverId": null,
  "name": null
}
```

---

### 3. Get Driver Statistics

**Endpoint:** `GET /api/drivers/{driverId}/stats`

**Description:** Get dashboard statistics for a driver

**Path Parameters:**
- `driverId` (Long) - Driver's ID

**Success Response (200 OK):**
```json
{
  "todayEarnings": 450.50,
  "totalRides": 12,
  "onlineHours": 5.5,
  "acceptanceRate": 98.0,
  "rating": 4.9,
  "isOnline": true,
  "lastOnlineAt": "2024-01-15T14:30:00"
}
```

**Error Response (404 Not Found):**
```
(Empty body)
```

---

### 4. Get Driver Profile

**Endpoint:** `GET /api/drivers/{driverId}/profile`

**Description:** Get complete driver profile information

**Path Parameters:**
- `driverId` (Long) - Driver's ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "phone": "+212612345678",
  "vehicleModel": "Dacia Logan",
  "licensePlate": "1234-A-6",
  "vehicleColor": "White",
  "rating": 4.9,
  "totalRides": 12,
  "totalEarnings": 450.50,
  "licenseVerified": true,
  "insuranceVerified": true,
  "isOnline": true,
  "createdAt": "2024-01-01T10:00:00",
  "lastOnlineAt": "2024-01-15T14:30:00"
}
```

---

### 5. Update Online Status

**Endpoint:** `PUT /api/drivers/{driverId}/status`

**Description:** Update driver's online/offline status

**Path Parameters:**
- `driverId` (Long) - Driver's ID

**Request Body:**
```json
{
  "isOnline": true
}
```

**Success Response (200 OK):**
```
"Status updated successfully"
```

**Error Response (404 Not Found):**
```
"Driver not found: ..."
```

---

### 6. Update Location

**Endpoint:** `PUT /api/drivers/{driverId}/location`

**Description:** Update driver's current location (for real-time tracking)

**Path Parameters:**
- `driverId` (Long) - Driver's ID

**Request Body:**
```json
{
  "latitude": 33.5731,
  "longitude": -7.5898
}
```

**Success Response (200 OK):**
```
"Location updated successfully"
```

---

### 7. Get Driver Orders

**Endpoint:** `GET /api/drivers/{driverId}/orders`

**Description:** Get all orders assigned to a driver

**Path Parameters:**
- `driverId` (Long) - Driver's ID

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "restaurantId": 1,
    "driverId": 1,
    "deliveryAddress": "123 Main Street",
    "phone": "+212612345678",
    "instructions": "Ring the doorbell",
    "modePaiement": "CASH",
    "codePromo": null,
    "totalAmount": 150.00,
    "status": "IN_PROGRESS",
    "orderDate": "2024-01-15T12:00:00"
  }
]
```

---

### 8. Validate Token

**Endpoint:** `GET /api/drivers/validate?token={token}&email={email}`

**Description:** Validate driver authentication token

**Query Parameters:**
- `token` (String) - Authentication token
- `email` (String) - Driver's email

**Success Response (200 OK):**
```
"Token is valid"
```

**Error Response (401 Unauthorized):**
```
"Invalid token"
```

---

### 9. Test Endpoint

**Endpoint:** `GET /api/drivers/test`

**Description:** Test if the driver API is working

**Success Response (200 OK):**
```
"Driver API is working!"
```

---

## 🧪 Testing with Postman

### Step-by-Step Guide

#### **Step 1: Start Your Spring Boot Application**

1. Open your project in your IDE
2. Navigate to `backendMMHK/src/main/java/com/mmhk/delivery/MmhkDeliveryBackendApplication.java`
3. Run the application
4. Wait for the message: "Started MmhkDeliveryBackendApplication"
5. Verify the database connection is successful

#### **Step 2: Test the Test Endpoint**

1. Open Postman
2. Create a new GET request
3. Set URL: `http://localhost:8080/api/drivers/test`
4. Click **Send**
5. **Expected Response:** `"Driver API is working!"`

#### **Step 3: Register a New Driver**

1. Create a new **POST** request
2. Set URL: `http://localhost:8080/api/drivers/register`
3. Go to **Headers** tab and add:
   - Key: `Content-Type`
   - Value: `application/json`
4. Go to **Body** tab
5. Select **raw** and **JSON** format
6. Paste this JSON:
```json
{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "password123",
  "phone": "+212612345678",
  "vehicleModel": "Dacia Logan",
  "licensePlate": "1234-A-6",
  "vehicleColor": "White"
}
```
7. Click **Send**
8. **Expected Response (201):**
```json
{
  "email": "ahmed@example.com",
  "message": "Registration successful",
  "driverId": 1
}
```
9. **Save the `driverId`** from the response (you'll need it for other requests)

#### **Step 4: Login as Driver**

1. Create a new **POST** request
2. Set URL: `http://localhost:8080/api/drivers/login`
3. Set **Headers**: `Content-Type: application/json`
4. Set **Body** (raw JSON):
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```
5. Click **Send**
6. **Expected Response (200):**
```json
{
  "token": "YWhtZWRAZXhhbXBsZS5jb206MTcwMDAwMDAwMDAw",
  "email": "ahmed@example.com",
  "message": "Login successful",
  "driverId": 1,
  "name": "Ahmed Benali"
}
```
7. **Save the `token` and `driverId`** for subsequent requests

#### **Step 5: Get Driver Statistics**

1. Create a new **GET** request
2. Set URL: `http://localhost:8080/api/drivers/1/stats`
   - Replace `1` with your actual `driverId`
3. Click **Send**
4. **Expected Response (200):**
```json
{
  "todayEarnings": 0.0,
  "totalRides": 0,
  "onlineHours": 0.0,
  "acceptanceRate": 98.0,
  "rating": 0.0,
  "isOnline": false,
  "lastOnlineAt": null
}
```

#### **Step 6: Get Driver Profile**

1. Create a new **GET** request
2. Set URL: `http://localhost:8080/api/drivers/1/profile`
   - Replace `1` with your actual `driverId`
3. Click **Send**
4. **Expected Response (200):** Complete driver profile with all details

#### **Step 7: Update Online Status**

1. Create a new **PUT** request
2. Set URL: `http://localhost:8080/api/drivers/1/status`
   - Replace `1` with your actual `driverId`
3. Set **Headers**: `Content-Type: application/json`
4. Set **Body** (raw JSON):
```json
{
  "isOnline": true
}
```
5. Click **Send**
6. **Expected Response (200):** `"Status updated successfully"`

#### **Step 8: Update Location**

1. Create a new **PUT** request
2. Set URL: `http://localhost:8080/api/drivers/1/location`
   - Replace `1` with your actual `driverId`
3. Set **Headers**: `Content-Type: application/json`
4. Set **Body** (raw JSON):
```json
{
  "latitude": 33.5731,
  "longitude": -7.5898
}
```
5. Click **Send**
6. **Expected Response (200):** `"Location updated successfully"`

#### **Step 9: Get Driver Orders**

1. Create a new **GET** request
2. Set URL: `http://localhost:8080/api/drivers/1/orders`
   - Replace `1` with your actual `driverId`
3. Click **Send**
4. **Expected Response (200):** Array of orders (may be empty if no orders assigned)

#### **Step 10: Validate Token**

1. Create a new **GET** request
2. Set URL: `http://localhost:8080/api/drivers/validate?token=YOUR_TOKEN&email=ahmed@example.com`
   - Replace `YOUR_TOKEN` with the token from login response
   - Replace `ahmed@example.com` with your driver's email
3. Click **Send**
4. **Expected Response (200):** `"Token is valid"`

---

## 🌐 Testing with Frontend

### Prerequisites

1. Backend is running on `http://localhost:8080`
2. Frontend is running on `http://localhost:5173` (or your frontend port)
3. CORS is configured (already done in `DriverController`)

### Step-by-Step Frontend Integration

#### **Step 1: Create Driver Service in Frontend**

Create a file: `frontend/src/services/driverService.ts`

```typescript
const API_BASE_URL = 'http://localhost:8080/api/drivers';

export const driverService = {
  // Register driver
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    vehicleModel: string;
    licensePlate: string;
    vehicleColor: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Login driver
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Get driver stats
  async getStats(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/stats`);
    return response.json();
  },

  // Get driver profile
  async getProfile(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/profile`);
    return response.json();
  },

  // Update online status
  async updateStatus(driverId: number, isOnline: boolean) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOnline }),
    });
    return response.json();
  },

  // Update location
  async updateLocation(driverId: number, latitude: number, longitude: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    return response.json();
  },

  // Get driver orders
  async getOrders(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/orders`);
    return response.json();
  },
};
```

#### **Step 2: Update Driver Login Page**

In your `DriverLogin.tsx` or `DriverSignup.tsx`, use the service:

```typescript
import { driverService } from '../services/driverService';

// In your login handler:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await driverService.login(email, password);
    if (response.token) {
      // Save token to localStorage
      localStorage.setItem('driverToken', response.token);
      localStorage.setItem('driverId', response.driverId.toString());
      // Redirect to dashboard
      navigate('/driver/dashboard');
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

#### **Step 3: Update Driver Dashboard**

In your `DriverDashboard.tsx`, fetch stats:

```typescript
import { useEffect, useState } from 'react';
import { driverService } from '../services/driverService';

const DriverDashboard = () => {
  const [stats, setStats] = useState(null);
  const driverId = parseInt(localStorage.getItem('driverId') || '0');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await driverService.getStats(driverId);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [driverId]);

  // Use stats in your component
  // ...
};
```

#### **Step 4: Update Online Status**

```typescript
const toggleOnline = async () => {
  const newStatus = !isOnline;
  try {
    await driverService.updateStatus(driverId, newStatus);
    setIsOnline(newStatus);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};
```

#### **Step 5: Update Location (Real-time)**

```typescript
useEffect(() => {
  if (isOnline && userLocation) {
    const interval = setInterval(async () => {
      try {
        await driverService.updateLocation(
          driverId,
          userLocation[0],
          userLocation[1]
        );
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }
}, [isOnline, userLocation, driverId]);
```

---

## 📝 Example Requests & Responses

### Complete Registration Flow

**Request:**
```http
POST http://localhost:8080/api/drivers/register
Content-Type: application/json

{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "password123",
  "phone": "+212612345678",
  "vehicleModel": "Dacia Logan",
  "licensePlate": "1234-A-6",
  "vehicleColor": "White"
}
```

**Response:**
```json
{
  "email": "ahmed@example.com",
  "message": "Registration successful",
  "driverId": 1
}
```

### Complete Login Flow

**Request:**
```http
POST http://localhost:8080/api/drivers/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "YWhtZWRAZXhhbXBsZS5jb206MTcwMDAwMDAwMDAw",
  "email": "ahmed@example.com",
  "message": "Login successful",
  "driverId": 1,
  "name": "Ahmed Benali"
}
```

---

## ⚠️ Important Notes

### Security Considerations

1. **Password Storage**: Currently passwords are stored in plain text. **For production**, you MUST:
   - Use BCrypt password hashing
   - Never store plain text passwords

2. **Token Generation**: Currently using simple Base64 encoding. **For production**, you SHOULD:
   - Use JWT (JSON Web Tokens)
   - Implement token expiration
   - Use secure token signing

3. **Authentication**: Add proper authentication middleware to protect endpoints

### Database

- The `drivers` table is automatically created when you start the application
- Make sure PostgreSQL is running on `localhost:5432`
- Database name: `HMMK_db`
- Check `application.properties` for database configuration

### CORS

- CORS is configured to allow requests from `http://localhost:5173`
- If your frontend runs on a different port, update the `@CrossOrigin` annotation in `DriverController.java`

### Error Handling

- All endpoints return appropriate HTTP status codes
- Error messages are included in response bodies
- Check the response status code before processing data

### Testing Tips

1. **Start with the test endpoint** to verify the API is running
2. **Register a driver first** before testing login
3. **Save the driverId** from registration/login responses
4. **Use the driverId** in all subsequent requests
5. **Check the console** for any error messages

---

## 🐛 Troubleshooting

### Common Issues

1. **404 Not Found**
   - Verify the backend is running on port 8080
   - Check the endpoint URL is correct
   - Ensure the context path `/api` is included

2. **401 Unauthorized**
   - Check email and password are correct
   - Verify the token is valid (if using token-based requests)

3. **500 Internal Server Error**
   - Check database connection
   - Verify PostgreSQL is running
   - Check application logs for detailed error messages

4. **CORS Errors**
   - Verify frontend URL matches CORS configuration
   - Check browser console for CORS error details

---

## 📚 Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JPA/Hibernate Documentation: https://hibernate.org/orm/documentation/
- PostgreSQL Documentation: https://www.postgresql.org/docs/

---

## ✅ Checklist

Before deploying to production:

- [ ] Implement password hashing (BCrypt)
- [ ] Implement JWT token authentication
- [ ] Add input validation
- [ ] Add proper error handling
- [ ] Add logging
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Configure HTTPS
- [ ] Set up proper CORS policies
- [ ] Add rate limiting
- [ ] Implement proper session management

---

**Last Updated:** January 2024
**Version:** 1.0.0


