import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { logout } from '../store/slices/authSlice';
import socketService from '../services/socketService';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchOrders());
    socketService.connect();
  }, [dispatch]);

  useEffect(() => {
    const handleNewOrder = (order) => {
      dispatch(fetchOrders());
    };

    const handleOrderStatusUpdate = (order) => {
      dispatch(fetchOrders());
    };

    socketService.on('newOrder', handleNewOrder);
    socketService.on('orderStatusUpdated', handleOrderStatusUpdate);

    return () => {
      socketService.off('newOrder', handleNewOrder);
      socketService.off('orderStatusUpdated', handleOrderStatusUpdate);
    };
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getFilteredOrders = () => {
    switch (tabValue) {
      case 0: // Pending
        return orders.filter(order => order.status === 'PENDING');
      case 1: // Preparing
        return orders.filter(order => order.status === 'PREPARING');
      case 2: // Ready
        return orders.filter(order => order.status === 'READY');
      case 3: // Completed
        return orders.filter(order => order.status === 'COMPLETED');
      default:
        return orders;
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: { color: 'warning', label: 'Pending' },
      PREPARING: { color: 'info', label: 'Preparing' },
      READY: { color: 'success', label: 'Ready' },
      COMPLETED: { color: 'default', label: 'Completed' }
    };

    const config = statusConfig[status] || { color: 'default', label: status };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Zomato Ops Pro
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'calc(100vh - 200px)'
              }}
            >
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={3}
                sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}
              >
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                  Restaurant Dashboard
                </Typography>
                <IconButton 
                  onClick={() => dispatch(fetchOrders())}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>

              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                sx={{ 
                  mb: 3,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'medium',
                    minWidth: 100
                  }
                }}
              >
                <Tab label="Pending" />
                <Tab label="Preparing" />
                <Tab label="Ready" />
                <Tab label="Completed" />
              </Tabs>

              <List sx={{ flex: 1 }}>
                {getFilteredOrders().map((order) => (
                  <ListItem
                    key={order._id}
                    divider
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 2,
                      borderRadius: 1,
                      boxShadow: 1,
                      '&:hover': {
                        boxShadow: 2,
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary" gutterBottom>
                          Order #{order._id.slice(-6)}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography component="span" variant="body1" color="text.primary" sx={{ display: 'block', mb: 1 }}>
                            {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary">
                            Customer: {order.customerName}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" alignItems="center" gap={2}>
                        {getStatusChip(order.status)}
                        {order.status === 'PENDING' && (
                          <IconButton
                            edge="end"
                            color="primary"
                            onClick={() => handleStatusUpdate(order._id, 'PREPARING')}
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.main' }
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}
                        {order.status === 'PREPARING' && (
                          <IconButton
                            edge="end"
                            color="success"
                            onClick={() => handleStatusUpdate(order._id, 'READY')}
                            sx={{ 
                              bgcolor: 'success.light',
                              color: 'white',
                              '&:hover': { bgcolor: 'success.main' }
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}
                        {order.status === 'PENDING' && (
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                            sx={{ 
                              bgcolor: 'error.light',
                              color: 'white',
                              '&:hover': { bgcolor: 'error.main' }
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RestaurantDashboard; 