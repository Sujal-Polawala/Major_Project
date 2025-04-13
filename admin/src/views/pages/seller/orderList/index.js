import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar
} from '@mui/material';
import { Visibility, Print } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderBySeller, updateOrderStatus } from 'features/orderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.orders);
  const sellerId = useSelector((state) => state.auth.seller.sellerId);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const theme = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({}); // Store temporary status changes

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchOrderBySeller(sellerId));
    }
  }, [sellerId, dispatch]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Order Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          img { width: 50px; height: 50px; object-fit: cover; }
        </style>
      </head>
      <body>
        <h1>Order Details</h1>
        <p><strong>Order ID:</strong> ${selectedOrder.orderId}</p>
        <p><strong>User ID:</strong> ${selectedOrder.userId}</p>
        <p><strong>Name:</strong> ${selectedOrder.paymentId?.cardHolderName}</p>
        <p><strong>Status:</strong> ${selectedOrder.status}</p>
        <p><strong>Total Price:</strong> $${selectedOrder.totalPrice}</p>
        <p><strong>Delivery Date:</strong> ${
          selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'N/A'
        }</p>
        
        <h2>Order Items</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Seller</th>
            </tr>
          </thead>
          <tbody>
            ${selectedOrder.items
              .map(
                (item) => `
                <tr>
                  <td>${item.title}</td>
                  <td><img src="${item.image}" alt="${item.title}" /></td>
                  <td>${item.category}</td>
                  <td>$${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>${item.sellerId?.name}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Handle order status change
  const handleStatusChange = (orderId, newStatus) => {
    const currentStatus = statusUpdates[orderId] || orders.find((o) => o.orderId === orderId)?.status;

    if (currentStatus === 'Delivered') {
      return; // Prevent change if already delivered
    }

    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));

    setTimeout(() => {
      dispatch(updateOrderStatus({ orderId: orderId, status: newStatus }));
    }, 500);
  };

  const columns = [
    {
      field: 'index',
      headerName: 'No',
      width: 60,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1
    },
    { field: 'orderId', headerName: 'Order ID', width: isMobile ? 100 : 150 },
    { field: 'userId', headerName: 'User ID', width: isMobile ? 120 : 200 },
    {
      field: 'cardHolderName',
      headerName: 'Name',
      width: isMobile ? 100 : 150,
      renderCell: (params) => params.row.paymentId?.cardHolderName || 'N/A'
    },
    {
      field: 'totalPrice',
      headerName: 'Total ($)',
      width: isMobile ? 80 : 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <Select
          value={statusUpdates[params.row.orderId] || params.row.status}
          onChange={(e) => handleStatusChange(params.row.orderId, e.target.value)}
          sx={{ width: '100%' }}
          disabled={params.row.status === 'Delivered'} // Disable if Delivered
        >
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      )
    },
    {
      field: 'seller',
      headerName: 'Seller',
      width: 150,
      renderCell: (params) => {
        if (!params.row.items || !Array.isArray(params.row.items)) return 'N/A';
        const sellerNames = params.row.items.map((item) => item.sellerId?.name || 'Unknown').filter((name) => name !== 'Unknown');
        return sellerNames.length > 0 ? sellerNames.join(', ') : 'N/A';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleView(params.row)}>
          <Visibility />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Box sx={{ height: 500, width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          loading={loading}
          getRowId={(row) => row._id}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white',
              color: theme.palette.mode === 'dark' ? 'white' : 'black'
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.mode === 'dark' ? '#222' : 'white',
              color: theme.palette.mode === 'dark' ? 'white' : 'black'
            }
          }}
        />
      </Box>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </Typography>
            <Typography variant="body1">
              <strong>User ID:</strong> {selectedOrder.userId}
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {selectedOrder.paymentId?.cardHolderName}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {selectedOrder.status}
            </Typography>
            <Typography variant="body1">
              <strong>Total Price:</strong> ${selectedOrder.totalPrice}
            </Typography>
            <Typography variant="body1">
              <strong>Delivery Date:</strong>{' '}
              {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'N/A'}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Order Items
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedOrder.items.map((item) => (
                <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={item.image} alt={item.title} sx={{ width: 50, height: 50 }} />
                  <Box>
                    <Typography variant="body1">
                      <strong>{item.title}</strong> ({item.category})
                    </Typography>
                    <Typography variant="body2">
                      Price: ${item.price} x {item.quantity}
                    </Typography>
                    <Typography variant="body2">Seller: {item.sellerId?.name}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrint} startIcon={<Print />} color="primary">
              Print
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OrderList;
