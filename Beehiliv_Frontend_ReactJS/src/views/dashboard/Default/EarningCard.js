import PropTypes from 'prop-types';
import { useState, useContext } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import ThermostatIcon from '@mui/icons-material/Thermostat';

import WebSocketContext from './WebSocketContext';


import Chart from 'react-apexcharts';
import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
    const data = useContext(WebSocketContext);
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };
    

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                        >
                                            <ThermostatIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>

                                    
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 0.75 }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Grid container alignItems="center">
                                        {data && data.data && (
                                            <Grid item>
                                                
                                                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                    {data.data.sicaklik2.toFixed(2)}°
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            color: theme.palette.grey[200],
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        Internal Tempeture
                                                    </Typography>
                                                
                                                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                    {data.data.sicaklik1.toFixed(2)}°
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            color: theme.palette.grey[200],
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        External Tempeture
                                                    </Typography>
                                                
                                            </Grid>)}
                                            
                                            <Grid item xs={12}>
                                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;