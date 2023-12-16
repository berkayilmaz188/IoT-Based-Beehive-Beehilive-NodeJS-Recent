import { useEffect, useState, useReducer} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

import WebSocketContext from "./WebSocketContext";
import AirQuality1 from './AirQuality1';
import AirQuality2 from './AirQuality2';
import AnimalAttack from './AnimalAttack';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    
    
    const [hivelogs, setChartData] = useState([]);

    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        const newSocket = io('http://www.beehiliv.com.tr:4001');
        setSocket(newSocket);
    
        return () => newSocket.close();
      }, []);
    
      const dataReducer = (state, action) => {
        switch (action.type) {
          case 'SET_DATA':
            return action.payload;
          default:
            return state;
        }
      };
    
      const [data, dispatch] = useReducer(dataReducer, null);
    
      useEffect(() => {
        if (socket) {
          socket.on('message', (message) => {
            console.log('Received raw message:', message);
            try {
              console.log('Parsed data:', message);
              dispatch({ type: 'SET_DATA', payload: message });
            } catch (err) {
              console.error('Error processing message:', err);
            }
          });
    
          socket.on('connect', () => {
            console.log('Connected to WebSocket server');
          });
    
          socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
          });
        }
    
        return () => {
          if (socket) {
            socket.off('message');
            socket.off('connect');
            socket.off('disconnect');
          }
        };
      }, [socket]);
    
      useEffect(() => {
        console.log('Data state updated:', data);
        if(data !== null){
          setLoading(false);
        }
      }, [data]);


      // log request
      useEffect(() => {
        const jwt_token = localStorage.getItem("jwt_token");
    
        axios.get("/getlog", { headers: { Authorization: `Bearer ${jwt_token}` }})
          .then(res => {
            setChartData(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.error(err);
            setLoading(false);
          });
      }, []);

    return (
        <WebSocketContext.Provider value={data}>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>

                    <Grid item lg={4} md={6} sm={6} xs={12}>
                    <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <AirQuality1 isLoading={isLoading} />   
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <AirQuality2 isLoading={isLoading} />   
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <AnimalAttack isLoading={isLoading} />   
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} hivelogs={hivelogs} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} socket={socket} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </WebSocketContext.Provider>
    );
};

export default Dashboard;
