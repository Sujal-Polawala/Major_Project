import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Divider, Box, Typography, IconButton, Avatar, ListItemAvatar, useMediaQuery, useTheme, TableRow } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, Block } from "@mui/icons-material";
import { updateSellerStatus } from "features/sellerSlice";
import { selectPendingRequests } from "selectors/sellerSelectors";

const SellerRequestDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Filter only pending requests
    const pendingRequests = useSelector(selectPendingRequests)

    const handleAction = (sellerId, action) => {
        dispatch(updateSellerStatus({ sellerId, action }));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth sx={{ width: isMobile ? "400px" : "auto" , mx: isMobile ?"auto" : "400px"}}>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: '15px' }}>Pending Seller Requests</DialogTitle>
            <Divider />
            <DialogContent sx={{ mt: -3 }}>
                {pendingRequests.length > 0 ? (
                    <List>
                        {pendingRequests.map((seller) => (
                            <React.Fragment key={seller._id}>
                                <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" , ml : -2 }}>
                                    <ListItemAvatar>
                                        <Avatar>{seller.userName.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <TableRow>
                                    <ListItemText
                                        primary={seller.userName}
                                        secondary={
                                            <Typography variant="body2" color="textSecondary">
                                                {seller.email}
                                            </Typography>
                                        }
                                    /></TableRow>
                                    
                                    <Box sx={{ display: "flex", flexDirection: isMobile ? "row" : "row" }}>
                                        <IconButton onClick={() => handleAction(seller._id, "approve")} color="success" sx={{ marginRight: 0 }}>
                                            <CheckCircle />
                                        </IconButton>
                                        <IconButton onClick={() => handleAction(seller._id, "reject")} color="error">
                                            <Block />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ textAlign: "center", padding: 2 }}>
                        <Typography variant="body1" color="textSecondary">No pending requests</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SellerRequestDialog;
