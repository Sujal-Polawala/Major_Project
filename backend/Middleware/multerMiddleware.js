const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig')

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // Folder name in Cloudinary
        allowed_formats: ["jpg", "png", "webp", "gif"], // Allowed file formats
        transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional resizing
    },
})

const csvStorage = multer.memoryStorage();

// File filter to accept only images
const fileFilterImage = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype)  || extension === ".png" || extension === ".jpg" || extension === ".jpeg" || extension === ".webp") {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPG, PNG, WebP, GIF) and screenshots are allowed"), false);
    }
};

const fileFilterCsv = (req , file , cb) => {
    if(file.mimetype === "text/csv" ||  file.originalname.endsWith(".csv")){
        cb(null, true);
    }else{
        cb(new Error("Only CSV file are allowed"), false);
    }
};

// Multer configuration
const uploadImage = multer({
    storage: imageStorage,
    fileFilter: fileFilterImage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
}).single("image");

const uploadCsv = multer({
    storage : csvStorage,
    fileFilter: fileFilterCsv,
}).single("file");

module.exports = { uploadCsv , uploadImage };
