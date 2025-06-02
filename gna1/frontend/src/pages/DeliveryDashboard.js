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
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import socketService from '../services/socketService';

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    // Listen for new order assignments
    socketService.on('orderAssigned', (order) => {
      dispatch(fetchOrders());
    });

    // Listen for order status updates
    socketService.on('orderStatusUpdated', (order) => {
      dispatch(fetchOrders());
    });

    return () => {
      socketService.off('orderAssigned');
      socketService.off('orderStatusUpdated');
    };
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const getFilteredOrders = () => {
    switch (tabValue) {
      case 0: // Assigned
        return orders.filter(order => order.status === 'ASSIGNED');
      case 1: // Picked Up
        return orders.filter(order => order.status === 'PICKED_UP');
      case 2: // Delivered
        return orders.filter(order => order.status === 'DELIVERED');
      default:
        return orders;
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      ASSIGNED: { color: 'warning', label: 'Assigned' },
      PICKED_UP: { color: 'info', label: 'Picked Up' },
      DELIVERED: { color: 'success', label: 'Delivered' }
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h1">
                Delivery Dashboard
              </Typography>
              <IconButton onClick={() => dispatch(fetchOrders())}>
                <RefreshIcon />
              </IconButton>
            </Box>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Assigned" />
              <Tab label="Picked Up" />
              <Tab label="Delivered" />
            </Tabs>
            <List>
              {getFilteredOrders().map((order) => (
                <ListItem
                  key={order._id}
                  divider
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1
                  }}
                >
                  <ListItemText
                    primary={`Order #${order._id.slice(-6)}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          From: {order.restaurantName}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          To: {order.deliveryAddress}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusChip(order.status)}
                      {order.status === 'ASSIGNED' && (
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleStatusUpdate(order._id, 'PICKED_UP')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {order.status === 'PICKED_UP' && (
                        <IconButton
                          edge="end"
                          color="success"
                          onClick={() => handleStatusUpdate(order._id, 'DELIVERED')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LocationIcon />}
                        onClick={() => window.open(`https://maps.google.com/?q=${order.deliveryAddress}`, '_blank')}
                      >
                        Navigate
                      </Button>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeliveryDashboard; 