import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Snackbar,
    Alert
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';


// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseSetNewPassword = ({ ...others }) => {
    const { token } = useParams();
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const navigate = useNavigate();

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleRegister = async (values, setStatus, setErrors, setSubmitting) => {
        console.log('About to send request to /passwordreset/' + token);
        if (values.password !== values.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          setSubmitting(false);
        } else {
          try {
            const response = await axios.post('/passwordreset/' + token, {
              newPassword: values.password,
            });
            if (response.status === 200) {
              setStatus({ success: true });
              setSubmitting(false);
              setSnackbarMessage("Success changed your password please login.");
              setSnackbarOpen(true);
      
              setTimeout(() => {
                navigate('/login');
              }, 5000);
            } else {
              throw new Error('An error occurred');
            }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              setSnackbarMessage("Network error");
              setSnackbarOpen(true);
            }
          }
        }
      };
      

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
      };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
        <Grid container direction="column" justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
              <Button
                variant="outlined"
                sx={{
                  cursor: 'unset',
                  m: 2,
                  py: 0.5,
                  px: 7,
                  borderColor: `${theme.palette.grey[100]} !important`,
                  color: `${theme.palette.grey[900]}!important`,
                  fontWeight: 500,
                  borderRadius: `${customization.borderRadius}px`
                }}
                disableRipple
                disabled
              >
                Beehiliv
              </Button>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            </Box>
          </Grid>
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Enter your new password</Typography>
            </Box>
          </Grid>
        </Grid>
  
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string().max(255).required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              handleRegister(values, setStatus, setErrors, setSubmitting);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, errors }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-register"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                    />
                    {touched.password && errors.password && <Typography variant="caption" color="error">{errors.password}</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-confirm-password-register"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      label="Confirm Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size="large"
                          >
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{}}
                    />
                    {touched.confirmPassword && errors.confirmPassword && <Typography variant="caption" color="error">{errors.confirmPassword}</Typography>}
                  </FormControl>
                </Grid>
              </Grid>
  
              <Box sx={{ mt: 2 }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Reset Password
                  </Button>
                </AnimateButton>
              </Box>
            </form>
          )}
        </Formik>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    );
};

export default FirebaseSetNewPassword;
