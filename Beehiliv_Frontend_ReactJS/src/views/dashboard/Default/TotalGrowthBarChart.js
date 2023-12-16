import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import initialChartData from './chart-data/hivelogschartdata';



const status = [
    {
        value: 'today',
        label: 'Last 24 Hours'
    },
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading, hivelogs}) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    console.log(hivelogs)
    
    const [chartData, setChartData] = useState(initialChartData);

    useEffect(() => {
        if (isLoading) return;

        // Sabit saat kategorileri
        const categories = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

        // Her ölçüm tipi için ayrı veri depolama
        const sicaklik1Data = Array(24).fill().map(() => []);
        const sicaklik2Data = Array(24).fill().map(() => []);
        const Hum1Data = Array(24).fill().map(() => []);
        const Hum2Data = Array(24).fill().map(() => []);

        // 'hivelogs' içerisinde dönerek veriyi topla
        Object.keys(hivelogs).forEach((hiveKey) => {
            const hive = hivelogs[hiveKey];
            const last24hour = hive.last24hour || [];

            last24hour.forEach((hourData, index) => {
                const logData = hourData.log.data;

                // Veriyi belirli saat dilimine ekle
                sicaklik1Data[index].push(logData.sicaklik1);
                sicaklik2Data[index].push(logData.sicaklik2);
                Hum1Data[index].push(logData.Hum1);
                Hum2Data[index].push(logData.Hum2);
            });
        });

        // Veriyi 'series' listesine ekle
        const series = [
            {
                name: "External Temp",
                data: sicaklik1Data.map(hourData => hourData.reduce((a, b) => a + b, 0) / hourData.length)
            },
            {
                name: "Internal Temp",
                data: sicaklik2Data.map(hourData => hourData.reduce((a, b) => a + b, 0) / hourData.length)
            },
            {
                name: "External Hum",
                data: Hum1Data.map(hourData => hourData.reduce((a, b) => a + b, 0) / hourData.length)
            },
            {
                name: "Internal Hum",
                data: Hum2Data.map(hourData => hourData.reduce((a, b) => a + b, 0) / hourData.length)
            }
        ];

        // 'series' ve 'categories' listesini güncelle
        setChartData((prevState) => ({
            ...prevState,
            options: {
                ...prevState.options,
                xaxis: {
                    ...prevState.options.xaxis,
                    categories: categories
                }
            },
            series: series
        }));
    }, [isLoading, hivelogs]);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

    

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Tempetures and Hummunity Graphics</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3"></Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                        <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type={chartData.type}
                    height={chartData.height}
                />
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
