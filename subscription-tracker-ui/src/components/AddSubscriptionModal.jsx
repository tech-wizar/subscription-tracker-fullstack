import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab'; // <-- 1. IMPORT LOADING BUTTON

// 2. Accept a new prop: 'isSubmitting'
const AddSubscriptionModal = ({ open, onClose, onSave, existingSubscription, isSubmitting }) => {
  // ... all the state and useEffect logic is the same ...
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (existingSubscription) {
      setName(existingSubscription.name);
      setCategory(existingSubscription.category);
      setCost(existingSubscription.cost);
      setBillingCycle(existingSubscription.billingCycle);
      setStartDate(existingSubscription.startDate);
    } else {
      setName(''); setCategory(''); setCost(''); setBillingCycle(''); setStartDate('');
    }
  }, [existingSubscription, open]);

  const handleSave = () => {
    const subscriptionData = { name, category, cost: parseFloat(cost), billingCycle: billingCycle.toUpperCase(), startDate };
    if (existingSubscription) {
        subscriptionData.id = existingSubscription.id;
    }
    onSave(subscriptionData);
    // The modal no longer closes itself; the parent will close it on success.
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{existingSubscription ? 'Edit Subscription' : 'Add a New Subscription'}</DialogTitle>
      <DialogContent>
        {/* ... All TextFields are the same ... */}
        <DialogContentText>
          {existingSubscription ? 'Update the details for your subscription.' : 'Please enter the details for your new subscription.'}
        </DialogContentText>
        <TextField autoFocus margin="dense" id="name" label="Subscription Name" type="text" fullWidth variant="standard" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField margin="dense" id="category" label="Category" type="text" fullWidth variant="standard" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField margin="dense" id="cost" label="Cost" type="number" fullWidth variant="standard" value={cost} onChange={(e) => setCost(e.target.value)} />
        <TextField margin="dense" id="billingCycle" label="Billing Cycle (MONTHLY/YEARLY)" type="text" fullWidth variant="standard" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} />
        <TextField margin="dense" id="startDate" label="Start Date" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        {/* 3. REPLACE THE OLD BUTTON WITH LOADING BUTTON */}
        <LoadingButton
          onClick={handleSave}
          loading={isSubmitting} // Control loading state with the prop
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubscriptionModal;