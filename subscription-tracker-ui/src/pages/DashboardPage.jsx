import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Divider,
    TextField,
    Button,
    LinearProgress,
    Snackbar
} from '@mui/material';
import toast from 'react-hot-toast';

import SubscriptionTable from '../components/SubscriptionTable.jsx';
import ExpensePieChart from '../components/ExpensePieChart.jsx';
import AddSubscriptionModal from '../components/AddSubscriptionModal.jsx';
import UpcomingBills from '../components/UpcomingBills.jsx';
import AIInsight from '../components/AIInsight.jsx';
import ExpenseTrendChart from '../components/ExpenseTrendChart.jsx';
import {
    getAllSubscriptions,
    getSubscriptionSummary,
    getUpcomingBills,
    getAIAnalysis,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getMonthlyHistory
} from '../services/subscriptionService';

const DashboardPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [upcomingBills, setUpcomingBills] = useState([]);
    const [monthlyHistory, setMonthlyHistory] = useState([]);
    const [aiInsight, setAiInsight] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState('startDate');
    const [sortDirection, setSortDirection] = useState('DESC');

    const [monthlyBudget, setMonthlyBudget] = useState(() => {
        const saved = localStorage.getItem("monthlyBudget");
        return saved ? parseFloat(saved) : 0;
    });
    const [budgetInput, setBudgetInput] = useState('');
    const [currentSpending, setCurrentSpending] = useState(0);
    const [budgetSaved, setBudgetSaved] = useState(false);

    const calculateCurrentMonthSpending = (subs) => {
        const now = new Date();
        let total = 0;

        (subs || []).forEach(sub => {
            if (!sub || !sub.startDate) return;
            const startDate = new Date(sub.startDate);
            if (isNaN(startDate.getTime())) return;

            if (startDate <= now) {
                if (sub.billingCycle === "MONTHLY") {
                    total += Number(sub.cost || 0);
                } else if (sub.billingCycle === "YEARLY") {
                    total += Number(sub.cost || 0) / 12;
                }
            } else {
                total += Number(sub.cost || 0);
            }
        });

        return total;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setIsAiLoading(true);

            const [subsData, summaryRes, upcomingRes, historyRes] = await Promise.all([
                getAllSubscriptions(sortBy, sortDirection),
                getSubscriptionSummary(),
                getUpcomingBills(),
                getMonthlyHistory()
            ]);

            setSubscriptions(subsData || []);
            setSummaryData(summaryRes || []);
            setUpcomingBills(upcomingRes || []);
            setMonthlyHistory(historyRes || []);

            const calculatedSpending = calculateCurrentMonthSpending(subsData || []);
            setCurrentSpending(calculatedSpending);

            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    await fetch("http://localhost:8080/api/subscriptions/spending", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ spending: calculatedSpending })
                    });
                }
            } catch (err) {
                console.warn("Backend spending notify failed (non-blocking):", err);
            }

            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const res = await fetch("http://localhost:8080/api/user/budget", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (res.ok) {
                        const backendBudget = await res.json();
                        setMonthlyBudget(backendBudget.budget);
                        localStorage.setItem("monthlyBudget", backendBudget.budget);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch backend budget, using localStorage:", err);
            }

            try {
                if (summaryRes && summaryRes.length > 0) {
                    const insightText = await getAIAnalysis(summaryRes);
                    setAiInsight(insightText);
                } else {
                    setAiInsight("Add some subscriptions to get an AI analysis of your spending!");
                }
            } catch (err) {
                console.warn("AI analysis failed:", err);
                setAiInsight("AI analysis unavailable right now.");
            }

            setError(null);
        } catch (err) {
            setError("Failed to fetch dashboard data. Is the backend server running?");
            console.error(err);
        } finally {
            setLoading(false);
            setIsAiLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sortBy, sortDirection]);

    const handleSave = async (subscriptionData) => {
        setIsSubmitting(true);
        const savePromise = editingSubscription
            ? updateSubscription(editingSubscription.id, subscriptionData)
            : createSubscription(subscriptionData);

        toast.promise(savePromise, {
            loading: 'Saving subscription...',
            success: () => {
                fetchData();
                handleCloseModal();
                return 'Subscription saved successfully!';
            },
            error: (err) => `Failed to save: ${err.toString()}`,
        }).finally(() => setIsSubmitting(false));
    };

    const handleDelete = (id) => {
        const deletePromise = deleteSubscription(id);
        toast.promise(deletePromise, {
            loading: 'Deleting subscription...',
            success: () => {
                fetchData();
                return 'Subscription deleted!';
            },
            error: (err) => `Failed to delete: ${err.toString()}`,
        });
    };

    const handleAddClick = () => {
        setEditingSubscription(null);
        setModalOpen(true);
    };

    const handleEditClick = (subscription) => {
        setEditingSubscription(subscription);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!isSubmitting) {
            setModalOpen(false);
            setEditingSubscription(null);
        }
    };

    const handleBudgetSave = async () => {
        const value = parseFloat(budgetInput);
        if (!isNaN(value) && value > 0) {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const res = await fetch("http://localhost:8080/api/user/budget", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ budget: value })
                    });

                    if (!res.ok) throw new Error("Failed to save budget in backend");

                    const backendBudget = await res.json();
                    setMonthlyBudget(backendBudget.budget);
                    localStorage.setItem("monthlyBudget", backendBudget.budget);
                }

                toast.success("Monthly budget updated!");
                setBudgetSaved(true);
            } catch (err) {
                console.error("Budget save failed:", err);
                toast.error("Failed to save budget.");
            }
        } else {
            toast.error("Please enter a valid budget amount.");
        }
    };

    // ✅ Updated CSV download handler
    const handleDownloadDetailedCSV = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/subscriptions/export/monthly-detailed", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to download CSV");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
            const a = document.createElement("a");
            a.href = url;
            a.download = `monthly_spending_${monthName}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast.success("📑 CSV downloaded successfully!");
        } catch (err) {
            console.error("Error downloading detailed CSV:", err);
            toast.error("❌ Failed to download CSV.");
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* ✅ Top Header with Export Button */}

            <AddSubscriptionModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                existingSubscription={editingSubscription}
                isSubmitting={isSubmitting}
            />

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h2">
                            My Subscriptions
                        </Typography>
                        <Button
                            onClick={handleDownloadDetailedCSV}
                            variant="contained"
                            sx={{ backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1e40af" } }}
                        >
                            📑 Export CSV
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <SubscriptionTable
                            subscriptions={subscriptions}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                            onAdd={handleAddClick}
                            isLoading={loading}
                            error={error}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortDirection={sortDirection}
                            setSortDirection={setSortDirection}
                        />

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Monthly Budget</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Set Monthly Budget"
                                    variant="outlined"
                                    size="small"
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                />
                                <Button variant="contained" onClick={handleBudgetSave}>Save</Button>
                            </Box>
                            <Typography variant="body1">
                                Spending: ${currentSpending.toFixed(2)} / ${monthlyBudget}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={monthlyBudget > 0 ? (currentSpending / monthlyBudget) * 100 : 0}
                                sx={{ mt: 1, height: 10, borderRadius: 5 }}
                            />
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Monthly Expense Trend
                            </Typography>
                            {!loading && !error && <ExpenseTrendChart data={monthlyHistory} />}
                        </Paper>
                    </Box>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <AIInsight insight={aiInsight} isLoading={isAiLoading} />

                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" component="h2" gutterBottom>Expense Summary</Typography>
                            <Box sx={{ height: 300 }}>
                                {!loading && !error && <ExpensePieChart data={summaryData} />}
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Upcoming Bills
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {!loading && !error && <UpcomingBills data={upcomingBills} />}
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={budgetSaved}
                autoHideDuration={3000}
                onClose={() => setBudgetSaved(false)}
                message="✅ Budget saved successfully"
            />
        </Container>
    );
};

export default DashboardPage;
