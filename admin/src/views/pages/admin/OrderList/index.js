import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Typography,
  Box,
  useMediaQuery,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper
} from '@mui/material';
import { Visibility, Print } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrder } from 'features/orderSlice';

const OrderList = () => {
  const { orders, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrder());
  }, [dispatch]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
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

  const columns = [
    { field: 'index',
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
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'status', headerName: 'Status', width: 150 },

    {
      field: 'seller',
      headerName: 'Seller',
      width: 150,
      renderCell: (params) => {
        if (!params.row.items || !Array.isArray(params.row.items)) return 'N/A';
    
        const sellerNames = params.row.items
          .map(item => item.sellerId && item.sellerId.name ? item.sellerId.name : 'Unknown')
          .filter(name => name !== 'Unknown'); // Remove empty values
    
        return sellerNames.length > 0 ? sellerNames.join(', ') : 'N/A';
      }
    },    

    {
      field: 'view',
      headerName: 'View',
      width: 120,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleView(params.row)}>
          <Visibility />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      {/* <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        Order Management
      </Typography> */}

        <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={5}
            loading={loading}
            getRowId={(row) => row._id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'white', // Dark background color
                color: 'black' // White text for contrast
              },
              '& .MuiDataGrid-virtualScroller': {
                // Light background for rows
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'white', // Dark footer
                color: 'white' // White text for footer
              }
            }}
          />
        </Box>

      {/* Order Details Modal */}
      {selectedOrder && (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle>Order Details</DialogTitle>
    <DialogContent>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Order ID:</strong></TableCell>
              <TableCell>{selectedOrder.orderId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>User ID:</strong></TableCell>
              <TableCell>{selectedOrder.userId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Name:</strong></TableCell>
              <TableCell>{selectedOrder.paymentId?.cardHolderName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Status:</strong></TableCell>
              <TableCell>{selectedOrder.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Total Price:</strong></TableCell>
              <TableCell>${selectedOrder.totalPrice}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Delivery Date:</strong></TableCell>
              <TableCell>
                {selectedOrder.deliveryDate
                  ? new Date(selectedOrder.deliveryDate).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Order Items
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Seller</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedOrder.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <Avatar src={item.image} alt={item.title} sx={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.sellerId?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button onClick={handlePrint} startIcon={<Print />}  variant="contained" color="primary">
        Print
      </Button>
      <Button onClick={handleClose} variant="contained" color="error">
        Close
      </Button>
    </DialogActions>
  </Dialog>
)}

    </Box>
  );
};

export default OrderList;
