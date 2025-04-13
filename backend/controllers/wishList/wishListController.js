const WishList = require('../../models/wishList')

exports.addWishlist = async (req , res) => {
    try {
        const { productId , userId } = req.body;

        let wishlist = await WishList.findOne({userId});

        if(!wishlist){
            wishlist = new WishList({ userId , products : []})
        }

        const productExists = wishlist.products.some(
            (item) => item.productId.toString() === productId
        )

        if(!productExists){
            wishlist.products.push({ productId , addedAt : new Date()})
            await wishlist.save()
        }

        res.json({success : true , wishlist});
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
}

exports.getWishList = async (req, res) => {
    const { userId } = req.params;

    try {
        console.log("Fetching wishlist for userId:", userId);
        
        const wishList = await WishList.findOne({ userId }).populate({
            path: 'products.productId',
            model: 'Product' // Ensure correct reference to Product model
        });

        if (!wishList) {
            return res.json({ wishlist: [] });
        }

        res.json({ wishlist: wishList.products.map(item => item.productId) }); 
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.removeWishList = async (req , res) => {
    try {
        const { productId , userId } = req.body;

        let wishlist = await WishList.findOne({userId})

        if(!wishlist){
            return res.status(400).json({ error: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (item) => item.productId.toString() !== productId
        );

        await wishlist.save()

        res.json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}