const { spawn } = require("child_process");
const Product = require("../../models/productModel");


const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        throw new Error("Vectors must be of the same length");
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]; // Dot product of two vectors
      normA += vecA[i] * vecA[i]; // Squared sum of vecA
      normB += vecB[i] * vecB[i]; // Squared sum of vecB
    }
    normA = Math.sqrt(normA); // Magnitude of vecA
    normB = Math.sqrt(normB); // Magnitude of vecB
    if (normA === 0 || normB === 0) return 0; // Avoid division by zero
    return dotProduct / (normA * normB); // Cosine similarity
};

const searchByImage = async (req, res) => {
    try {
    imageUrl = req.file.path // Now getting URL from Cloudinary

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    // Extract features using Python
    const pythonProcess = spawn("python", ["./ml_model/extract_features.py", imageUrl]);

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
        const searchVector = JSON.parse(resultData);
        // Find similar products using vector search
        const products = await Product.find({ vector: { $exists: true, $ne: null } });

        if (products.length === 0) {
          return res.json([]); // No products with vectors found
        }
        
        // Compute similarity for only valid products
        const results = products.filter(product => Array.isArray(product.vector) && product.vector.length === searchVector.length).map(product => {
            const similarity = cosineSimilarity(searchVector, product.vector);
            return { ...product._doc, similarity };
        });

        // Sort results by similarity
        results.sort((a, b) => b.similarity - a.similarity);

        res.json(results.slice(0, 2)); // Return top 10 results
        } catch (error) {
        console.error("Vector Processing Error:", error);
        res.status(500).json({ error: "Search failed" });
    }
    });

    } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = {
    searchByImage
}