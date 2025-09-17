import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'; // Simplified imports
import { Outlet, useNavigate } from 'react-router-dom';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    return (
        // The Container is now the main parent, centering everything inside it.
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <TrackChangesIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            
            <main>
                {/* The Outlet will render our DashboardPage inside this centered container */}
                <Outlet />
            </main>
        </Container>
    );
};

export default Layout;