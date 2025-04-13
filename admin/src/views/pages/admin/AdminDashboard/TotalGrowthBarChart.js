import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Grid, Typography } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const ADMIN_DASHBOARD_CHART = gql`
  query {
    totalAdminIncome
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

const TotalGrowthBarChart = ({ isLoading }) => {
  const { loading, error, data } = useQuery(ADMIN_DASHBOARD_CHART, {
    fetchPolicy: 'no-cache'
  });

  if (loading) return <SkeletonTotalGrowthBarChart />;
  if (error)
    return (
      <Typography variant="h4" color="error">
        Error: {error.message}
      </Typography>
    );

  const sellerRevenueData = data.sellers.map((seller) => ({
    name: seller.name,
    revenue: seller.totalSales
  }));

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#4B5563' }}>
                Seller Revenue Overview
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sellerRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 14 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 14 }} />
                  <Tooltip cursor={{ fill: '#E5E7EB' }} />
                  <Bar dataKey="revenue" fill="url(#colorUv)" barSize={45} radius={[10, 10, 0, 0]} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
