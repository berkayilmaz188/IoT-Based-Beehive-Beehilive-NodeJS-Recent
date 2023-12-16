import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

const CardStyle = styled(Card)(({ theme }) => ({
    background: theme.palette.warning.light,
    marginTop: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '19px solid ',
        borderColor: theme.palette.warning.main,
        borderRadius: '50%',
        top: '65px',
        right: '-150px'
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '3px solid ',
        borderColor: theme.palette.warning.main,
        borderRadius: '50%',
        top: '145px',
        right: '-70px'
    }
}));

const UpgradePlanCardWrapper = () => {
    const navigate = useNavigate();

    const UpgradePlanCard = () => (
        <CardStyle>
            <CardContent>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h4">Hives 1</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" color="grey.900" sx={{ opacity: 0.6 }}>
                            Ari kovaninizi <br />
                            takip edebilirsiniz.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row">
                            <AnimateButton>
                                <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }} onClick={() => navigate('/dashboard/hive')}>
                                    Detay
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </CardStyle>
    );

    return <UpgradePlanCard />;
};

export default UpgradePlanCardWrapper;