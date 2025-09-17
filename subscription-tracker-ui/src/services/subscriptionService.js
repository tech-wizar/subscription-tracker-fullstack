import axios from 'axios';

// Create a new instance of axios with a base URL
const apiClient = axios.create({
    baseURL: 'http://localhost:8080'
});

// This is an interceptor. It's a piece of code that runs
// BEFORE every single API request is sent by apiClient.
apiClient.interceptors.request.use(config => {
    // 1. Get the token from Local Storage
    const token = localStorage.getItem('accessToken');

    // 2. If a token exists, add it to the 'Authorization' header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Return the modified request configuration
    return config;
}, error => {
    return Promise.reject(error);
});


// --- MODIFIED FUNCTION ---
// Function to get all subscriptions, now with sorting
export const getAllSubscriptions = async (sortBy, sortDirection) => {
    const response = await apiClient.get('/api/subscriptions', {
        params: { sortBy, sortDirection }
    });
    return response.data;
};
// -------------------------

// Function to create a new subscription
export const createSubscription = async (subscriptionData) => {
    const response = await apiClient.post('/api/subscriptions', subscriptionData);
    return response.data;
};

// Function to update a subscription
export const updateSubscription = async (id, subscriptionData) => {
    const response = await apiClient.put(`/api/subscriptions/${id}`, subscriptionData);
    return response.data;
};

// Function to delete a subscription
export const deleteSubscription = async (id) => {
    await apiClient.delete(`/api/subscriptions/${id}`);
};

export const getSubscriptionSummary = async () => {
    const response = await apiClient.get('/api/subscriptions/summary');
    return response.data;
};

export const getUpcomingBills = async () => {
    const response = await apiClient.get('/api/subscriptions/upcoming');
    return response.data;
};

export const getAIAnalysis = async (summaryData) => {
    const response = await apiClient.post('/api/ai/analyze', summaryData);
    return response.data;
};

export const getMonthlyHistory = async () => {
    const response = await apiClient.get('/api/subscriptions/monthly-history');
    return response.data;
};

export const updateBudget = async (budget) => {
  const response = await apiClient.put("/api/users/budget", budget, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};