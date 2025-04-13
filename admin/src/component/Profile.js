import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { Card, CardContent, CardMedia, Avatar, Typography, Box, Button, Grid, IconButton } from "@mui/material";
import { Edit, Email, Storefront, LinkedIn, Twitter, Instagram } from "@mui/icons-material";
import { useSelector } from "react-redux";
import sellerImage from '../assets/images/seller.webp'
import adminImage from '../assets/images/admin.webp'

const SellerProfile = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const seller = useSelector((state) => state.auth.seller);
    const sellerRole = localStorage.getItem("sellerRole");

    const role = sellerRole === "0" ? "admin": "seller";

    return (
        <Box 
            sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh", 
                px: 2, 
                
            }}
        >
            <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 3, boxShadow: 3, backgroundColor: "white" }}>
                {/* Cover Image */}
                <CardMedia
                component="img"
                height="250"
                src = {seller.role === "0" ? adminImage : sellerImage} 
                alt="Store Cover"
                 // Set fallback image
            />


                {/* Avatar & Profile Details */}
                <CardContent sx={{ textAlign: "center", position: "relative", mt: -15 }}>
                    <Avatar
                        src={`${seller.avatar}`}
                        sx={{
                            width: 100,
                            height: 100,
                            border: "4px solid white",
                            mx: "auto",
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                        {seller.name} Store
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {sellerRole=== "0" ? '':'Premium Fashion Seller'}
                    </Typography>

                    {/* Store Details */}
                    <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <Storefront fontSize="small" sx={{ color: "gray", mr: 0.5 }} />
                            <Typography variant="body2">{seller.userName}</Typography>
                        </Grid>

                        {/* <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <Phone fontSize="small" sx={{ color: "gray", mr: 0.5 }} />
                            <Typography variant="body2">+1 234 567 890</Typography>
                        </Grid> */}

                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <Email fontSize="small" sx={{ color: "gray", mr: 0.5 }} />
                            <Typography variant="body2">{seller.email}</Typography>
                        </Grid>

                        {/* <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOn fontSize="small" sx={{ color: "gray", mr: 0.5 }} />
                            <Typography variant="body2">New York, USA</Typography>
                        </Grid> */}
                    </Grid>

                    {/* Store Description */}
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2, px: 2 }}>
                        {sellerRole=== "0" ? '':' We are a leading online marketplace offering a wide range of electronics, fashion, and accessories. Trusted by millions worldwide'}
                    </Typography>

                    {/* Social Media Links */}
                    <Box sx={{ mt: 2 }}>
                        <IconButton color="primary">
                            <LinkedIn />
                        </IconButton>
                        <IconButton color="secondary">
                            <Twitter />
                        </IconButton>
                        <IconButton sx={{ color: "#E1306C" }}>
                            <Instagram />
                        </IconButton>
                    </Box>

                    {/* Action Buttons with Navigation */}
                    <Box sx={{ mt: 2 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ mr: 1 }} 
                            onClick={() => navigate(`/${role}/dashboard`)} // Navigate to Seller Dashboard
                        >
                            Manage Store
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<Edit />} 
                            onClick={() => navigate(`/${role}/account-setting`)} // Navigate to Edit Profile
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SellerProfile;
