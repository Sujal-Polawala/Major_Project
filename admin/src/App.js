import { useDispatch, useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import client from 'views/pages/admin/AdminDashboard/apolloClient';
import { ApolloProvider } from '@apollo/client';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect } from 'react';
import { getNotification } from 'features/notificationSlice';
import socket from 'socket';
// ==============================|| APP ||============================== //


const App = () => {
  const customization = useSelector((state) => state.customization);
  const seller = useSelector((state) => state.auth.seller)
  const sellerId = seller?._id;
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (sellerId) {
        if (!socket.connected) {
            socket.connect();  // Ensure the socket is connected
        }

        const role = seller?.role;
        socket.emit("register", { sellerId, role });

        const handleNotification = () => {
            dispatch(getNotification(sellerId));
        };

        socket.on("receiveNotification", handleNotification);

        return () => {
            socket.off("receiveNotification", handleNotification);
        };
    }
  }, [dispatch, sellerId]);  // Ensure it re-runs when sellerId changes

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <ApolloProvider client={client}>
            <Routes />
          </ApolloProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
