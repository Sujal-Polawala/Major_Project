import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, useMediaQuery, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import AnimateButton from "ui-component/extended/AnimateButton";
import AuthWrapper1 from "./AuthWrapper1";
import api from "utils/axiosintance";
import CustomSnackbar from "component/CustomSnackbar";

const ForgotPassword = () => {

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const validateForm = () => {
        let errors = {};
        if (!email) errors.email = "Email is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            const res = await api.post("/seller/forgot-password", {email});
            if(res.status === 200){
                localStorage.setItem("closeTabAfterReset", "true");
                setOpenSnackbar(true);
                setSnackbarMessage(res.data.message);
                setSnackbarSeverity('success')
                setEmail(" ")
            }
        } catch (error) {
            console.error("Error", error);
            setOpenSnackbar(true);
            setSnackbarMessage(error.response.data.message);
            setSnackbarSeverity('error')
        }finally {
            setLoading(false); // Ensure loading is reset
        }    
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <AuthWrapper1>
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%",maxWidth: "460px", textAlign: "center" }}>
                <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your email address below to receive a password reset link.
                </Typography>
                <form onSubmit={handleSubmit}>
                <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button fullWidth size="large" type="submit" variant="contained" color="secondary" onClick={handleSubmit}>
                                {loading ? <CircularProgress/> : "Send Reset Link" }
                            </Button>
                        </AnimateButton>
                </Box>
                </form>
                <Box mt={2}>
                <Typography variant="body2">
                    Remembered your password? {" "}
                    <Link to="/login" style={{ color: "#3f51b5", textDecoration: "none" }}>Login here</Link>
                </Typography>
                </Box>
            </Paper>
        </Container>
        <CustomSnackbar open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage}/>
        </AuthWrapper1>
    );
};

export default ForgotPassword;