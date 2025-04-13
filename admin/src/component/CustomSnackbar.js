import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%", background: "white", color: "black" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
