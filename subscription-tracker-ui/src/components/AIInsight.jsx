import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // A nice "AI" icon from MUI

const AIInsight = ({ insight, isLoading }) => {
    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                    AI-Powered Insight
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{insight}"
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default AIInsight;