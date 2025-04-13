import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';

import PerfectScrollbar from 'react-perfect-scrollbar';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { logoutSeller, resetAuthState } from 'features/authSlice';
import socket from 'socket';

const ProfileSection = () => {
  const theme = useTheme();
  const { loading, message } = useSelector((state) => state.auth);
  const seller = useSelector((state) => state.auth.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [greeting , setGreeting] = useState("");

  const anchorRef = useRef(null);
  const sellerRole = parseInt(localStorage.getItem('sellerRole'), 10); // Get sellerRole from localStorage
  const basePath = sellerRole === 0 ? '/admin' : '/seller';

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? 'Good Morning,' : 
      hour < 17 ? 'Good Afternoon,' :
      hour < 21 ? 'Good Evening,' : 'GoodNight',
    );
  },[]);

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity(message ? 'success' : 'error');
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(resetAuthState());
      }, 1500);
    }
  }, [message, dispatch]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    if (snackbarSeverity === 'success') {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  const handleLogout = async () => {

    if(socket){
        console.log("🚪 Logging out and disconnecting socket...");
        socket.emit("logout", seller._id);
        socket.disconnect(); 
    }

    dispatch(logoutSeller()).then(() => {
      localStorage.removeItem('sellerRole');
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);
    if (route) navigate(route);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': { stroke: theme.palette.primary.light },
          },
          '& .MuiChip-label': { lineHeight: 0 },
        }}
        icon={
          <Avatar
            src={`${seller.avatar}`}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          >{seller.avatar ? undefined : seller.userName.charAt(0).toUpperCase()}</Avatar>
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper placement="bottom-end" open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">{greeting}</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {seller.userName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Divider />
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 0 }}>
                      <List component="nav">
                        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, `${basePath}/account-setting`)}>
                          <ListItemIcon><IconSettings stroke={1.5} size="1.3rem" /></ListItemIcon>
                          <ListItemText primary="Account Settings" />
                        </ListItemButton>
                        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, `${basePath}/profile`)}>
                          <ListItemIcon><IconUser stroke={1.5} size="1.3rem" /></ListItemIcon>
                          <ListItemText primary="Social Profile" />
                        </ListItemButton>
                        <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
                          <ListItemIcon><IconLogout stroke={1.5} size="1.3rem" /></ListItemIcon>
                          <ListItemText primary={loading ? <CircularProgress size={20} /> : 'Logout'} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', background: 'white', color: 'black' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileSection;
