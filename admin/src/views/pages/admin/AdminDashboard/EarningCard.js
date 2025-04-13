import PropTypes from 'prop-types';
import { useState } from 'react';

// Material-UI components
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// Project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// Assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import { gql, useQuery } from '@apollo/client';

// Styled Card Wrapper
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// GraphQL Query
const GET_ADMIN_DASHBOARD = gql`
  query getAdminDashboard {
    totalRevenue
    sellers {
      _id
      name
      totalSales
      orders {
        _id
        totalPrice
        createdAt
      }
    }
  }
`;

// ================== DASHBOARD - EARNING CARD ==================

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  // Separate states for both menus
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [sellerMenuAnchorEl, setSellerMenuAnchorEl] = useState(null);

  const { loading, error, data } = useQuery(GET_ADMIN_DASHBOARD, {
    fetchPolicy: 'no-cache'
  });

  // Open/Close Handlers for More Options Menu
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Open/Close Handlers for Seller Revenue Dropdown
  const handleSellerMenuOpen = (event) => {
    setSellerMenuAnchorEl(event.currentTarget);
  };
  const handleSellerMenuClose = () => {
    setSellerMenuAnchorEl(null);
  };

  if (loading) return <SkeletonEarningCard />;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary[200],
                        zIndex: 1
                      }}
                      aria-controls="menu-earning-card"
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                    {/* More Options Menu */}
                    <Menu
                      id="menu-earning-card"
                      anchorEl={menuAnchorEl}
                      keepMounted
                      open={Boolean(menuAnchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem onClick={handleMenuClose}>
                        <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>

              {/* Total Revenue Section */}
              <Grid item>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, color: theme.palette.primary[200] }}>
                  Total Revenue
                </Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: 'green' }}>
                  ${data?.totalRevenue?.toFixed(2)}
                </Typography>

                {/* Revenue by Seller Dropdown */}
                <Typography
                  onClick={handleSellerMenuOpen}
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: theme.palette.primary[300],
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  Revenue by Seller 
                </Typography>

                {/* Seller Revenue Dropdown Menu */}
                <Menu anchorEl={sellerMenuAnchorEl} open={Boolean(sellerMenuAnchorEl)} onClose={handleSellerMenuClose}>
                  {data?.sellers?.map((seller) => (
                    <MenuItem key={seller._id} onClick={handleSellerMenuClose}>
                      <Typography sx={{ fontSize: '1rem', flex: 1 }}>{seller?.name}</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
                        ${seller?.totalSales ? Number(seller.totalSales).toFixed(2) : '0.00'}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;

