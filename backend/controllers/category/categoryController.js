const Category = require("../../models/category");
const mongoose = require("mongoose");

// Add a new category

exports.addCategory = async (req, res) => {
  try {
    const { name, description, icons } = req.body;
    const newCategory = new Category({ name, description, icons });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: "Failed to add category" });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icons } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No category with that ID");

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, icons },
      { new: true ,  runValidators: true }
    );

    if (!updatedCategory) return res.status(404).send("No category found");

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: "Failed to update category" });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to get categories" });
  }
};