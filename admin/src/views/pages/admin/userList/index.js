import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Switch, Avatar } from "@mui/material";
// import { Block, CheckCircle } from "@mui/icons-material";
import api from "utils/axiosintance";
import CustomSnackbar from "component/CustomSnackbar";

const UserList = () => {
    const [users, setUsers] = useState([]);  // ✅ Fixed: Initialize as an array
    const [openSnackbar , setOpenSnackbar] = useState(false);
    const [snackbarMessage , setSnackbarMessage] = useState('');
    const [snackbarSeverity , setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/admin/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleBlockUnblock =async (userId , isActive) => {
        try {
            await api.put(`/admin/users/${userId}/status`, {isActive : !isActive});
            setUsers(users.map(user => (user._id === userId ? {...user , isActive : !isActive} : user)))
            
            setOpenSnackbar(true);
            setSnackbarMessage(`User ${isActive ? "blocked" : "activated"} successfully`);
            setSnackbarSeverity('success');
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMessage("Failed to update user status");
            setSnackbarSeverity("error");
        }
    };

    const handleCloseSnackbar= () => {
        setOpenSnackbar(false);
    }
    const columns = [
        { 
            field: "index", 
            headerName: "No", 
            width: 70, 
            renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 
        },
        {
            field: "avatar",
            headerName: "Avatar",
            width: 80,
            renderCell: (params) => (
                <Avatar sx={{ width: 35, height: 35 , mt :1 , color: 'white' , backgroundColor: '#33006F' , }}>
                    {params.row.username ? params.row.username.charAt(0).toUpperCase() : "U"}
                </Avatar>
            ),
        },
        { field: "username", headerName: "Name", width: 200 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "isActive", headerName: "Status", width: 120 ,
            renderCell : (params) => {
                return <Box>{params.row.isActive ? "Active" : "Block"}</Box>
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Box display="flex" 
                alignItems="center" gap={1}>
                                    <Switch
                                checked={params.row.isActive}
                                onChange={() => handleBlockUnblock(params.row._id , params.row.isActive)}
                                sx={{
                                    "& .MuiSwitch-thumb": {
                                        backgroundColor: params.row.isActive ? "green" : "red",
                                    },
                                    "& .MuiSwitch-track": {
                                        backgroundColor: params.row.isActive ? "lightgreen" : "pink",
                                    },
                                }}
                            />
                </Box>
            ),
        },
    ];

    return (
        <>
        <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={users.map((user) => ({ ...user, id: user._id }))}  // ✅ Fixed: Correct ID mapping
                columns={columns}
                getRowId={(row) => row._id}
                
                pageSize={5}
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
        </Box>
        <CustomSnackbar open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage} />
        </>
    );
};

export default UserList;
