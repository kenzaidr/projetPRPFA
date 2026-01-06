const API_BASE_URL = 'http://localhost:8080/api/drivers';

export interface DriverStatsResponse {
  todayEarnings: number;
  totalRides: number;
  onlineHours: number;
  acceptanceRate: number;
  rating: number;
  isOnline: boolean;
  lastOnlineAt: string | null;
}

export interface DriverLoginResponse {
  token: string | null;
  email: string;
  message: string;
  driverId: number | null;
  name: string | null;
}

export interface DriverRegisterResponse {
  email: string;
  message: string;
  driverId: number | null;
}

export interface DriverRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleModel: string;
  licensePlate: string;
  vehicleColor: string;
}

export const driverService = {
  // Register driver
  async register(data: DriverRegisterRequest): Promise<DriverRegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.message !== 'Registration successful') {
        throw new Error(result.message || 'Registration failed');
      }
      
      return result;
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
      }
      // Re-throw other errors
      throw error;
    }
  },

  // Login driver
  async login(email: string, password: string): Promise<DriverLoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.token) {
        throw new Error(data.message || 'Login failed - no token received');
      }
      
      return data;
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
      }
      // Re-throw other errors
      throw error;
    }
  },
  // Get driver stats
  async getStats(driverId: number): Promise<DriverStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/${driverId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch driver stats');
    }
    
    return response.json();
  },

  // Get driver profile
  async getProfile(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch driver profile');
    }
    
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
    
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    
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
    
    if (!response.ok) {
      throw new Error('Failed to update location');
    }
    
    return response.json();
  },

  // Get driver orders
  async getOrders(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/${driverId}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch driver orders');
    }
    
    return response.json();
  },
};

