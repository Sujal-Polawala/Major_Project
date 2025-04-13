import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper, useMediaQuery, CircularProgress ,Grid} from "@mui/material";
import { useNavigate, useParams} from "react-router-dom";
import { useTheme } from "@emotion/react";
import AnimateButton from "ui-component/extended/AnimateButton";
import AuthWrapper1 from "./AuthWrapper1";
import api from "utils/axiosintance";
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import CustomSnackbar from "component/CustomSnackbar";

const ResetPassword = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { id, token } = useParams();
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const validateForm = () => {
        let errors = {};
        if (!password) errors.password = "password is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            const res = await api.post(`/seller/reset-password/${id}/${token}`, {password});
            if(res.status === 200){
                localStorage.setItem("closeTabAfterReset", "true");
                setOpenSnackbar(true);
                setSnackbarMessage(res.data.message);
                setSnackbarSeverity('success')
                setPassword(" ")
                setTimeout(() => {
                    navigate('/login')
                },1500);
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

    const handleChange = (e) => {
        setPassword(e.target.value)
        const temp = strengthIndicator(e.target.value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    }
    return (
        <AuthWrapper1>
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%",maxWidth: "460px", textAlign: "center" }}>
                <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your new password to reset your account.
                </Typography>
                <form onSubmit={handleSubmit}>
                <TextField
                    label="Enter Your Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 2 }}
                />
                {strength !== 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                            </Typography>
                        </Grid>
                        </Grid>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button fullWidth size="large" type="submit" variant="contained" color="secondary" onClick={handleSubmit}>
                                {loading ? <CircularProgress/> : "Reset" }
                            </Button>
                        </AnimateButton>
                </Box>
                </form>
            </Paper>
        </Container>
        <CustomSnackbar open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage}/>
        </AuthWrapper1>
    );
};

export default ResetPassword;