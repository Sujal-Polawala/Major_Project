const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    icons: {
        type: Boolean,
    }
});

const Category = mongoose.model("Category", CategorySchema, "Category");

module.exports = Category;