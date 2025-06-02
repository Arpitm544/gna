import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
  },
})

export default store 