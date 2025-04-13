import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Visibility, Print , Replay } from '@mui/icons-material';
import AddProductDialog from '../../../../component/AddProductDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from 'features/productSlice';

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const { products, loading } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  //   const sellerId = useSelector((state) => state.auth.seller.sellerId)
  const [isImageModelOpen, setIsImageModelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  // Detect screen size
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    // dispatch(resetProductState()); // 🔥 Clear old products
    dispatch(fetchAllProducts()); // Fetch new seller's products
  }, [dispatch]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  const openImageModel = (image) => {
    setSelectedImage(image);
    setIsImageModelOpen(true);
  };

  const closeImageModel = () => {
    setIsImageModelOpen(false);
    setSelectedImage(null);
  };

  // Extract unique categories and sellers for filtering
  const categories = [...new Set(products.map((p) => p?.category))];
  const sellers = [...new Set(products.map((p) => p.sellerId?.name))];

  // Filter products based on selection
  const filteredProducts = products.filter((product) =>
    (selectedCategory ? product.category === selectedCategory : true) &&
    (selectedSeller ? product.sellerId?.name === selectedSeller : true)
  );

  const closeViewDialog = () => {
    setSelectedProduct(null);
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
            <html>
                <head>
                    <title>Product List</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        img { width: 50px; height: 50px; object-fit: cover; }
                    </style>
                </head>
                <body>
                    <h1>Product List</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Seller Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products
                              .map(
                                (product, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${product.title}</td>
                                    <td>${product.description}</td>
                                    <td>${product.category}</td>
                                    <td>${product.sellerId?.name}
                                    <td>$${product.price}</td>
                                    <td>${product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
                                    <td><img src="${product.image || 'https://via.placeholder.com/50'}" /></td>
                                </tr>
                            `
                              )
                              .join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
    iframeDoc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };

  const columns = [
    {
      field: 'index',
      headerName: 'No',
      width: 70,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1
    },
    { field: 'title', headerName: 'Product Name', width: isMobile ? 100 : 150 },
    { field: 'description', headerName: 'Description', width: isMobile ? 80 : 120 },
    { field: 'category', headerName: 'Category', width: isMobile ? 80 : 120 },
    {
      field: 'seller',
      headerName: 'seller name',
      width: isMobile ? 80 : 120,
      renderCell: (params) => params.row.sellerId?.name
    },
    {
      field: 'price',
      headerName: 'Price',
      width: isMobile ? 80 : 120,
      renderCell: (params) => `$${params.value}`
    },
    {
      field: 'quantity',
      headerName: 'Stock',
      width: isMobile ? 80 : 120,
      renderCell: (params) => `${params.value >= 0 ? `${params.value}` : 'Out of stock'}`
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Button style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        onClick={() => openImageModel(params.value)} >

        <img src={params.value} alt={params.row.title} style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }} />
        </Button>
      )
    },
    {
      field: 'view',
      headerName: 'View',
      width: isMobile ? 120 : 150,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" onClick={() => handleView(params.row)}>
            <Visibility fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </Box>
      )
    }
  ];

  
  
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          overflowX: 'auto', // Enable horizontal scrolling for small screens
          whiteSpace: 'nowrap', // Prevent wrapping
          p: 1, // Add padding for better touch interaction
        }}
      >
        <IconButton
          sx={{ color: '#333', '&:hover': { color: '#444' }, fontSize: '0.9rem' }}
          onClick={handlePrint}
        >
          <Print fontSize="small" />
        </IconButton>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map((cat, index) => (
              <MenuItem key={index} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Seller</InputLabel>
          <Select value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {sellers.map((seller, index) => (
              <MenuItem key={index} value={seller}>{seller}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          sx={{ fontSize: '0.9rem', px: 2, minWidth: 100 }}
          onClick={() => {
            setSelectedCategory('');
            setSelectedSeller('');
          }}
        >
          <Replay />Reset
        </Button>
      </Box>

        <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={filteredProducts.map((product) => ({ ...product, id: product._id }))}
            columns={columns}
            getRowId={(row) => row._id} // Use _id as the unique identifier
            pageSize={isMobile ? 3 : 5}
            disableColumnMenu={isMobile}
            loading={loading}
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

      <AddProductDialog open={open} handleClose={handleClose} />

      {/* Image Dialog */}
      <Dialog open={isImageModelOpen} onClose={closeImageModel} maxWidth="sm" sx={{ width: isMobile ? "auto":"450px", mx: "auto" }} fullWidth>
        <DialogContent>
          <img src={selectedImage} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button
            onClick={closeImageModel}
            variant="contained"
            color='error'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>      
      <Dialog
        open={!!selectedProduct}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
        sx={{ width: isMobile ? 'auto' : '450px', mx: 'auto' }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', backgroundColor: '#f5f5f5', py: 2 }}>
          Product Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedProduct && (
            <Box>
              {/* Image */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </Box>

              {/* Product Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedProduct._id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedProduct.title}
                </Typography>
                <Typography variant="body1">
                  <strong>Category:</strong> {selectedProduct.category}
                </Typography>
                <Typography variant="body1">
                  <strong>Seller:</strong> {selectedProduct.sellerId?.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Price:</strong> ${selectedProduct.price}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedProduct.description}
                </Typography>
                <Typography variant="body1">
                  <strong>Stock:</strong> {selectedProduct.quantity}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button
            onClick={closeViewDialog}
            variant="contained"
            color='error'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;
