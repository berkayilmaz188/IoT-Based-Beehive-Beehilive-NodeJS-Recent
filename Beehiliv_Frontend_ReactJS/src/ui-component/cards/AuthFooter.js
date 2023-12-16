// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://www.beehiliv.com.tr" target="_blank" underline="hover">
            beehiliv.com
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://www.beehiliv.com.tr" target="_blank" underline="hover">
            &copy; Code by Berkay Salih Yilmaz
        </Typography>
    </Stack>
);

export default AuthFooter;
