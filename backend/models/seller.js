const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the User schema
const SellerSchema = new mongoose.Schema({
    sellerId: { type: String },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {type : String , required: true},
    refreshToken : {type : String, default: undefined},
    avatar : { type: String , default : ""},
    products:[{type : mongoose.Schema.Types.ObjectId, ref : "Product" }],
    orders:[{type : mongoose.Schema.Types.ObjectId, ref: "Order"}],
    status: {type : String , enum : ["pending" , "approved" , "rejected"], default: "pending"},
    role:{type: String, default: 1},
    createdAt: { type: Date, default: Date.now },
});

SellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

SellerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

SellerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, userName: this.userName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

SellerSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

SellerSchema.index({ userName: 1 }, { unique: true });
SellerSchema.index({ email: 1 }, { unique: true });

const Seller = mongoose.model("Seller", SellerSchema, "Seller");

module.exports = Seller;
