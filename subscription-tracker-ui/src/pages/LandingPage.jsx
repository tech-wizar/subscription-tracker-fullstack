import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; // An icon for our logo

// The URL to our backend's Google login endpoint
const GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

const LandingPage = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header / Navigation Bar */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <TrackChangesIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Subscription Tracker
                    </Typography>
                    <Button color="inherit" href={GOOGLE_AUTH_URL}>Login</Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Container maxWidth="md" sx={{ mt: 15, textAlign: 'center' }}>
                <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item>
                        <Typography variant="h2" component="h1" fontWeight="bold">
                            Take Control of Your Subscriptions
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" color="text.secondary">
                            Never overpay for a service again. Track all your recurring payments
                            in one simple, secure dashboard.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            href={GOOGLE_AUTH_URL}
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, py: 2, px: 5, fontSize: '1.2rem' }}
                        >
                            Start for Free with Google
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;