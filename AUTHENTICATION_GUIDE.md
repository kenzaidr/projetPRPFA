# Driver Authentication Implementation Guide

## 📍 Current State Analysis

### What Exists:
- ✅ Login button in HomePage navigation (lines 153, 204) - currently links to `/driver`
- ✅ Empty `auth.jsx` file in `frontend/src/features/auth/`
- ✅ Driver Dashboard at `/driver` route (unprotected)
- ❌ No authentication system
- ❌ No protected routes
- ❌ No backend auth endpoints

### What's Missing:
- Login/Signup pages
- Authentication context/provider
- Protected route wrapper
- Backend authentication endpoints
- Token management

---

## 🎯 Recommended Implementation Locations

### 1. **Frontend Pages** (Create New Files)

#### **Location**: `frontend/src/pages/`

Create two new pages:

```
frontend/src/pages/
├── DriverLogin.tsx          ← NEW: Driver login page
└── DriverSignup.tsx         ← NEW: Driver registration page
```

**Why here?**
- Pages folder is for top-level route components
- Matches your existing structure (HomePage.tsx is here)
- Easy to import in App.tsx routing

---

### 2. **Authentication Context/Provider**

#### **Location**: `frontend/src/contexts/` (Create this folder)

```
frontend/src/contexts/
└── AuthContext.tsx          ← NEW: Authentication context & provider
```

**Why here?**
- Centralized auth state management
- Can be used across all components
- Follows React best practices

**Alternative**: You could also put it in `frontend/src/features/auth/` if you prefer feature-based organization.

---

### 3. **Protected Route Component**

#### **Location**: `frontend/src/components/` or `frontend/src/shared/components/`

```
frontend/src/shared/components/
└── ProtectedRoute.tsx       ← NEW: Route protection wrapper
```

**Why here?**
- Reusable component for protecting any route
- Can be used for driver, admin, or other protected routes later

---

### 4. **Auth Service/API**

#### **Location**: `frontend/src/services/` (Create this folder)

```
frontend/src/services/
└── authService.ts           ← NEW: API calls for authentication
```

**Why here?**
- Separates API logic from components
- Easy to mock for testing
- Centralized API endpoint management

---

### 5. **Update Existing Files**

#### **File**: `frontend/src/App.tsx`
**Changes needed:**
- Add routes for `/driver/login` and `/driver/signup`
- Wrap `/driver` route with ProtectedRoute
- Add AuthProvider wrapper

#### **File**: `frontend/src/pages/HomePage.tsx`
**Changes needed:**
- Update login button to navigate to `/driver/login` instead of `/driver`

#### **File**: `frontend/src/features/driver/DriverDashboard.tsx`
**Changes needed:**
- Add logout functionality that clears auth token
- Optionally check auth status on mount

---

### 6. **Backend Endpoints** (Java/Spring Boot)

#### **Location**: `backendMMHK/src/main/java/com/mmhk/delivery/controller/`

Create new controller:

```
backendMMHK/src/main/java/com/mmhk/delivery/
├── controller/
│   └── AuthController.java          ← NEW: Authentication endpoints
├── service/
│   └── AuthService.java             ← NEW: Business logic
├── model/
│   ├── Driver.java                  ← NEW: Driver entity
│   └── AuthRequest.java             ← NEW: Login/Signup DTOs
└── repository/
    └── DriverRepository.java        ← NEW: Data access
```

**Endpoints to create:**
- `POST /api/auth/driver/login` - Driver login
- `POST /api/auth/driver/signup` - Driver registration
- `POST /api/auth/driver/logout` - Driver logout
- `GET /api/auth/driver/me` - Get current driver info

---

## 📋 Implementation Structure

### Complete File Structure:

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DriverLogin.tsx          ← NEW
│   │   └── DriverSignup.tsx         ← NEW
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx          ← NEW
│   │
│   ├── services/
│   │   └── authService.ts           ← NEW
│   │
│   ├── shared/
│   │   └── components/
│   │       └── ProtectedRoute.tsx   ← NEW
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   └── auth.jsx              ← Can be removed or repurposed
│   │   └── driver/
│   │       └── DriverDashboard.tsx  ← Update logout
│   │
│   └── App.tsx                       ← Update routes
│
backendMMHK/
└── src/main/java/com/mmhk/delivery/
    ├── controller/
    │   └── AuthController.java       ← NEW
    ├── service/
    │   └── AuthService.java          ← NEW
    ├── model/
    │   ├── Driver.java               ← NEW
    │   └── dto/
    │       ├── LoginRequest.java     ← NEW
    │       └── SignupRequest.java     ← NEW
    └── repository/
        └── DriverRepository.java     ← NEW
```

---

## 🔄 User Flow

### Login Flow:
1. User clicks "Login" on HomePage → Navigate to `/driver/login`
2. User enters credentials → Submit to backend
3. Backend validates → Returns JWT token
4. Store token in localStorage/sessionStorage
5. Update AuthContext → Set authenticated state
6. Redirect to `/driver` dashboard

### Signup Flow:
1. User clicks "Become a Partner" → Navigate to `/driver/signup`
2. User fills registration form → Submit to backend
3. Backend creates driver account → Returns JWT token
4. Store token → Update AuthContext
5. Redirect to `/driver` dashboard

### Protected Route Flow:
1. User tries to access `/driver`
2. ProtectedRoute checks AuthContext
3. If not authenticated → Redirect to `/driver/login`
4. If authenticated → Render DriverDashboard

---

## 🛠️ Step-by-Step Implementation Order

### Phase 1: Frontend Setup (Start Here)

1. **Create AuthContext** (`frontend/src/contexts/AuthContext.tsx`)
   - Manage auth state (isAuthenticated, driver info, token)
   - Provide login/logout functions
   - Persist token in localStorage

2. **Create ProtectedRoute** (`frontend/src/shared/components/ProtectedRoute.tsx`)
   - Check if user is authenticated
   - Redirect to login if not

3. **Create DriverLogin Page** (`frontend/src/pages/DriverLogin.tsx`)
   - Login form (email/phone, password)
   - Multi-language support
   - Call authService.login()

4. **Create DriverSignup Page** (`frontend/src/pages/DriverSignup.tsx`)
   - Registration form (name, email, phone, password, vehicle info)
   - Multi-language support
   - Call authService.signup()

5. **Create AuthService** (`frontend/src/services/authService.ts`)
   - API calls to backend
   - Token management
   - Error handling

6. **Update App.tsx**
   - Add AuthProvider wrapper
   - Add `/driver/login` and `/driver/signup` routes
   - Protect `/driver` route

7. **Update HomePage.tsx**
   - Change login button to navigate to `/driver/login`

8. **Update DriverDashboard.tsx**
   - Implement logout functionality

### Phase 2: Backend Setup

1. **Create Driver Entity** (`backendMMHK/.../model/Driver.java`)
   - Fields: id, name, email, phone, password (hashed), vehicle info, etc.

2. **Create DriverRepository** (`backendMMHK/.../repository/DriverRepository.java`)
   - JPA repository for Driver entity

3. **Create DTOs** (`backendMMHK/.../model/dto/`)
   - LoginRequest, SignupRequest, AuthResponse

4. **Create AuthService** (`backendMMHK/.../service/AuthService.java`)
   - Password hashing (BCrypt)
   - JWT token generation
   - Validation logic

5. **Create AuthController** (`backendMMHK/.../controller/AuthController.java`)
   - REST endpoints for login/signup
   - Return JWT tokens

6. **Configure Spring Security** (if not already done)
   - JWT filter
   - Security configuration

---

## 🔐 Security Considerations

1. **Password Hashing**: Use BCrypt in backend
2. **JWT Tokens**: Store in httpOnly cookies (more secure) or localStorage
3. **Token Expiration**: Set reasonable expiration times
4. **HTTPS**: Always use in production
5. **Input Validation**: Validate all inputs on backend
6. **Rate Limiting**: Prevent brute force attacks

---

## 📝 Quick Reference: File Locations Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| **Login Page** | `frontend/src/pages/DriverLogin.tsx` | Driver login UI |
| **Signup Page** | `frontend/src/pages/DriverSignup.tsx` | Driver registration UI |
| **Auth Context** | `frontend/src/contexts/AuthContext.tsx` | Global auth state |
| **Protected Route** | `frontend/src/shared/components/ProtectedRoute.tsx` | Route protection |
| **Auth Service** | `frontend/src/services/authService.ts` | API calls |
| **Auth Controller** | `backendMMHK/.../controller/AuthController.java` | Backend endpoints |
| **Driver Entity** | `backendMMHK/.../model/Driver.java` | Database model |
| **Auth Service (Backend)** | `backendMMHK/.../service/AuthService.java` | Business logic |

---

## 🎨 UI/UX Recommendations

1. **Login Page**:
   - Email/Phone input
   - Password input with show/hide toggle
   - "Forgot Password?" link
   - "Don't have an account? Sign up" link
   - Multi-language support

2. **Signup Page**:
   - Personal info (name, email, phone)
   - Password with strength indicator
   - Vehicle information
   - Terms & conditions checkbox
   - "Already have an account? Login" link

3. **Error Handling**:
   - Display validation errors
   - Show network errors
   - Loading states during API calls

---

## ✅ Testing Checklist

- [ ] User can navigate to login page
- [ ] User can navigate to signup page
- [ ] Login form validates inputs
- [ ] Signup form validates inputs
- [ ] Successful login redirects to dashboard
- [ ] Successful signup redirects to dashboard
- [ ] Protected route redirects unauthenticated users
- [ ] Logout clears auth state
- [ ] Token persists on page refresh
- [ ] Multi-language support works
- [ ] Backend validates credentials
- [ ] Backend returns JWT token
- [ ] Backend hashes passwords

---

**Next Steps**: Start with Phase 1, Frontend Setup, beginning with the AuthContext. This will provide the foundation for all authentication features.

