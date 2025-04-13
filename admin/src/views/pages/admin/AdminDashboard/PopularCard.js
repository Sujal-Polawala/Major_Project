import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, CardContent, Divider, Grid, Typography, CardHeader } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { gql, useQuery } from '@apollo/client';

const GET_POPULAR_PRODUCT = gql`
  query GetPopularProducts {
    bestSellingProducts {
      _id
      title
      sales
    }
  }
`;

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_POPULAR_PRODUCT, { fetchPolicy: 'no-cache' });

  if (loading) return <SkeletonPopularCard />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!data || !data.bestSellingProducts?.length) return <Typography>No data available</Typography>;

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false} sx={{ borderRadius: 3, boxShadow: 3, height: '100%', // Full height
          display: 'flex', 
          flexDirection: 'column' }}>
          {/* Card Header */}
          <CardHeader
            title="Best Selling Products"
            sx={{
              textAlign: 'center',
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              py: 2,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            {data.bestSellingProducts.map((product) => (
              <Grid container direction="column" key={product._id} sx={{ mb: 2 }}>
                <Grid item>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h4" fontWeight="bold" color="textPrimary">
                        {product.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography variant="h6" fontWeight="bold" color="textSecondary">
                            {product.sales}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: theme.palette.success.light,
                              color: theme.palette.success.dark
                            }}
                          >
                            <KeyboardArrowUpOutlinedIcon fontSize="small" />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Profit Information */}
                {/* <Grid item>
                  <Typography variant="body2" color={theme.palette.success.main} fontStyle="italic">
                    10% Profit
                  </Typography>
                </Grid> */}

                {/* Divider */}
                <Divider sx={{ my: 1 }} />
              </Grid>
            ))}
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
