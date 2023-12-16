import { useSelector } from 'react-redux';
import axios from "axios";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

axios.defaults.baseURL = "http://www.beehiliv.com.tr:4000";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://www.beehiliv.com.tr:4000';
axios.defaults.withCredentials = true

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
