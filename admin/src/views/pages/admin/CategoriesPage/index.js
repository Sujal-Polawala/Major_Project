import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategories, deleteCategories, fetchCategories, updateCategory } from 'features/categorySlice';
import { Box, List, ListItem, ListItemText, Grid , Typography, IconButton, Button, useTheme, useMediaQuery, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from "@mui/material";
import { Add, Delete, ModeEdit } from '@mui/icons-material';
import CustomSnackbar from 'component/CustomSnackbar';
import { useState } from 'react';

const initialCategoryState = {
    name : "",
    description : ""
}

const CategoriesList = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.data);  // Get categories from Redux store
    const [openDialog , setOpenDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [category , setNewCategory] = useState(initialCategoryState);
    const [formErrors , setFormErrors] = useState({});
    const [confirmDialog, setConfirmDialog] = useState({ open: false, categoryId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [isEditing , setIsEditing] = useState(false)
    const [editCategoryId , setEditCategoryId] = useState(null)
    
    useEffect(() => {
        dispatch(fetchCategories());  // Fetch categories on mount
    }, [dispatch]);

    const handleDelete = (id) => {
        setConfirmDialog({open : true, categoryId: id})
    };

    const handleEdit = (category) => {
        setEditCategoryId(category._id)
        setNewCategory({name : category.name, description: category.description});
        setIsEditing(true);
        setOpenDialog(true);
    }

    const confirmDelete = async () => {
        try {
            await dispatch(deleteCategories(confirmDialog.categoryId)).unwrap();
            setSnackbar({ open: true, message: "Deleted successfully" });
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setConfirmDialog({ open: false, categoryId: null });
    }

    const validateForm = () => {
        const errors = ["name", "description"].reduce((acc, field) => {
            if (!category[field] || !category[field].trim()) {  // Check if field exists before calling .trim()
                acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
            return acc;
        }, {});
    
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    
    const handleClose = () => {
        setOpenDialog(false)
        setFormErrors({})
    }
    const handleInputChange = (e) => {
        const { name , value } = e.target;
        setNewCategory((prev) => ({ ...prev , [name] : value.trimStart() }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        try {
            if(isEditing){
                await dispatch(updateCategory({id: editCategoryId , updateCategory: category})).unwrap()
                setSnackbar({ open: true, message: "Updated successfully", severity: "success" });
            }else{
                await dispatch(addCategories(category)).unwrap();
                setSnackbar({ open: true, message: "Added successfully" });
            }
        } catch (error) {
            setSnackbar({ open: true, message: "Category Already Exist", severity: "error" });

        }

        setOpenDialog(false);
        setNewCategory(initialCategoryState)
        setIsEditing(false)
        setEditCategoryId(null)
    }

    return (    
        <>
        <Box sx={{ maxWidth: "auto", mx: "auto", p: 2 }}>
            
            {/* Header with Add & Print Buttons */}
            <Box sx={{ display: 'flex', justifyContent:'flex-end', mb: 2 }}>
                {/* <IconButton sx={{ color: '#333', '&:hover': { color: '#444' } }} onClick={() => console.log("Print Categories")}>
                    <Print />
                </IconButton> */}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#444' } }}
                    onClick={() => {
                        setOpenDialog(true);
                        setNewCategory(initialCategoryState);// Reset category state
                        setIsEditing(false); // Ensure it's not in edit mode
                        setEditCategoryId(null);
                    }}
                >
                    <Add /> {isMobile ? '' : 'Add Category'}
                </Button>
            </Box>

            {/* Categories List */}
            <List sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 2, p: 1 }}>
        {categories.length > 0 ? (
            categories.map((category, index) => (
                <ListItem key={category._id} divider>
                    {/* Grid for better alignment */}
                    <Grid container alignItems="center">
                        
                        {/* Index Number */}
                        <Grid item xs={1}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                                {index + 1}.
                            </Typography>
                        </Grid>

                        {/* Category Name & Description */}
                        <Grid item xs={8}>
                            <ListItemText
                                primary={category.name}
                                secondary={`Description: ${category.description}`}
                            />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <IconButton edge="end" color="success" onClick={() => handleEdit(category)}>
                            <ModeEdit />
                        </IconButton>
                        <IconButton edge="end" color="error" onClick={() => handleDelete(category._id)}>
                            <Delete />
                        </IconButton>
                    </Grid>

                    </Grid>
                </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText primary="No categories available" />
                </ListItem>
            )}
        </List>
        
        </Box>
        <Dialog open={openDialog} onClose={handleClose}  maxWidth="sm" fullWidth sx={{ width: isMobile ? "auto":"450px", mx: "auto" }}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}>
            {isEditing ? "Edit Category" : "Add Category"}
        </DialogTitle>

            <DialogContent dividers>
                <Box sx={{display: "grid" , gap : 1.5}}>
                    <TextField label="name" name='name' value={category.name} onChange={handleInputChange} error={!!formErrors.name} helperText={formErrors.name}></TextField>
                    <TextField label="description" name='description' value={category.description} onChange={handleInputChange} error={!!formErrors.description} helperText={formErrors.description}></TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">  close </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">  {isEditing ? "Update" : "Add"} </Button>
            </DialogActions>
        </Dialog>

        <Dialog
                        open={confirmDialog.open}
                        onClose={() => setConfirmDialog({ open: false, categoryId: null })}
                        maxWidth="xs" // Set a smaller fixed width for the dialog
                        fullWidth // Ensure the dialog takes up the full width of its container
                        
                    >
                        {/* Dialog Title */}
                        <DialogTitle
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.25rem",
                                backgroundColor: "#f5f5f5",
                                py: 2,
                                borderBottom: "1px solid #e0e0e0",
                            }}
                        >
                            Confirm Deletion
                        </DialogTitle>
        
                        {/* Dialog Content */}
                        <DialogContent sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1">
                                Are you sure you want to delete this Category?
                            </Typography>
                        </DialogContent>
        
                        {/* Dialog Actions */}
                        <DialogActions
                            sx={{
                                justifyContent: "center",
                                p: 2,
                                backgroundColor: "#f5f5f5",
                                borderTop: "1px solid #e0e0e0",
                            }}
                        >
                            {/* Cancel Button */}
                            <Button
                                onClick={() => setConfirmDialog({ open: false, categoryId: null })}
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderColor: "#1976d2",
                                    color: "#1976d2",
                                    "&:hover": {
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                        borderColor: "#1976d2",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
        
                            {/* Delete Button */}
                            <Button
                                onClick={confirmDelete}
                                variant="contained"
                                color="error"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    backgroundColor: "#d32f2f",
                                    "&:hover": {
                                        backgroundColor: "#b71c1c",
                                    },
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

        <CustomSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}/>
        </>
    );
};

export default CategoriesList;
