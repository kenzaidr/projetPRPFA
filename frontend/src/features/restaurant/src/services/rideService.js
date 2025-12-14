// services/rideService.js
const API_URL = 'http://localhost:8080/api';

export const requestRide = async (rideData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/ride/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(rideData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur de commande');
  }

  return await response.json();
};

export const getRideStatus = async (rideId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/ride/${rideId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};