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
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { fetchOrders, updateOrderStatus, createOrder } from '../store/slices/orderSlice';
import { fetchDeliveryPartners } from '../store/slices/deliverySlice';
import { logout } from '../store/slices/authSlice';
import socketService from '../services/socketService';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  const { deliveryPartners } = useSelector((state) => state.delivery);
  const [tabValue, setTabValue] = useState(0);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchDeliveryPartners());
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

  const handleCreateOrder = (orderData) => {
    dispatch(createOrder(orderData));
  };

  const handleAssignDeliveryPartner = (orderId, partnerId) => {
    dispatch(updateOrderStatus({ orderId, deliveryPartnerId: partnerId, status: 'ASSIGNED' }));
    setIsAssignDialogOpen(false);
    setSelectedOrder(null);
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

  const formatDispatchTime = (dispatchTime) => {
    if (!dispatchTime) return 'Not calculated';
    return new Date(dispatchTime).toLocaleTimeString();
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
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsOrderFormOpen(true)}
                    sx={{ mr: 2 }}
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
                      <TableCell>Dispatch Time</TableCell>
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
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon fontSize="small" />
                            {formatDispatchTime(order.dispatchTime)}
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(order.status)}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {order.status === 'PENDING' && (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleStatusUpdate(order._id, 'PREPARING')}
                                  size="small"
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                                  size="small"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            )}
                            {order.status === 'PREPARING' && (
                              <IconButton
                                color="success"
                                onClick={() => handleStatusUpdate(order._id, 'READY')}
                                size="small"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )}
                            {order.status === 'READY' && !order.deliveryPartner && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsAssignDialogOpen(true);
                                }}
                              >
                                Assign Delivery
                              </Button>
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
        open={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmit={handleCreateOrder}
        deliveryPartners={deliveryPartners}
      />

      <Dialog open={isAssignDialogOpen} onClose={() => setIsAssignDialogOpen(false)}>
        <DialogTitle>Assign Delivery Partner</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Delivery Partner</InputLabel>
            <Select
              value=""
              label="Select Delivery Partner"
              onChange={(e) => handleAssignDeliveryPartner(selectedOrder?._id, e.target.value)}
            >
              {deliveryPartners
                .filter(partner => !orders.some(order => 
                  order.deliveryPartner === partner._id && 
                  ['ASSIGNED', 'PICKED_UP'].includes(order.status)
                ))
                .map(partner => (
                  <MenuItem key={partner._id} value={partner._id}>
                    {partner.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantDashboard; 