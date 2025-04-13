const express = require('express');

const userAuthRoutes = require('./userAuth/userAuthRoutes');
const userRoutes = require('./user/userRoutes');
const productRoutes = require('./product/productRoutes');
const cartRoutes = require('./cart/cartRoutes');
const categoryRoutes = require('./category/categoryRoutes')
const orderRoutes = require('./order/orderRoutes');
const paymentRoutes = require('./payment/paymentRoutes');
const adminRoutes = require('./admin/adminRoutes');
const sellerRoutes = require('./seller/sellerAuthRoutes')
const notificationRoutes = require('./notification/notificationRoutes')
const couponRoutes = require('./coupon/couponRoutes')
const wishlistRoutes = require('./wishlist/wishlistRoutes');
const { searchByImage } = require('../controllers/search/searchController');
const { uploadImage } = require('../Middleware/multerMiddleware');


const router = express.Router();

// Apply middleware to all routes in this router

router.use('/', userAuthRoutes);
router.use('/', userRoutes);
router.use('/', productRoutes);
router.use('/', cartRoutes);
router.use('/', categoryRoutes);
router.use('/', orderRoutes);   
router.use('/', paymentRoutes);
router.use('/', adminRoutes);
router.use('/', sellerRoutes);
router.use('/api/notifications',notificationRoutes);
router.use('/', couponRoutes);
router.use('/' , wishlistRoutes)
router.use('/search-product', uploadImage,searchByImage)

module.exports = router