import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



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
    Stack,
    Typography,
    useMediaQuery,
    Snackbar,
    Alert
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';


// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);

    const navigate = useNavigate();


    const handleForgotPassword = () => {
        navigate('/forgotpassword');
      };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ message: "", severity: "success" });

    const showAlert = (message, severity) => {
        setAlertMessage({ message, severity });
        setOpen(true);
      };
      
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpen(false);
      };
      

    const [userData, setUserData] = useState({
        email: "",
        userName: "",
        password: "",
      });

      const isEmail = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
      };
    
      const handleChangeIdentifier = (event) => {
        const inputValue = event.target.value;
        if (isEmail(inputValue)) {
          setUserData({ ...userData, email: inputValue, userName: "" });
        } else {
          setUserData({ ...userData, userName: inputValue, email: "" });
        }
      };

      const handleChangePassword = (event) => {
        const inputValue = event.target.value;
        setUserData({ ...userData, password: inputValue });
      };
      

      const onSubmitHandler = async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
            const response = await axios.post('/login', userData);
    
            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("jwt_token", token);
                localStorage.setItem("firstName", user.firstName);
                localStorage.setItem("lastName", user.lastName);
                localStorage.setItem("phoneNumber", user.phoneNumber);
                localStorage.setItem("userName", user.userName);
                localStorage.setItem("userID", user._id);
                localStorage.setItem("created", user.createdAt);
                localStorage.setItem("email", user.email);
    
    
                setStatus({ success: true });
                showAlert(`Successfully logged in ${user.firstName} ${user.lastName}`, "success");
                setTimeout(() => {
                    navigate("/dashboard/default");
                }, 1000);
            } else if (response.status === 400) {
                showAlert("Wrong email or username or password", "error");
            } else {
                showAlert("Network error", "error");
            }
    
            setSubmitting(false);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                showAlert("Wrong email or username or password", "error");
            } else {
                showAlert("Network error", "error");
            }
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };
    
      
      

      
      

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
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
                        <Typography variant="subtitle1">Sign in with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: 'beehiliv2023@gmail.com',
                    password: '123456',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().max(255).required('Email or username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={onSubmitHandler}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="text"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={(event) => {
                                handleChange(event);
                                handleChangeIdentifier(event);
                                }}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                            >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={(event) => {
                                handleChange(event);
                                handleChangePassword(event);
                                }}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                                    >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            
                            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }} onClick={handleForgotPassword}>
                                Forgot Password?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

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
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={alertMessage.severity} sx={{ width: "100%" }}>
                    {alertMessage.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default FirebaseLogin;
