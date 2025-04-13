// /controllers/productController.js

const Product = require("../../models/productModel");
const productsData = require("../../data/productsData"); // Importing the sample product data
const mongoose = require("mongoose");
const Category = require("../../models/category");
const Seller = require("../../models/seller");
const csvtojson = require("csvtojson");
const { spawn } = require("child_process");
// const { uploadBase64ToCloudinary } = require("../../utils/cloudinary");

const addProduct = async (req, res) => {
  try {
    const { title, description, category, price, quantity, sellerId, badge } =
      req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required!" });
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({ message: "Product Already Exist" });
    }

    // Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const imageUrl = req.file.path;

    const pythonProcess = spawn("python", ["./ml_model/extract_features.py", imageUrl]);
    // Find the last product to get the highest id
    const lastProduct = await Product.findOne().sort({ id: -1 });
    let resultData = "";
        pythonProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on("close", async (code) => {
          if (code !== 0) {
              return res.status(500).json({ error: "Feature extraction failed" });
          }
          try {
            const vector = JSON.parse(resultData);
    // Create new product
    const newProduct = new Product({
      id: lastProduct ? lastProduct.id + 1 : 1, // Generate a unique id if the last product doesn't exist
      title,
      price,
      description,
      category,
      image: imageUrl,
      quantity,
      badge,
      sellerId,
      vector // Save image URL
    });

    await newProduct.save();

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { $push: { Products: newProduct._id } }, // Push new product ID into seller's products array
      { new: true } // Return updated document
    );

    if (!updatedSeller) {
      return res.status(404).send({ message: "Seller not found" });
    }

    return res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  }catch (error) {
        res.status(500).json({ error: "Failed to process product data" });
    }
});
  }  catch (error) {
    console.error("Error adding product:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error" });
    }
  }
};

const uploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const csvBuffer = req.file.buffer.toString("utf-8");
    const productData = await csvtojson().fromString(csvBuffer);

    let products = [];

    for (const row of productData) {
      try {
        let imageUrl = row.imageUrl;

        // <<<<<<< feature-branch-7
        //         // if (isBase64Image(row.imageUrl)) {
        //         //   // Upload Base64 image to Cloudinary
        //         //   const uploadResult = await uploadBase64ToCloudinary(row.imageUrl);
        //         //   imageUrl = uploadResult.secure_url;
        //         // }

        // =======
        // >>>>>>> main
        const product = new Product({
          sellerId: req.seller._id,
          title: row.name,
          description: row.description,
          price: parseFloat(row.price),
          category: row.category,
          quantity: parseInt(row.quantity),
          image: imageUrl || null,
          badge: row.badge,
        });

        products.push(product);
      } catch (error) {
        console.error("Error processing row:", error);
      }
    }

    // Insert products into the database
    const insertedProducts = await Product.insertMany(products);
    const insertedProductIds = insertedProducts.map((product) => product._id);

    // Update seller's product list
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { $push: { products: { $each: insertedProductIds } } },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res
      .status(201)
      .json({
        message: "Products uploaded successfully",
        product: insertedProducts,
      });
  } catch (error) {
    console.error("CSV Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Product by Id

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = { ...req.body };

    // Prevent sellerId from being updated
    if (updatedData.sellerId) {
      delete updatedData.sellerId;
    }

    // If a new image is uploaded, update the image field
    if (req.file) {
      updatedData.image = req.file.path;
    }

    // Fetch the existing product details
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If title is being updated, check for duplicates excluding the current product
    if (updatedData.title && updatedData.title !== existingProduct.title) {
      const duplicateProduct = await Product.findOne({
        title: updatedData.title,
        _id: { $ne: productId }, // Exclude the current product
      });

      if (duplicateProduct) {
        return res
          .status(400)
          .json({ message: "Product with this title already exists" });
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating product", details: error.message });
  }
};

// Delete Product by Id

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get All Products

// Function to insert multiple products
const insertProducts = async (req, res) => {
  try {
    await Product.insertMany(productsData); // Insert the sample data
    res.status(200).json({ message: "Products inserted successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error inserting products", error: err.message });
  }
};

// Fetch all products
const getAllProduct = async (req, res) => {
  const { category } = req.params;

  try {
    // Fetch products based on the category
    const products = await Product.find({ category: category });

    // Return the products as a response
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const recommendationProduct = async (req, res) => {
  try {
    const { productId, category } = req.query; // ✅ Read from query params

    if (!productId || !category) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    const recommendedProducts = await Product.find({
      category: category,
      _id: { $ne: productId } // Exclude the selected product
    }).limit(5);

    res.json({ success: true, recommendedProducts });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { sellerId, badge, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (sellerId) query.sellerId = sellerId;
    if (badge) query.badge = badge;
    if (category) query.category = category;
    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const products = await Product.find(query).populate("sellerId", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the URL
    console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID format");
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await Product.findOne({ _id: id }); // Query using ObjectId
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: "Product not found." });
    }

    console.log("Product fetched:", product);
    res.status(200).json(product); // Return the product in JSON format
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Export functions
module.exports = {
  insertProducts,
  uploadProducts,
  getAllProduct,
  getAllProducts,
  fetchProductById,
  getFilters,
  recommendationProduct,
  addProduct,
  updateProductById,
  deleteProductById
};
