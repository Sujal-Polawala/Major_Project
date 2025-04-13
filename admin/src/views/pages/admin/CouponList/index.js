import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, createCoupon, deleteCoupon } from "features/couponSlice";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Grid,
    IconButton,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    DialogActions,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    useMediaQuery
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import CustomSnackbar from "component/CustomSnackbar";

const initialCouponState = {
    code: "",
    discount: "",
    type: "percentage",
    minPurchase: "",
    maxDiscount: "",
    expiryDate: "",
};

const CouponManage = () => {
    const dispatch = useDispatch();
    const { coupons, loading } = useSelector((state) => state.coupon);
    const [openDialog, setOpenDialog] = useState(false);
    const [coupon, setCoupon] = useState(initialCouponState);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, couponId: null });


    const [formErrors, setFormErrors] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    const handleClose = () => {
        setOpenDialog(false);
        setFormErrors({});
        setCoupon(initialCouponState);
    };

    const validateForm = () => {
        const errors = {};
        if (!coupon.code.trim()) errors.code = "Coupon Code is required";
        if (!coupon.discount || isNaN(coupon.discount) || coupon.discount <= 0)
            errors.discount = "Valid Discount is required";
        if (
            !coupon.minPurchase ||
            isNaN(coupon.minPurchase) ||
            coupon.minPurchase < 0
        )
            errors.minPurchase = "Valid Min Purchase is required";
        if (!coupon.maxDiscount || isNaN(coupon.maxDiscount) || coupon.maxDiscount < 0)
            errors.maxDiscount = "Valid Max Discount is required";
        if (!coupon.expiryDate) errors.expiryDate = "Expiry Date is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (event) => {
        setCoupon((prev) => ({ ...prev, type: event.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await dispatch(createCoupon(coupon)).unwrap();
            setSnackbar({ open: true, message: "Coupon Created successfully" });
            handleClose();
        } catch (error) {
            
            console.error("Error saving coupon", error);
            let errorMessage = "Something went wrong";
            if (typeof error === "string") {
                errorMessage = error; // Direct string error
            } else if (error?.error) {
                errorMessage = error.error; // Your case: { error: 'Coupon code already exists' }
            } else if (error?.message) {
                errorMessage = error.message;
            }
    
            setSnackbar({ open: true, message: errorMessage, severity: "error" });
        }
    };

    const handleDelete = (id) => {
        setConfirmDialog({ open: true, couponId: id })
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteCoupon(confirmDialog.couponId)).unwrap();
            setSnackbar({ open: true, message: "Deleted successfully" });
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setConfirmDialog({ open: false, couponId: null });
    }

    return (
        <>
            <Box sx={{ maxWidth: "auto", mx: "auto", p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": { backgroundColor: "#444" },
                        }}
                        onClick={() => setOpenDialog(true)}
                        startIcon={<Add />}
                    >
                        Add Coupon
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : coupons.length === 0 ? (
                    <Typography textAlign="center" sx={{ mt: 2 }}>
                        No coupons available.
                    </Typography>
                ) : (
                    <List sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 2, p: 1 }}>
                        {coupons.map((coupon, index) => (
                            <ListItem key={coupon._id} divider>
                                <Grid container alignItems="center">
                                    <Grid item xs={1}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
                                            {index + 1}.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <ListItemText
                                            primary={`Code: ${coupon.code}`}
                                            secondary={`Discount: ${coupon.discount} ${coupon.type === "percentage" ? "%" : " (Flat)"} | Type : ${coupon.type} | Expiry: ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                        sx={{ display: "flex", justifyContent: "flex-end" }}
                                    >
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(coupon._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                )}

                <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth sx={{ width: isMobile ? "auto" : "450px", mx: "auto" }}>
                    <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}>Add Coupon</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Coupon Code"
                            name="code"
                            fullWidth
                            margin="dense"
                            value={coupon.code}
                            onChange={handleInputChange}
                            error={!!formErrors.code}
                            helperText={formErrors.code}
                        />
                        <TextField
                            label="Discount"
                            name="discount"
                            fullWidth
                            margin="dense"
                            value={coupon.discount}
                            onChange={handleInputChange}
                            error={!!formErrors.discount}
                            helperText={formErrors.discount}
                        />

                        <Select name="type" fullWidth value={coupon.type} onChange={handleSelectChange}>
                            <MenuItem value="percentage">Percentage</MenuItem>
                            <MenuItem value="flat">Fixed Amount</MenuItem>
                        </Select>

                        <TextField
                            label="Min Purchase"
                            name="minPurchase"
                            fullWidth
                            margin="dense"
                            value={coupon.minPurchase}
                            onChange={handleInputChange}
                            error={!!formErrors.minPurchase}
                            helperText={formErrors.minPurchase}
                        />
                        <TextField
                            label="Max Discount"
                            name="maxDiscount"
                            fullWidth
                            margin="dense"
                            value={coupon.maxDiscount}
                            onChange={handleInputChange}
                            error={!!formErrors.maxDiscount}
                            helperText={formErrors.maxDiscount}
                        />
                        <TextField
                            label="Expiry Date"
                            type="date"
                            name="expiryDate"
                            fullWidth
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            value={coupon.expiryDate || ""}
                            onChange={handleInputChange}
                            error={!!formErrors.expiryDate}
                            helperText={formErrors.expiryDate}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="error">
                            Close
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {loading ? <CircularProgress/> : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={confirmDialog.open}
                    onClose={() => setConfirmDialog({ open: false, couponId: null })}
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
                            onClick={() => setConfirmDialog({ open: false, couponId: null })}
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
            </Box>

            <CustomSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />

        </>
    );
};

export default CouponManage;
