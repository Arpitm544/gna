import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSelector } from 'react-redux'

// Pages
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import RestaurantDashboard from './pages/RestaurantDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import NotFound from './pages/NotFound'

// Components
import PrivateRoute from './components/PrivateRoute'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={user.role === 'RESTAURANT_MANAGER' ? '/restaurant' : '/delivery'} /> : <Login />
          } />
          
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to={user.role === 'RESTAURANT_MANAGER' ? '/restaurant' : '/delivery'} /> : <SignUp />
          } />
          
          <Route path="/restaurant" element={
            <PrivateRoute role="RESTAURANT_MANAGER">
              <RestaurantDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/delivery" element={
            <PrivateRoute role="DELIVERY_PARTNER">
              <DeliveryDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate to={user.role === 'RESTAURANT_MANAGER' ? '/restaurant' : '/delivery'} />
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
