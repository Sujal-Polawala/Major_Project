const express = require('express');
const { AddToCart, countTotalCartItems } = require('../../controllers/cart/cartController');
const { getCartByUser, removeCart, clearCart, updatedCart } = require('../../controllers/cart/cartUserController');

const router = express.Router();

// Add product to cart
router.post('/api/cart', AddToCart);

// Count total cart items
router.get('/api/cart/count/:userId', countTotalCartItems);

// Get cart by user
router.get('/api/cart/:userId', getCartByUser);

// Remove product from cart
router.delete('/api/cart/:cartItemId', removeCart);

// Update cart
router.put('/api/cart/update', updatedCart);

// Clear all cart items
router.delete('/api/cart/clear/:userId', clearCart);

module.exports = router;