import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { Grid, Typography } from '@mui/material';

// third-party
// import ApexCharts from 'apexcharts';
// import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useSellerDashboard } from 'services/sellerDashBoardServices';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const sellerId = useSelector((state) => state.auth.seller.sellerId);
  const [salesData, setSalesData] = useState([]);

  const { loading, error, data } = useSellerDashboard(sellerId);

  useEffect(() => {
    if (data && data.order) {
      const orders = data.order;
  
      // Initialize months with zero revenue
      const allMonths = Array.from({ length: 12 }, (_, index) => ({
        monthIndex: index,
        month: new Date(2000, index).toLocaleString('default', { month: 'short' }),
        revenue: 0
      }));
  
      // Calculate revenue for existing months
      const revenueByMonth = orders.reduce((acc, order) => {
        const date = new Date(parseInt(order.createdAt));
        const monthIndex = date.getMonth();
  
        acc[monthIndex].revenue += order.totalPrice;
        return acc;
      }, allMonths);
  
      // Ensure months are sorted from Jan to Dec
      setSalesData(revenueByMonth);
    }
  }, [data]);
  

  if (loading) return <SkeletonTotalGrowthBarChart />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#4B5563' }}>
                Monthly Revenue
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 14 }} />
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
