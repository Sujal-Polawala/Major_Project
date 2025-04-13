const express = require('express');
const {addCategory, deleteCategory, getCategories , updateCategory} = require('../../controllers/category/categoryController');

const router = express.Router();

// Add a New Category
router.post('/api/categories', addCategory);

// Delete a Category
router.delete('/api/categories/:id', deleteCategory);

// Update a Category
router.put('/api/categories/:id', updateCategory);

// Get All Categories
 router.get('/api/category', getCategories);

module.exports = router;