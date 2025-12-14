// services/foodService.js
const API_URL = 'http://localhost:8080/api';

export const getRestaurants = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/restaurants`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
};

export const getMenu = async (restaurantId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/restaurants/${restaurantId}/menu`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return await response.json();
};

export const getOrderStatus = async (orderId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
};