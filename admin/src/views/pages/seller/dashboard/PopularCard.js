import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
// import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
// import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { useSellerDashboard } from 'services/sellerDashBoardServices';
import { useSelector } from 'react-redux';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();

  // const [anchorEl, setAnchorEl] = useState(null);
  const sellerId = useSelector((state) => state.auth.seller.sellerId);
  const [recentOrders, setRecentOrders] = useState([]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  
  const { loading, error, data } = useSellerDashboard(sellerId);
  
  useEffect(() => {
    if (data && data.orders) {
      const orders = data.orders;
      setRecentOrders(orders.slice(-5).reverse());
    }
  }, [data]);
  if (loading) return <SkeletonPopularCard />;
  if (error) return <p>Error fetching data</p>;

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h3">Recent Orders</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column" spacing={2}>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <Grid item key={order._id}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              Order ID: {order._id}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                            Title: {order.title}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" color={theme.palette.primary.main}>
                              Total Price: ${order.totalPrice.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 2.5 }} />
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No recent orders found.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
