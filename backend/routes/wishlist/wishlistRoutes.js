const express = require('express')
const { addWishlist, getWishList, removeWishList } = require('../../controllers/wishList/wishListController')
const { authMiddleware } = require('../../Middleware/authMiddleware')
const router = express.Router()

router.post('/wishlist/add'  ,addWishlist );
router.get('/wishlist/:userId' , getWishList)
router.post('/wishlist/remove' , removeWishList)

module.exports = router;