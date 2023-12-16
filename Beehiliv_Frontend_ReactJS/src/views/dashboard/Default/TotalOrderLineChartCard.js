import PropTypes from 'prop-types';
import { useState, useContext } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AirIcon from '@mui/icons-material/Air';

import WebSocketContext from './WebSocketContext';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
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
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
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

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
    const data = useContext(WebSocketContext);
    const theme = useTheme();

    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
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
                                                backgroundColor: theme.palette.primary[800],
                                                color: '#fff',
                                                mt: 1
                                            }}
                                        >
                                            <AirIcon fontSize="inherit" />
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
                                                     {data.data.Hum2.toFixed(2)}%
                                                    </Typography>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                color: theme.palette.grey[200],
                                                                mt: 0.5
                                                            }}
                                                        >
                                                            Internal Hummunity
                                                        </Typography>

                                                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                    {data.data.Hum1.toFixed(2)}%
                                                    </Typography>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                color: theme.palette.grey[200],
                                                                mt: 0.5
                                                            }}
                                                        >
                                                            External Hummunity
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

TotalOrderLineChartCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
