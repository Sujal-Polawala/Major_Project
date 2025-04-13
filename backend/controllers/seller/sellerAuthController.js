const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Seller = require("../../models/seller");
const fs = require('fs');
const path = require('path');
const cloudinary = require('../../config/cloudinaryConfig')
const validator = require("validator");
const { createNotification } = require("../notifications/notificationController");
require("dotenv").config();
const algorithm = "aes-256-cbc";
const secretKeyHex = process.env.REFRESH_ENCRYPTION_KEY;

// Ensure key is exactly 32 bytes
if (!secretKeyHex || secretKeyHex.length !== 64) {
    throw new Error("Invalid REFRESH_ENCRYPTION_KEY. It must be 64 hex characters (32 bytes).");
}

const secretKey = Buffer.from(secretKeyHex, "hex");

// Encrypt Refresh Token
const encryptToken = (token) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

// Decrypt Refresh Token
const decryptToken = (encryptedToken) => {
    try {
        const [ivHex, encryptedData] = encryptedToken.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("Error decrypting token:", error.message);
        throw new Error("Invalid token");
    }
};


exports.register = async (req, res) => {
    const { userName, email, name, password } = req.body;
    try {
        if (!userName || !email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existingSeller = await Seller.findOne({ $or: [{ userName }, { email }] });
        if (existingSeller) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const newSeller = new Seller({ userName, email, name, password });
        const savedSeller = await newSeller.save();
        savedSeller.sellerId = savedSeller._id.toString();
        await savedSeller.save();

        const io = global.io;
        const admins = await Seller.find({ role: "0" });

        if (admins.length > 0) {
            const message = `New Seller ${newSeller.name} registered`;

            admins.forEach(admin => {
                io.emit("receiveNotification", { receiverId: admin._id.toString(), message, type: "new_seller" });
            });

            await Promise.all(admins.map(admin => 
                createNotification({ receiverId: admin._id.toString(), message, type: "new_seller" })
            ));
        }

        res.status(201).json({ message: "Seller registered successfully. Awaiting admin approval.", email: savedSeller.email });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const generateAccessAndRefreshToken = async (sellerId) => {
    try {
        const seller = await Seller.findById(sellerId);

        if(!seller){
            throw new Error("Seller not found");
        }

        const accessToken = seller.generateAccessToken();
        const refreshToken = seller.generateRefreshToken();
        
        const encryptedRefreshToken = encryptToken(refreshToken);
        seller.refreshToken = encryptedRefreshToken;
        await seller.save({ validateBeforeSave: false });


        return { accessToken , refreshToken : encryptedRefreshToken};
    } catch (error) {
        console.error("Error generating tokens:" , error.message);
        throw new Error ("failed to generate tokens");
    }
};

exports.login = async (req , res) => {
    try {
        const { userName , password} = req.body;
        if ( ! userName && !password) {
            return res.status(400).json({ message : "userName And Password are required"});
        }
        
        const sellers = await Seller.findOne({
            userName
        });

        if(!sellers){
            return res.status(404).json({message: "Invalid Username or email"});
        }

        if (sellers.status !== "approved") {
            return res.status(404).json({ message: "Your request is still pending approval or has been rejected." });
        }

        const isPasswordValid = await sellers.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Invalid Password" });
        }

        const {accessToken , refreshToken} = await generateAccessAndRefreshToken(sellers._id);

        const seller = await Seller.findById(sellers._id).select( "-password -refreshToken");
        return res.status(200)
        .json({
            message : "Login SuccessFully",
            seller : seller,
            accessToken,
            refreshToken,
            Login : true,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.refreshAccessToken = async (req, res) => {
    try {
        const encryptedRefreshToken = req.body.refreshToken;
        if (!encryptedRefreshToken) {
            return res.status(401).json({ message: "Unauthorized request, refresh token missing" });
        }

        const refreshToken = decryptToken(encryptedRefreshToken);
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const seller = await Seller.findById(decodedToken._id);

        if (!seller || encryptedRefreshToken !== seller.refreshToken) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const accessToken = jwt.sign({ _id: seller._id, email: seller.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        return res.status(200).json({ message: "Access Token refreshed", accessToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(401).json({ message: "Token refresh failed. Please log in again." });
    }
};


exports.logout = async (req, res) => {
    try {
        await Seller.findByIdAndUpdate(req.seller._id, { $unset: { refreshToken: "" } });

        return res
            .status(200)
            .json({ message: "Seller Logged Out" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.protected = async (req, res) => {
    res.status(200).json({
        message: "You have access",
        seller: req.seller, // This should now contain the user details
    });
};

exports.updateProfile = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        const { userName, email, password, newPassword } = req.body;
        let avatar = req.file?.path;

        let seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Handling avatar update if new avatar file is provided
        if (avatar) {
            // Delete old avatar if it exists
            if (seller.avatar) {
                const oldPublicId = seller.avatar.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`avatars/${oldPublicId}`);
            }

            const uploadResult = await cloudinary.uploader.upload(avatar, {
                folder: "avatars",
                transformation: [{ width: 300, height: 300, crop: "fill" }],
            });

            avatar = uploadResult.secure_url;
            seller.avatar = avatar; // Update avatar field
        }

        // Fix: Use Seller.findOne() instead of seller.findOne()
        if (userName && userName !== seller.userName) {
            const existingSeller = await Seller.findOne({ userName });
            if (existingSeller) {
                return res.status(400).json({ message: "UserName already in use" });
            }
            seller.userName = userName;
        }

        // Fix: Use Seller.findOne() instead of seller.findOne()
        if (email && email !== seller.email) {
            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return res.status(400).json({ message: "Email already in use" });
            }
            seller.email = email;
        }

        // Handle password change if both password and newPassword are provided
        if (password && newPassword) {
            const isPasswordValid = await seller.isPasswordCorrect(password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            seller.password = newPassword; // Ensure this is hashed before saving
        }

        // Save the updated seller document
        await seller.save();

        // Return updated seller info in the response
        res.status(200).json({
            message: "Profile updated successfully",
            seller: {
                _id: seller._id,
                userName: seller.userName,
                email: seller.email,
                avatar: seller.avatar,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllSeller = async (req , res) => {
    try {
        const seller = await Seller.find({role : 1} , {password: 0});
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Seller" });
    }
}