import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const FirebaseRegister = ({ ...others }) => {
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

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleRegister = async (values, setStatus, setErrors, setSubmitting) => {
        try {
            const response = await axios.post('/register', {
                firstName: values.fname,
                lastName: values.lname,
                userName: values.userName,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber,
            });

            if (response.status === 200) {
                if (response.data.isVerified === false) {
                    setStatus({ success: true });
                    setSubmitting(false);
                    setSnackbarMessage("Success check your email verify your account After 5 seconds you will be redirected to /login.");
                    setSnackbarOpen(true);

                    setTimeout(() => {
                        navigate('/login'); // <-- Use navigate('/login') instead of history.push('/login')
                    }, 5000);
                } else if (response.data.message === "this username or mail is already taken") {
                    setStatus({ success: false });
                    setSubmitting(false);
                    setSnackbarMessage("You have already registered");
                    setSnackbarOpen(true);
                } else {
                    setStatus({ success: true });
                    setSubmitting(false);
                }
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
    };

    const googleHandler = async () => {
        console.error('Register');
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
                        <Typography variant="subtitle1">Register with email,username and password</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    fname: '',
                    lname: '',
                    userName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    userName: Yup.string().max(255).required('UserName is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    fname: Yup.string().max(25).required('Firstname is required'),
                    phoneNumber: Yup.string().max(25).required('PhoneNumber is required'),
                    lname: Yup.string().max(25).required('Lastname is required')
                    
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            handleRegister(values, setStatus, setErrors, setSubmitting);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.fname && errors.fname)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-register">firstName</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email-firstname"
                                    type="text"
                                    value={values.fname}
                                    name="fname"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.fname && errors.fname && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.fname}
                                    </FormHelperText>
                                )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.lname && errors.lname)} sx={{ ...theme.typography.customInput }}>
                                    <InputLabel htmlFor="outlined-adornment-email-register">lastName</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email-lastname"
                                        type="text"
                                        value={values.lname}
                                        name="lname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.lname && errors.lname && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.lname}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.phoneNumber && errors.phoneNumber)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">PhoneNumber</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="text"
                                value={values.phoneNumber}
                                name="phoneNumber"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.phoneNumber}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.userName && errors.userName)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="text"
                                value={values.userName}
                                name="userName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.userName && errors.userName && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.userName}
                                </FormHelperText>
                            )}
                        </FormControl>
                        

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
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
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

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
                                    Sign up
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
                <Alert onClose={handleSnackbarClose} severity={snackbarMessage === "Success check your email" ? "success" : "error"} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default FirebaseRegister;
