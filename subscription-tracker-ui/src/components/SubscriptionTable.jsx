import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

// This is now a simple component that just displays what it's given.
// It no longer has its own loading or error logic.
const SubscriptionTable = ({ 
    subscriptions, onEdit, onDelete, onAdd,
    sortBy, setSortBy, sortDirection, setSortDirection
}) => {

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" component="h2">
                Your Subscriptions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Sorting Controls */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="startDate">Start Date</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="cost">Cost</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-dir-label">Direction</InputLabel>
                    <Select
                        labelId="sort-dir-label"
                        value={sortDirection}
                        label="Direction"
                        onChange={(e) => setSortDirection(e.target.value)}
                    >
                        <MenuItem value="ASC">Ascending</MenuItem>
                        <MenuItem value="DESC">Descending</MenuItem>
                    </Select>
                </FormControl>
                {/* Add New Button */}
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                    Add New
                </Button>
            </Box>
        </Box>
        
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="subscription table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Billing Cycle</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                          <TableCell>{sub.id}</TableCell>
                          <TableCell>{sub.name}</TableCell>
                          <TableCell>{sub.category}</TableCell>
                          <TableCell>${sub.cost.toFixed(2)}</TableCell>
                          <TableCell>{sub.billingCycle}</TableCell>
                          <TableCell>{sub.startDate}</TableCell>
                          <TableCell align="right">
                              <IconButton aria-label="edit" onClick={() => onEdit(sub)}>
                                  <EditIcon />
                              </IconButton>
                              <IconButton aria-label="delete" onClick={() => onDelete(sub.id)}>
                                  <DeleteIcon />
                              </IconButton>
                          </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
  );
};

export default SubscriptionTable;