import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar, Badge, Button , useMediaQuery , useTheme,Switch} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellers, updateSellerStatus } from "features/sellerSlice";
import SellerRequestDialog from "../../../../component/SellerRequestDialog";
import CustomSnackbar from "component/CustomSnackbar";

const SellerList = () => {
    const dispatch = useDispatch();
    const { sellers, loading } = useSelector((state) => state.seller);
    const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Get pending request count
    const pendingCount = sellers.filter((seller) => seller.status === "pending").length;

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar , setOpenSnackbar] = useState(false);
    const [snackbarMessage , setSnackbarMessage] = useState('');
    const [snackbarSeverity , setSnackbarSeverity] = useState('success');
    
    useEffect(() => {
        dispatch(fetchSellers());
    }, [dispatch]);

    const handleStatusChange = (seller) => {
        const newAction = seller.status === "approved" ? "reject" : "approve";
        if(seller.status === "approved"){
            setOpenSnackbar(true);
            setSnackbarMessage(`Seller ${seller.status === "rejected" ? "approved" : "rejected"} successfully`);
            setSnackbarSeverity('success');
        }else{
            setOpenSnackbar(true);
            setSnackbarMessage(`Seller ${seller.status === "approved" ? "rejected" : "approved"} successfully`);
            setSnackbarSeverity('success');
        }
        dispatch(updateSellerStatus({ sellerId: seller._id, action: newAction }));
    };
    
    const handleCloseSnackbar= () => {
        setOpenSnackbar(false);
    }

    const columns = [
        { field: "index", headerName: "No", width: 70, renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 },
        {
            field: "avatar",
            headerName: "Avatar",
            width: 80,
            renderCell: (params) => (
                <Avatar sx={{ width: 35, height: 35 , mt : 1 }}>
                    {params.row.avatar ? (
                        <img
                            src={`${params.row.avatar}`}
                            alt="Avatar"
                            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                        />
                    ) : (
                        params.row.name.charAt(0).toUpperCase()
                    )}
                </Avatar>
            ),
        },
        // { field: "userName", headerName: "Name", width: 150 },
        { field: "name" , headerName : "Name" , width : 200},
        { field: "email", headerName: "Email", width: 200 },
        { field: "status", headerName: "Status", width: 120 },
        {
            field: "actions",
            headerName: "Actions",
            width: 180,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <Switch
                checked={params.row.status === "approved"}
                onChange={() => handleStatusChange(params.row)}
                sx={{
                    "& .MuiSwitch-thumb": {
                        backgroundColor: params.row.status === "approved" ? "green" : "red",
                    },
                    "& .MuiSwitch-track": {
                        backgroundColor: params.row.status === "approved" ? "lightgreen" : "pink",
                    },
                }}
            />

                </Box>
            ),
        },
    ];

    return (
        
        <Box sx={{ height: 400, width: "100%" }}>
            {/* Pending Request Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" , mb: 2 }}>
                <Button
                    variant="contained"
                    sx={{ background: "#333", color: "white", "&:hover": { background: "#444" } }}
                    onClick={() => setOpenDialog(true)}
                >
                    <Badge badgeContent={pendingCount} color="error" sx={{mr:1}}>
                            <Notifications />
                        </Badge> {isMobile ? ' ' : "Pending Requests"}
                </Button>
            </Box>

            {/* Seller Data Table */}
            <DataGrid
                rows={sellers.filter((seller) => seller.status === "approved" || seller.status === "rejected").map((seller) => ({ ...seller, id: seller._id }))}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row._id}
                loading={loading}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "white", // Dark background color
                        color: "black", // White text for contrast
                    },
                    "& .MuiDataGrid-virtualScroller": {
                         // Light background for rows
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: "white", // Dark footer
                        color: "white", // White text for footer
                    },
                }}
            />

            {/* Seller Request Dialog */}
            <SellerRequestDialog open={openDialog} onClose={() => setOpenDialog(false)} />
                <CustomSnackbar open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage} />
        </Box>
    );
};

export default SellerList;
