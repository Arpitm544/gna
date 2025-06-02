import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const orderService = {
  getOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`, getAuthHeader());
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, getAuthHeader());
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData, getAuthHeader());
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  },

  assignDeliveryPartner: async (orderId, deliveryPartnerId) => {
    const response = await axios.post(
      `${API_URL}/orders/${orderId}/assign`,
      { deliveryPartnerId },
      getAuthHeader()
    );
    return response.data;
  },

  getDeliveryPartners: async () => {
    const response = await axios.get(`${API_URL}/delivery-partners`, getAuthHeader());
    return response.data;
  },

  getDeliveryPartnerOrders: async (partnerId) => {
    const response = await axios.get(
      `${API_URL}/delivery-partners/${partnerId}/orders`,
      getAuthHeader()
    );
    return response.data;
  },

  getDeliveryPartnerStats: async (partnerId) => {
    const response = await axios.get(
      `${API_URL}/delivery-partners/${partnerId}/stats`,
      getAuthHeader()
    );
    return response.data;
  }
};

export default orderService; 