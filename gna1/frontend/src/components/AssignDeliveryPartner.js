import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { DirectionsBike as BikeIcon } from '@mui/icons-material';

const AssignDeliveryPartner = ({ open, onClose, order, onAssign }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/delivery/available', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPartners(data);
      } catch (err) {
        setError('Failed to fetch delivery partners');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchPartners();
    }
  }, [open]);

  const calculateDispatchTime = (partner) => {
    const prepTime = order.prepTime;
    const eta = partner.eta || 15; // Default ETA if not provided
    const dispatchTime = new Date(Date.now() + (prepTime + eta) * 60000);
    return dispatchTime.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography color="error">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Delivery Partner</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Order #{order.orderId}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Preparation Time: {order.prepTime} minutes
        </Typography>

        <List>
          {partners.map((partner) => (
            <ListItem
              key={partner._id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemText
                primary={partner.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textSecondary">
                      ETA: {partner.eta || 15} minutes
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      Dispatch Time: {calculateDispatchTime(partner)}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    icon={<BikeIcon />}
                    label={partner.activeOrders} 
                    color={partner.activeOrders < 3 ? 'success' : 'error'}
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onAssign(partner._id)}
                    disabled={partner.activeOrders >= 3}
                  >
                    Assign
                  </Button>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDeliveryPartner; 