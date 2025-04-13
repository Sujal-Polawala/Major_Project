import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Typography, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import { Edit, Delete, Visibility, Add, Print, UploadFile, Replay } from '@mui/icons-material';
import AddProductDialog from '../../../../component/AddProductDialog';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchProduct, updateProduct } from 'features/productSlice';
import CsvUploadDialog from '../../../../component/csvUploadDialog';

const ProductList = () => {
    const [open, setOpen] = useState(false);
    const [openDialogCSV, setOpenDialogCSV] = useState(false);
    const { products, loading } = useSelector((state) => state.products);
    const [editProduct, setEditProduct] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, productId: null });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const sellerId = useSelector((state) => state.auth.seller.sellerId)
    const [isImageModelOpen, setIsImageModelOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBadge, setSelectedBadge] = useState('');
    const dispatch = useDispatch();
    // Detect screen size
    const isMobile = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        if (sellerId) { // 🔥 Clear old products
            dispatch(fetchProduct(sellerId)); // Fetch new seller's products
        }
    }, [sellerId, dispatch]); 
    

    const handleDelete = (id) => {
        setConfirmDialog({ open: true, productId: id });
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteProduct(confirmDialog.productId)).unwrap();
            //dispatch(removeProductFromState(confirmDialog.productId));  // Refresh product list after delete
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setConfirmDialog({ open: false, productId: null });
    };

    const handleOpen = () => setOpen(true);
    
    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const closeViewDialog = () => {
        setSelectedProduct(null);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setOpen(true);
    };

    const openImageModel = (image) => {
        setSelectedImage(image);
        setIsImageModelOpen(true);
    }

    const closeImageModel = () => {
        setSelectedImage(null);
        setIsImageModelOpen(false);
    }

    // Extract unique category and badge for filtering
    const categories = [...new Set(products.map((p) => p?.category))];
    const badges = [...new Set(products.map((p) => p?.badge))];

    // Filter products based on selection
    const filterProducts = products.filter((product) =>
        (selectedCategory ? product.category === selectedCategory : true) &&
        (selectedBadge ? product.badge === selectedBadge : true)
    );

    const handleUpdate = (updatedData) => {
        if (editProduct) {
            dispatch(updateProduct({ id: editProduct._id, updatedData }))
                .unwrap()
                .then(() => { 
                    setOpen(false);
                    setEditProduct(null);
                })
                .catch((err) => console.error('Update failed:', err));
        }
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
            field: "index", 
            headerName: "No", 
            width: 70, 
            renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 
        },
        { field: 'title', headerName: 'Product Name', width: isMobile ? 100 : 150 },
        { field: 'description', headerName: 'Description', width: isMobile ? 80 : 120 },
        { field: 'category', headerName: 'Category', width: isMobile ? 80 : 120 },
        { field: 'badge', headerName: 'Badge', width: isMobile ? 80 : 120 },
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
            renderCell: (params) => `${params.value >= 0 ? `${params.value}` : "Out of stock"}`
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
            field: 'actions',
            headerName: 'Actions',
            width: isMobile ? 120 : 150,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <Edit fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleView(params.row)}>
                        <Visibility fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <Delete fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, overflowX: 'auto', whiteSpace: 'nowrap', p: 1 }}>
            <IconButton sx={{ color: '#333', '&:hover': { color: '#444' } }} onClick={handlePrint}><Print /></IconButton>

            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    {categories.map((cat, index) => (<MenuItem key={index} value={cat}>{cat}</MenuItem>))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Badge</InputLabel>
                <Select value={selectedBadge} onChange={(e) => setSelectedBadge(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    {badges.map((badge, index) => (<MenuItem key={index} value={badge}>{badge}</MenuItem>))}
                </Select>
            </FormControl>

            <Button variant="contained" color="secondary" sx={{ fontSize: '0.9rem', px: 2, minWidth: 100 }} onClick={() => { setSelectedCategory(''); setSelectedBadge(''); }}>
                <Replay />Reset
            </Button>
            
            <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#444' }, fontSize: '0.9rem', px: 2 }} onClick={() => setOpenDialogCSV(true)}>
                <UploadFile /> {isMobile ? '' : 'Upload Product'}
            </Button>
            
            <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#444' }, fontSize: '0.9rem', px: 2, minWidth: 150 }} onClick={handleOpen}>
                <Add fontSize="small" />Add product
            </Button>
        </Box>

                <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
                    <DataGrid
                        rows={filterProducts.map((product) => ({ ...product, id: product._id })) }
                        columns={columns}
                        getRowId={(row) => row._id} // Use _id as the unique identifier
                        pageSize={isMobile ? 3 : 5}
                        loading={loading}
                        disableColumnMenu={isMobile}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "white", // Dark background color
                                color: "black", // White text for contrast
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                 // Light background for rows
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "white", // Dark footer
                                color: "white", // White text for footer
                            },
                        }}
                    />
                </Box>
            <AddProductDialog open={open} handleClose={handleClose} product={editProduct} handleUpdate={handleUpdate} />

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, productId: null })}
                maxWidth="xs" // Set a smaller fixed width for the dialog
                fullWidth // Ensure the dialog takes up the full width of its container
                
            >
                {/* Dialog Title */}
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        backgroundColor: "#f5f5f5",
                        py: 2,
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >
                    Confirm Deletion
                </DialogTitle>

                {/* Dialog Content */}
                <DialogContent sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1">
                        Are you sure you want to delete this product?
                    </Typography>
                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions
                    sx={{
                        justifyContent: "center",
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                    }}
                >
                    {/* Cancel Button */}
                    <Button
                        onClick={() => setConfirmDialog({ open: false, productId: null })}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            "&:hover": {
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                borderColor: "#1976d2",
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Delete Button */}
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            backgroundColor: "#d32f2f",
                            "&:hover": {
                                backgroundColor: "#b71c1c",
                            },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

            <Dialog open={!!selectedProduct} onClose={closeViewDialog} maxWidth="sm" fullWidth sx={{ width: isMobile ? "auto":"450px", mx: "auto" }}>
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

            <CsvUploadDialog open={openDialogCSV} handleClose={() => setOpenDialogCSV(false)} />
            </>
    );
};

export default ProductList;
