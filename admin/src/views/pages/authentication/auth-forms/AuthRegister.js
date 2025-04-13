import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useDispatch, useSelector } from 'react-redux';
import { signSeller, resetRegistration } from 'features/registerSlice';
import CustomSnackbar from 'component/CustomSnackbar';
import zxcvbn from "zxcvbn";

const FirebaseRegister = ({ ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const { loading, error, message } = useSelector((state) => state.register);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false); // Controls the suggestion dialog
  const [suggestedPassword, setSuggestedPassword] = useState(''); 
  const [dismissedWeakPassword, setDismissedWeakPassword] = useState(false);// Stores generated password

  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (message || error) {
      setSnackbarMessage(message || error);
      setSnackbarSeverity(message ? 'success' : 'error');
      setOpenSnackbar(true);
      setTimeout(() => {
              dispatch(resetRegistration());
      }, 1500);
    }
  }, [message, error]);

  useEffect(() => {
    return () => {
      dispatch(resetRegistration()); // Reset auth state on component unmount or page change
    };
  }, [location.pathname]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    
    // Navigate to login after the Snackbar is closed
    if (snackbarSeverity === 'success') {
      setTimeout(() => {
        navigate("/login"); // Navigate after Snackbar closes
      }, 200);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (name === 'password') {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
  
      // Only suggest if password is at least 6 characters and still weak
      if (value.length >= 6 && temp < 3 && !dismissedWeakPassword) {
        const strongPwd = generateStrongPassword();
        setSuggestedPassword(strongPwd);
        setOpenDialog(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signSeller(formData));
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return zxcvbn(pwd).score >= 3 ? pwd : generateStrongPassword();
  };
  
  const handleCancelSuggestion = () => {
    setDismissedWeakPassword(true); // Prevent future suggestions
    setOpenDialog(false);
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>
      <form noValidate onSubmit={handleSubmit} {...others}>
        <Grid container spacing={matchDownSM ? 0 : 2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
          />
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>

              </InputAdornment>
            }
          />
        </FormControl>
        {strength !== 0 && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontSize="0.75rem">
                  {level?.label}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} color="primary" />}
          label={<Typography variant="subtitle1">Agree with <Link to="#">Terms & Condition</Link>.</Typography>}
        />
        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button fullWidth size="large" type="submit" variant="contained" color="secondary">
              {loading ? <CircularProgress size={24} /> : 'Sign up'}
            </Button>
          </AnimateButton>
        </Box>
      </form>

      {/* Snackbar Notification */}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Weak Password Detected</DialogTitle>
        <DialogContent>
          <Typography>Your password is weak. Try this strong password:</Typography>
          <Typography sx={{ fontWeight: 'bold', mt: 1, color: 'green' }}>
            {suggestedPassword}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSuggestion} color="error">Cancel</Button>
          <Button
            onClick={() => {
              setFormData({ ...formData, password: suggestedPassword });
              setOpenDialog(false);

              const temp = strengthIndicator(suggestedPassword);
              setStrength(temp);
              setLevel(strengthColor(temp));
            }}
            color="primary"
          >
            Use Suggested Password
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage}/>
    </>
  );
};

export default FirebaseRegister;
