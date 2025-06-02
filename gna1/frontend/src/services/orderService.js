import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createOrder = async (orderData) => {
  console.log("Sending order data:", orderData);
  try {
    const res = await axios.post(`${API_URL}/orders`, orderData);
    return res.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw error;
  }
};

export const assignDeliveryPartner = async (orderId, deliveryPartnerId) => {
  try {
    const res = await axios.put(`${API_URL}/orders/${orderId}/assign`, { deliveryPartnerId });
    return res.data;
  } catch (error) {
    console.error("Error assigning delivery partner:", error.response?.data || error.message);
    throw error;
  }
};

const orderService = {
  getOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
    return response.data;
  },

  assignDeliveryPartner: async (orderId, deliveryPartnerId) => {
    const response = await axios.put(`${API_URL}/orders/${orderId}/assign`, { deliveryPartnerId });
    return response.data;
  },

  getDeliveryPartners: async () => {
    const response = await axios.get(`${API_URL}/delivery-partners`);
    return response.data;
  },

  getDeliveryPartnerOrders: async (partnerId) => {
    const response = await axios.get(`${API_URL}/delivery-partners/${partnerId}/orders`);
    return response.data;
  },

  getDeliveryPartnerStats: async (partnerId) => {
    const response = await axios.get(`${API_URL}/delivery-partners/${partnerId}/stats`);
    return response.data;
  }
};

export default orderService; 