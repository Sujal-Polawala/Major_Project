const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Percentage or flat discount
    type: { type: String, enum: ["percentage", "flat"], required: true },
    minPurchase: { type: Number, default: 0 }, // Minimum cart value to apply
    maxDiscount: { type: Number, default: 0 }, // Max discount for percentage-based coupons
    expiryDate: { type: Date, required: true , index: { expires: 0 }},
    isActive: { type: Boolean, default: true }
}, {timestamps : true})

module.exports = mongoose.model("Coupon" , couponSchema);