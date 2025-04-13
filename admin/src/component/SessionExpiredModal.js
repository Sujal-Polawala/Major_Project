import React from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { resetSessionExpired, logoutSeller } from "../features/authSlice";

const SessionExpiredModal = ({ open }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(resetSessionExpired()); // Reset sessionExpired state
    };

    const handleRedirectToLogin = () => {
        dispatch(logoutSeller()); // Logout the user
        dispatch(resetSessionExpired()); // Reset sessionExpired state
        navigate("/login");
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogContent>Your session has expired. Please log in again.</DialogContent>
            <DialogActions>
                <Button onClick={handleRedirectToLogin} color="primary" variant="contained">
                    Go to Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionExpiredModal;
