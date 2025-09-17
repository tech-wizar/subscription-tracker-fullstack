import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

// This is the special URL Spring Boot created for us to start the Google login flow.
const GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

const LoginPage = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Welcome to Subscription Tracker
                </Typography>
                <Typography component="p" sx={{ mt: 1, mb: 3 }}>
                    Please sign in to continue
                </Typography>
                <Button
                    href={GOOGLE_AUTH_URL} // This is the key part!
                    variant="contained"
                    fullWidth
                >
                    Sign In with Google
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;