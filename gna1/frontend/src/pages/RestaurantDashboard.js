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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { logout } from '../store/slices/authSlice';
import socketService from '../services/socketService';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import AssignDeliveryPartner from '../components/AssignDeliveryPartner';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = useState(0);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleCreateOrder = async (orderData) => {
    try {
      // Validate required fields
      if (!orderData.customerName?.trim()) {
        throw new Error('Customer name is required');
      }
      if (!orderData.deliveryAddress?.trim()) {
        throw new Error('Delivery address is required');
      }
      if (!orderData.prepTime || orderData.prepTime < 1) {
        throw new Error('Preparation time must be at least 1 minute');
      }
      if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('At least one item is required');
      }

      // Validate each item
      const validatedItems = orderData.items.map(item => {
        if (!item.name?.trim()) {
          throw new Error('Item name is required');
        }
        if (!item.quantity || item.quantity < 1) {
          throw new Error('Item quantity must be at least 1');
        }
        if (!item.price || item.price < 0) {
          throw new Error('Item price must be non-negative');
        }
        return {
          name: item.name.trim(),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        };
      });

      // Calculate total amount
      const totalAmount = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Prepare final order data
      const finalOrderData = {
        customerName: orderData.customerName.trim(),
        deliveryAddress: orderData.deliveryAddress.trim(),
        prepTime: parseInt(orderData.prepTime),
        items: validatedItems,
        totalAmount: totalAmount
      };

      console.log('Sending order data:', finalOrderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalOrderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      dispatch(fetchOrders());
      setOrderFormOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      // You might want to show this error to the user via a snackbar or alert
    }
  };

  const handleAssignPartner = async (partnerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ deliveryPartnerId: partnerId })
      });

      if (!response.ok) {
        throw new Error('Failed to assign delivery partner');
      }

      dispatch(fetchOrders());
      setAssignDialogOpen(false);
    } catch (error) {
      console.error('Error assigning delivery partner:', error);
    }
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
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOrderFormOpen(true)}
                  >
                    New Order
                  </Button>
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

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Prep Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredOrders().map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </TableCell>
                        <TableCell>{order.prepTime} mins</TableCell>
                        <TableCell>{getStatusChip(order.status)}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {order.status === 'PENDING' && (
                              <IconButton
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
                            {order.status === 'READY' && (
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setAssignDialogOpen(true);
                                }}
                                sx={{ 
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'primary.main' }
                                }}
                              >
                                <ShippingIcon />
                              </IconButton>
                            )}
                            {order.status === 'PENDING' && (
                              <IconButton
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <OrderForm
        open={orderFormOpen}
        onClose={() => setOrderFormOpen(false)}
        onSubmit={handleCreateOrder}
      />

      <AssignDeliveryPartner
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        order={selectedOrder}
        onAssign={handleAssignPartner}
      />
    </Box>
  );
};

export default RestaurantDashboard; 