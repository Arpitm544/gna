import { io } from 'socket.io-client'
import store from '../store'
import { updateOrderInList } from '../store/slices/orderSlice'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (this.socket) return

    this.socket = io(API_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    this.socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    this.socket.on('newOrder', (order) => {
      store.dispatch(updateOrderInList(order))
    })

    this.socket.on('orderAssigned', (data) => {
      // Fetch updated order
      this.fetchUpdatedOrder(data.orderId)
    })

    this.socket.on('orderStatusUpdated', (data) => {
      // Fetch updated order
      this.fetchUpdatedOrder(data.orderId)
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  async fetchUpdatedOrder(orderId) {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const order = await response.json()
      store.dispatch(updateOrderInList(order))
    } catch (error) {
      console.error('Error fetching updated order:', error)
    }
  }
}

export default new SocketService() 