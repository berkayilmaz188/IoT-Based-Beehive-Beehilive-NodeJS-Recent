import { Grid, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

import React, { useState, useEffect } from 'react';


// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    useMediaQuery,
    Snackbar,
    Alert
} from '@mui/material';


import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ==============================|| TYPOGRAPHY ||============================== //

const Profile = () => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
    
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');
    const userID = localStorage.getItem('userID');
    const created = localStorage.getItem('created');



    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

  

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
      };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
    


    const fieldToServerKey = {
        username: 'userName',
        mail: 'email',
        password: 'password',
        phoneNumber: 'phoneNumber',
        name: 'firstName',
        surname: 'lastName'
      };
      


      const handleUpdate = async (values, setStatus, setErrors, setSubmitting) => {
        try {
          const token = localStorage.getItem("jwt_token");
          
          const nonEmptyValues = Object.keys(values).reduce((acc, key) => {
            if (values[key] !== '' && key !== 'confirmPassword' && key !== 'confirmMail' && fieldToServerKey[key]) {
              acc[fieldToServerKey[key]] = values[key];
            }
            return acc;
          }, {});
    
          await axios.post("http://www.beehiliv.com.tr:4000/change", nonEmptyValues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          setStatus({ success: true });
          setSubmitting(false);
            
          // Snackbar mesajını ayarla ve göster
          setSnackbarMessage("Your account is updating...After 2 seconds you will be redirected to /login");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          
          // 5 saniye sonra /login sayfasına yönlendir ve localStorage'ı temizle
          setTimeout(() => {
            localStorage.clear();
            navigate('/login', { replace: true });
          }, 2000);
    
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
    
          // Eğer bir hata oluştuysa snackbar'ı açıp hata mesajını gösterir
          setSnackbarMessage("Network error");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
    
      
      
      
      
      



return(
    <div style={{ marginTop: '40px' }}>
    <MainCard title={`Dear ${firstName} ${lastName}`} >
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <SubCard title="Current Profile Info">
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography variant="h4"  sx={{ width: '33%', flexShrink: 0 }}>
                            Current Name:
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary' }}>{firstName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                                <Formik
                                            initialValues={{
                                                name: '',
                                                confirmName: '',
                                                submit: null
                                            }}
                                            validationSchema={Yup.object().shape({
                                                name: Yup.string().max(255).required('Name is required'),
                                                confirmName: Yup.string().oneOf([Yup.ref('name'), null], 'Names must match')
                                            })}
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                try {
                                                handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                                                        <InputLabel htmlFor="outlined-adornment-email-firstname">New Name</InputLabel>
                                                        <OutlinedInput
                                                        id="outlined-adornment-email-firstname"
                                                        type="text"
                                                        value={values.name}
                                                        name="name"
                                                        label="Name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                            
                                                            </InputAdornment>
                                                        }
                                                        inputProps={{}}
                                                        />
                                                        {touched.name && errors.name && <Typography variant="caption" color="error">{errors.name}</Typography>}
                                                    </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                        <InputLabel htmlFor="outlined-adornment-confirm-email-register">Confirm Name</InputLabel>
                                                        <OutlinedInput
                                                        id="outlined-adornment-confirm-email-register"
                                                        type="text"
                                                        value={values.confirmName}
                                                        name="confirmName"
                                                        label="Confirm Name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                            
                                                            </InputAdornment>
                                                        }
                                                        inputProps={{}}
                                                        />
                                                        {touched.confirmName && errors.confirmName && <Typography variant="caption" color="error">{errors.confirmName}</Typography>}
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
                                                        Change Name
                                                    </Button>
                                                    </AnimateButton>
                                                </Box>
                                                </form>
                                            )}
                                            </Formik>
                        </Typography>
                        </AccordionDetails>
                    </Accordion>



                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                        >
                        <Typography  variant="h4" sx={{ width: '33%', flexShrink: 0 }}>Current Surname:</Typography>
                        <Typography  variant="h5" sx={{ color: 'text.secondary' }}>
                        {lastName}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                            <Formik
                                    initialValues={{
                                        surname: '',
                                        confirmSurname: '',
                                        submit: null
                                    }}
                                    validationSchema={Yup.object().shape({
                                        surname: Yup.string().max(255).required('Surname is required'),
                                        confirmSurname: Yup.string().oneOf([Yup.ref('surname'), null], 'Surnames must match')
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        try {
                                        handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                                                <InputLabel htmlFor="outlined-adornment-email-firstname">New Surname</InputLabel>
                                                <OutlinedInput
                                                id="outlined-adornment-email-firstname"
                                                type="text"
                                                value={values.surname}
                                                name="surname"
                                                label="Surname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                    
                                                    </InputAdornment>
                                                }
                                                inputProps={{}}
                                                />
                                                {touched.surname && errors.surname && <Typography variant="caption" color="error">{errors.surname}</Typography>}
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="outlined-adornment-confirm-email-register">Confirm Surname</InputLabel>
                                                <OutlinedInput
                                                id="outlined-adornment-confirm-email-register"
                                                type="text"
                                                value={values.confirmSurname}
                                                name="confirmSurname"
                                                label="Confirm Surname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                    
                                                    </InputAdornment>
                                                }
                                                inputProps={{}}
                                                />
                                                {touched.confirmSurname && errors.confirmSurname && <Typography variant="caption" color="error">{errors.confirmSurname}</Typography>}
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
                                                Change Surname
                                            </Button>
                                            </AnimateButton>
                                        </Box>
                                        </form>
                                    )}
                                    </Formik>
                        </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                        >
                        <Typography variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                            Current Username:
                        </Typography>
                        <Typography  variant="h5" sx={{ color: 'text.secondary' }}>
                        {userName}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                                <Formik
                                initialValues={{
                                    username: '',
                                    confirmUsername: '',
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    username: Yup.string().max(255).required('Username is required'),
                                    confirmUsername: Yup.string().oneOf([Yup.ref('username'), null], 'Usernames must match')
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    try {
                                    handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                                            <InputLabel htmlFor="outlined-adornment-email-firstname">New Username</InputLabel>
                                            <OutlinedInput
                                            id="outlined-adornment-email-firstname"
                                            type="text"
                                            value={values.username}
                                            name="username"
                                            label="Username"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                            />
                                            {touched.username && errors.username && <Typography variant="caption" color="error">{errors.username}</Typography>}
                                        </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                            <InputLabel htmlFor="outlined-adornment-confirm-email-register">Confirm Username</InputLabel>
                                            <OutlinedInput
                                            id="outlined-adornment-confirm-email-register"
                                            type="text"
                                            value={values.confirmUsername}
                                            name="confirmUsername"
                                            label="Confirm Username"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                            />
                                            {touched.confirmUsername && errors.confirmUsername && <Typography variant="caption" color="error">{errors.confirmUsername}</Typography>}
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
                                            Change Username
                                        </Button>
                                        </AnimateButton>
                                    </Box>
                                    </form>
                                )}
                                </Formik>
                        </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                        >
                        <Typography variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                            Current Email:
                        </Typography>
                        <Typography  variant="h5" sx={{ color: 'text.secondary' }}>
                        {email}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        <Formik
    initialValues={{
        mail: '',
        confirmMail: '',
        submit: null
    }}
    validationSchema={Yup.object().shape({
        mail: Yup.string().email('You must enter a valid email address').required('Email is required'),
        confirmMail: Yup.string().oneOf([Yup.ref('mail'), null], 'Emails must match')
    })}
    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
        handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                <InputLabel htmlFor="outlined-adornment-email-firstname">New Email</InputLabel>
                <OutlinedInput
                id="outlined-adornment-email-firstname"
                type="email"
                value={values.mail}
                name="mail"
                label="Mail"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                    <InputAdornment position="end">
                    
                    </InputAdornment>
                }
                inputProps={{}}
                />
                {touched.mail && errors.mail && <Typography variant="caption" color="error">{errors.mail}</Typography>}
            </FormControl>
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-confirm-email-register">Confirm Email</InputLabel>
                <OutlinedInput
                id="outlined-adornment-confirm-email-register"
                type="email"
                value={values.confirmMail}
                name="confirmMail"
                label="Confirm Mail"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                    <InputAdornment position="end">
                    
                    </InputAdornment>
                }
                inputProps={{}}
                />
                {touched.confirmMail && errors.confirmMail && <Typography variant="caption" color="error">{errors.confirmMail}</Typography>}
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
                Change Email
            </Button>
            </AnimateButton>
        </Box>
        </form>
    )}
</Formik>

                        </Typography>
                        </AccordionDetails>
                    </Accordion>


                    <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                        >
                        <Typography variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                            Current Phone:
                        </Typography>
                        <Typography  variant="h5" sx={{ color: 'text.secondary' }}>
                        {phoneNumber}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        <Formik
                                initialValues={{
                                    phoneNumber: '',
                                    confirmPhoneNumber: '',
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    phoneNumber: Yup.string().max(255).required('PhoneNumber is required'),
                                    confirmPhoneNumber: Yup.string().oneOf([Yup.ref('phoneNumber'), null], 'PhoneNumbers must match')
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    try {
                                    handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                                            <InputLabel htmlFor="outlined-adornment-email-firstname">New PhoneNumber</InputLabel>
                                            <OutlinedInput
                                            id="outlined-adornment-email-firstname"
                                            type="text"
                                            value={values.phoneNumber}
                                            name="phoneNumber"
                                            label="PhoneNumber"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                            />
                                            {touched.phoneNumber && errors.phoneNumber && <Typography variant="caption" color="error">{errors.phoneNumber}</Typography>}
                                        </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                            <InputLabel htmlFor="outlined-adornment-confirm-email-register">Confirm PhoneNumber</InputLabel>
                                            <OutlinedInput
                                            id="outlined-adornment-confirm-email-register"
                                            type="text"
                                            value={values.confirmPhoneNumber}
                                            name="confirmPhoneNumber"
                                            label="Confirm PhoneNumber"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                            />
                                            {touched.confirmPhoneNumber && errors.confirmPhoneNumber && <Typography variant="caption" color="error">{errors.confirmPhoneNumber}</Typography>}
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
                                            Change PhoneNumber
                                        </Button>
                                        </AnimateButton>
                                    </Box>
                                    </form>
                                )}
                                </Formik>
                        </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                            Your userID: {userID}
                        </Typography>
                        <Typography>
                            Your account Created : {created}
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                </SubCard>
            </Grid>

            
            <Grid item xs={12} sm={4}>
                <SubCard title="Change Password">
                
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
                            handleUpdate(values, setStatus, setErrors, setSubmitting);
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
                                    Change Password
                                </Button>
                                </AnimateButton>
                            </Box>
                            </form>
                        )}
                        </Formik>
                        
                </SubCard>
            </Grid>

            
        </Grid>
    </MainCard>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
  <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} elevation={6} variant="filled">
    {snackbarMessage}
  </Alert>
</Snackbar>

    </div>
);
};

export default Profile;
