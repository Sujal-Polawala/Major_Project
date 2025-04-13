import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AddProduct, resetProductState } from 'features/productSlice';
import { fetchCategories } from 'features/categorySlice';
import CustomSnackbar from './CustomSnackbar'; // Import Snackbar component

const initialProductState = {
  title: '',
  description: '',
  price: '',
  quantity: '',
  category: '',
  badge: 'Popular',
  image: null,
  imagePreview: null
};

const AddProductDialog = ({ open, handleClose, product, handleUpdate }) => {
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [formErrors, setFormErrors] = useState({});
  const categories = useSelector((state) => state.categories.data);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.products);
  const sellerId = useSelector((state) => state.auth.seller?.sellerId);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [categories, dispatch]);

  useEffect(() => {
    setNewProduct(product ? { ...product, image: null, imagePreview: product.image || null } : initialProductState);
  }, [product]);

  useEffect(() => {
    if (message || error) {
      setSnackbar({ open: true, message: message || error, severity: message ? 'success' : 'error' });

      // Reset message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(resetProductState());
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout if component unmounts
    }
  }, [message, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value.trimStart() }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const errors = ['title', 'description', 'price', 'quantity', 'category'].reduce((acc, field) => {
      const value = newProduct[field];

      if (!value || (typeof value === 'string' && !value.trim()) || (['price', 'quantity'].includes(field) && value <= 0)) {
        acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }

      return acc;
    }, {});

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;
    // Check if sellerId exists
    if (!sellerId) {
      setSnackbar({ open: true, message: 'Seller ID not found. Please log in again.', severity: 'error' });
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append product data to FormData
    Object.entries(newProduct).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (!product) {
      formData.append('sellerId', String(sellerId));
    }

    // Handle update or add product
    if (product) {
      handleUpdate(formData);
    } else {
      try {
        await dispatch(AddProduct(formData));
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const resetForm = () => {
    setNewProduct({
      title: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      badge: 'Popular',
      image: null,
      imagePreview: null
    });
  };

  const handleCloseAdd = () => {
    setFormErrors({})
    resetForm()
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ width: isMobile ? 'auto' : '450px', mx: 'auto' }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <TextField
              label="Name"
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              fullWidth
              error={!!formErrors.title}
              helperText={formErrors.title}
            />
            <TextField
              label="Description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.price}
                helperText={formErrors.price}
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
              />
            </Box>
            <FormControl fullWidth variant="outlined" error={!!formErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={newProduct.category} onChange={handleInputChange}>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Badge</InputLabel>
              <Select name="badge" value={newProduct.badge} onChange={handleInputChange} label="Badge">
                <MenuItem value="Popular">Popular</MenuItem>
                <MenuItem value="Top Rated">Top Rated</MenuItem>
                <MenuItem value="Average">Average</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
                <MenuItem value="Affordable">Affordable</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="image-upload" />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Image
                </Button>
              </label>
              {newProduct.imagePreview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img
                    src={newProduct.imagePreview}
                    alt="Product Preview"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant="contained" color="error">
            Close
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {loading ? <CircularProgress size={22} /> : product ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default AddProductDialog;
