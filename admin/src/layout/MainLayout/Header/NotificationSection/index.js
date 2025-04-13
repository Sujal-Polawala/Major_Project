import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Badge
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getNotification, markAsAllRead } from 'features/notificationSlice';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const {notification , loading} = useSelector((state) => state.notification) 
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filtervalue, setFilterValue] = useState('all');
  const seller = useSelector((state) => state.auth.seller);
  const sellerId = seller?._id
  
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  useEffect(() => {
      if (sellerId) {
        dispatch(getNotification(sellerId));
      }
  }, [dispatch, sellerId]);

  const isRecent = (createdAt) => {
    const now = new Date();
    const notifDate = new Date(createdAt);
    const diffInHours = (now - notifDate) / (1000 * 60 * 60);
    return diffInHours <= 24; 
  }

  const filterNotification = notification.filter((notif) => {
    if(filtervalue === 'all') return true; 
    if(filtervalue === 'new') return !notif.isRead && isRecent(notif.createdAt);
    if(filtervalue === 'unread') return !notif.isRead;
    return false;
  })
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAsAllRead = () => {
    dispatch(markAsAllRead());
  } 
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge
            badgeContent={`${notification.length}`}
            color="error"
            overlap="circular"
            max={99}
            >
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            
              <IconBell stroke={1.5} size="1.3rem" />
            
          </Avatar>
        </ButtonBase>
        </Badge>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">All Notification</Typography>
                            <Chip
                              size="small"
                              label={`${notification.length}`}
                              sx={{
                                color: theme.palette.background.default,
                                bgcolor: theme.palette.warning.dark
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item>
                        <Typography 
                            component={Link} 
                            to="#" 
                            variant="subtitle2" 
                            color="primary" 
                            onClick={handleMarkAsAllRead} // Attach function here
                            style={{ cursor: "pointer", textDecoration: "none" , marginLeft: '6px' }} // Ensure it's clickable
                        >
                            Mark as all read
                        </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ px: 2, pt: 0.25 }}>
                              <TextField
                                id="outlined-select-currency-native"
                                select
                                fullWidth
                                value={filtervalue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                SelectProps={{
                                  native: true
                                }}
                              >
                                <option value="all">All Notifications</option>
                                <option value="new">New</option>
                                <option value="unread">Unread</option>
                              </TextField>
                            </Box>
                          </Grid>
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>
                        <NotificationList notifications={filterNotification} loading={loading}/>
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation>
                      View All
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
