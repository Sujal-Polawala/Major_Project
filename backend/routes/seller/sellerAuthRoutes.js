const express = require("express");
const {
    register,
    login,
    refreshAccessToken,
    protected,
    logout,
    updateProfile,
    getAllSeller
} = require("../../controllers/seller/sellerAuthController");
const { sellerAuthMiddleware } = require("../../Middleware/authMiddleware");
const { uploadImage } = require("../../Middleware/multerMiddleware");
const { forgotPassword, resetPassword } = require("../../controllers/seller/sellerAuthPass");
const router = express.Router();


router.post("/seller-register", register);
router.post("/seller-login", login);
router.post("/seller-refreshtoken" , refreshAccessToken);
router.post("/seller-logout" , sellerAuthMiddleware ,logout);
router.get("/seller-protected", sellerAuthMiddleware , protected);
router.put("/update-profile" , sellerAuthMiddleware , uploadImage , updateProfile);
router.get("/admin/seller" , getAllSeller);

router.post("/seller/forgot-password" , forgotPassword)
router.post("/seller/reset-password/:id/:token" , resetPassword)

module.exports = router;