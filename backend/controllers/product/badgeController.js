const Product = require('../../models/productModel');

const getBadges = async (req, res) => {
    try {
        const badges = await Product.distinct('badge');
        res.json(badges);
    } catch (error) {
        console.error("Error fetching badges:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports =
{
    getBadges
}
    