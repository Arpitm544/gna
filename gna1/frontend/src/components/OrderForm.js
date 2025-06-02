import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const OrderForm = ({ open, onClose, onSubmit, deliveryPartners }) => {
  const [formData, setFormData] = useState({
    items: [{ name: '', quantity: 1, price: 0 }],
    customerName: '',
    deliveryAddress: '',
    prepTime: 15,
    deliveryPartner: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }
    if (formData.prepTime < 1 || formData.prepTime > 120) {
      newErrors.prepTime = 'Preparation time must be between 1 and 120 minutes';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item${index}Name`] = 'Item name is required';
      }
      if (item.quantity < 1) {
        newErrors[`item${index}Quantity`] = 'Quantity must be at least 1';
      }
      if (item.price < 0) {
        newErrors[`item${index}Price`] = 'Price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Order</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                error={!!errors.prepTime}
                helperText={errors.prepTime}
                inputProps={{ min: 1, max: 120 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                error={!!errors.deliveryAddress}
                helperText={errors.deliveryAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Delivery Partner</InputLabel>
                <Select
                  value={formData.deliveryPartner}
                  onChange={(e) => setFormData({ ...formData, deliveryPartner: e.target.value })}
                  label="Delivery Partner"
                >
                  <MenuItem value="">None</MenuItem>
                  {deliveryPartners.map((partner) => (
                    <MenuItem key={partner._id} value={partner._id}>
                      {partner.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {formData.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    error={!!errors[`item${index}Name`]}
                    helperText={errors[`item${index}Name`]}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    error={!!errors[`item${index}Quantity`]}
                    helperText={errors[`item${index}Quantity`]}
                    inputProps={{ min: 1 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    error={!!errors[`item${index}Price`]}
                    helperText={errors[`item${index}Price`]}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addItem}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm; 