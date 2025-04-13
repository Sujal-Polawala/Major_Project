const jwt = require("jsonwebtoken");
const Seller = require("../models/seller");


exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.sellerAuthMiddleware = async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;

      if(!authHeader ||  !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Access token missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token , "my-ecommerce-access");

      const seller = await Seller.findById(decoded._id).select(" -password -refreshToken ");
      if(!seller){
        return res.status(401).json({message : 'Seller not found'});
      }
      
      req.seller = seller;
      next();
  } catch (error) {
      return res.status(403).json({ message: "Unauthorized request", error: error.message });
  }
};


