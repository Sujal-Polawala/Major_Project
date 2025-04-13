// /routes/productRoutes.js

const express = require('express');
const { insertProducts, getAllProduct, getAllProducts, recommendationProduct, fetchProductById, getFilters, addProduct, updateProductById, deleteProductById , uploadProducts } = require('../../controllers/product/productController');
const { getBadges} = require('../../controllers/product/badgeController')
const { uploadImage, uploadCsv } = require("../../Middleware/multerMiddleware");
const { sellerAuthMiddleware } = require('../../Middleware/authMiddleware');
const router = express.Router();

router.post("/api/products", uploadImage ,addProduct);

router.post("/upload-csv", uploadCsv ,sellerAuthMiddleware, uploadProducts)
// Update a product by its ID
router.put("/api/products/:id",uploadImage , updateProductById);

// Delete a product by its ID

router.delete("/api/products/:id", deleteProductById);

// POST route to insert products
router.post('/api/insert', insertProducts);

// GET route to fetch all products
router.get('/api/products/:category', getAllProduct);

router.get('/api/product/recommendations', recommendationProduct);

router.get('/api/products', getAllProducts);

router.get('/products/:id', fetchProductById);

router.get('/api/badge', getBadges);

router.get('/api/filters', getFilters);
module.exports = router;
