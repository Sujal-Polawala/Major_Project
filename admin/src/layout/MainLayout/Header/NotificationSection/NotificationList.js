import React from "react";
import { useDispatch } from "react-redux";
import { markAsRead, deleteNotification } from "../../../../features/notificationSlice";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";

const ListItemWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: 16,
  "&:hover": {
    background: theme.palette.primary.light,
  },
}));

const NotificationList = ({ notifications, loading }) => {
  const dispatch = useDispatch();

  return (
    <List sx={{ width: "100%", maxWidth: 330, borderRadius: "10px" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography variant="subtitle2" align="center" sx={{ p: 2 }}>
          No new notifications
        </Typography>
      ) : (
        notifications.map((notification) => (
          <React.Fragment key={notification._id}>
            <ListItemWrapper>
              <ListItem alignItems="center">
                <ListItemAvatar>
                  <Avatar alt="User" />
                </ListItemAvatar>
                <ListItemText primary={notification.message} secondary={notification.type} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => dispatch(markAsRead(notification._id))}>
                    <CheckIcon color={notification.isRead ? "disabled" : "primary"} />
                  </IconButton>
                  <IconButton onClick={() => dispatch(deleteNotification(notification._id))}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </ListItemWrapper>
            <Divider />
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default NotificationList;
