const coupon = require("../../models/coupon");


exports.createCoupon = async (req , res) => {
    try {
        const { code , discount , type , minPurchase , maxDiscount , expiryDate} = req.body;

        const existingCoupon = await coupon.findOne({code})
        if(existingCoupon) {
            return res.status(400).json({ error: "Coupon code already exists" });
        }

        const newCoupon = new coupon({code , discount , type , minPurchase , maxDiscount , expiryDate});
        await newCoupon.save()

        res.status(201).json({message : "Coupon Created SuccessFully" , coupon : newCoupon});
    } catch (error) {
        res.status(500).json({error : 'Failed to create coupon'})
    }
}

exports.getCoupon = async (req , res) => {
    try {
        const coupons = await coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch coupons" });
    }
}

exports.applyCoupon = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { code, cartTotal } = req.body;
        const coupons = await coupon.findOne({ code, isActive: true });

        if (!coupons) {
            console.log("Coupon not found or inactive");
            return res.status(400).json({ error: 'Invalid or expired coupon' });
        }

        console.log("Coupon Expiry Date:", coupons.expiryDate);

        if (new Date() > new Date(coupons.expiryDate)) {
            return res.status(400).json({ error: "Coupon has expired" });
        }

        if (cartTotal < coupons.minPurchase) {
            return res.status(400).json({ error: `Minimum purchase of $${coupons.minPurchase} required` });
        }

        let discountAmount = 0;
        if (coupons.type === "percentage") {
            discountAmount = (cartTotal * coupons.discount) / 100;
            if (coupons.maxDiscount && discountAmount > coupons.maxDiscount) {
                discountAmount = coupons.maxDiscount;
            }
        } else {
            discountAmount = coupons.discount;
        }

        const finalAmount = cartTotal - discountAmount;

        res.status(200).json({ success: true, discountAmount, finalAmount });

    } catch (error) {
        console.error("Error applying coupon:", error);
        res.status(500).json({ error: "Failed to apply coupon" });
    }
};


exports.deleteCoupon = async (req , res) => {
    try {
        const {id} = req.params;
        await coupon.findByIdAndDelete(id);
        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete coupon" });
    }
}
