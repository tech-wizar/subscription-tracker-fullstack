import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

const UpcomingBills = ({ data }) => {
    // Show a message if there are no upcoming bills
    if (!data || data.length === 0) {
        return <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>No upcoming bills in the next 30 days.</Typography>;
    }

    // Otherwise, display the list of bills
    return (
        <List dense>
            {data.map((bill, index) => (
                <React.Fragment key={index}>
                    <ListItem>
                        <ListItemText
                            primary={bill.name}
                            secondary={`Due: ${bill.nextBillingDate}`}
                        />
                        <Typography variant="body1">${bill.cost.toFixed(2)}</Typography>
                    </ListItem>
                    {/* Don't add a divider after the last item */}
                    {index < data.length - 1 && <Divider component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default UpcomingBills;