const express = require('express');
const couponController = require('../../controllers/coupon/couponController');

const router = express.Router();

// Create a new coupon
router.post("/create-coupon", couponController.createCoupon);

// Get all coupons
router.get("/get-coupons", couponController.getCoupon);

// Apply a coupon (use PUT for updating)
router.post("/apply-coupon", couponController.applyCoupon);

// Delete a coupon by ID
router.delete("/delete-coupon/:id", couponController.deleteCoupon);

module.exports = router;
